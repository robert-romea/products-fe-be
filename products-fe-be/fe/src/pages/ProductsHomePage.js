import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/productPage.scss";
import ProductCard from "../components/ProductCard";

const ProductsHomePage = () => {
  // display data from this api    ​http://localhost:3000/api/products
  //  use the useEffect hook to fetch the data

  const [products, setProducts] = useState([]);
  const [checkedProducts, setCheckedProducts] = useState(new Set());

  // useEffect(() => {
  //   axios
  //     .get("http://localhost:3000/api/products")
  //     .then((response) => {
  //       setProducts(response.data);
  //       console.log(products);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`https://my-prod-api.online/api/products`);
      setProducts(response.data);
      console.log(products);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
    
  }, []);
  

  // use a function to display the date beautifuly
  // if the month = 2, display February and so on

  const handleCheckboxChange = (event, sku) => {
    const updatedCheckedProducts = new Set(checkedProducts);
    if (event.target.checked) {
      updatedCheckedProducts.add(sku);
      console.log(updatedCheckedProducts);
    } else {
      updatedCheckedProducts.delete(sku);
    }
    setCheckedProducts(updatedCheckedProducts);
  };

  const handleDeleteChecked = async () => {
    try {
      const deleteRequests = Array.from(checkedProducts).map((sku) =>
        axios.delete(`https://my-prod-api.online/api/products/${sku}`)
      );
      await Promise.all(deleteRequests);
      setCheckedProducts(new Set());
      // Reload the products after successful deletion
      fetchProducts(); // Assuming you have a fetchProducts() function to fetch the products from the backend
    } catch (error) {
      console.error('Error deleting products:', error);

      // Display an error message or handle the error as needed
    }
  };




  return (
    <div className="products-page">
      <div className="header-section">
        <h1>Product List</h1>
        <div className="buttons">
          <a href="/add-product">
          <button className="button" >ADD</button>
          </a>
          <button className="button" onClick={handleDeleteChecked}>MASS DELETE</button>
        </div>
      </div>

      <div className="horisontal-line"> </div>

      <div className="products-grid">
        {products.map((product) => {
          return <ProductCard product={product} handleCheckboxChange={handleCheckboxChange} />;
        })}
      </div>

      <div className="footer"> 
      <div className="horisontal-line h2"> </div>
      <div className="footer-content">
        <p> Some random footer </p>
      </div>
    </div>
    </div>
  );
};

export default ProductsHomePage;
