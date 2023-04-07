// ProductForm.js
import React, { useState } from "react";
import axios from "axios";

import "../styles/addProductsForm.scss";

const ProductForm = () => {
  const [type, setType] = useState("default");
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [details, setDetails] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `https://my-prod-api.online/api/products?type=${type}`,
        {
          sku,
          name,
          price,
          details,
        }
      );

      if (response.status === 200) {
        alert("Product inserted successfully");
        // Clear form fields
        setSku("");
        setName("");
        setPrice("");
        setDetails({});
        window.location.replace("/");
      }
    } catch (error) {
      alert(error.response.data);
    }
  };

  function handleDiscard() {
    setSku("");
    setName("");
    setPrice("");
    setDetails({});
    window.location.replace("/");
  }

  return (
    <>
      <div className="header-section">
        <h1>Product List</h1>
        <div className="buttons">
          <button className="button" onClick={handleSubmit}>
            Save
          </button>

          <button className="button" onClick={handleDiscard}>
            Cancel
          </button>
        </div>
      </div>
      <div className="horisontal-line"> </div>
      <form onSubmit={handleSubmit} id="product_form">
   
        <p> A unique identifier for the product. </p>
        <div>
        <label htmlFor="sku">
          
          SKU:
           </label>
          <input
          id="sku"
            type="text"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            required
          />
       </div>
        <p> The name or title of the product.</p>
        <div>
        <label htmlFor="name">
          Name: </label>
          <input
          id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
       </div>
        <p> The cost of the product in dollars  </p>
        <div>
        <label htmlFor="price" >
          Price:</label>
          <input
            type="number"
            id="price"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        

        <h4>Please select the product type (book, furniture, DVD) </h4>
        <div>
        <label htmlFor="productType">
          
          
          Product type:
          </label>
          <select value={type} onChange={(e) => setType(e.target.value)} id="productType">
            <option value="default" selected>  Please enter a type </option>
            <option value="book">Book</option>
            <option value="furniture">Furniture</option>
            <option value="dvd">DVD</option>
          </select>
       
          </div>
        {type === "book" && (
          <>
          <p> The weight of the book in KG </p>
          <div>
          <label htmlFor="weight">
            
            Weight:
           </label>
            <input
            id="weight"
              type="text"
              value={details.weight || ""}
              onChange={(e) => setDetails({ ...details, weight: e.target.value })}
              required
            />
          
          </div>
          </>
        )}
        {type === "furniture" && (
          <>
          <p> The dimensions of the furniture in centimeters (cm) </p>
          <div className="furn">
            <label htmlFor="height">
             
              Height:
              </label>
              <input
              id="height"
                type="number"
                value={details.height || ""}
                onChange={(e) =>
                  setDetails({ ...details, height: e.target.value })
                }
                required
              />
           </div>

           <div className="furn">
            <label  
            htmlFor="width"
            >
             
              Width:
               </label>
              <input
              id="width"
                type="number"
                value={details.width || ""}
                onChange={(e) =>
                  setDetails({ ...details, width: e.target.value })
                }
                required
              />
          </div>
          <div className="furn">
            <label
            htmlFor="length"
            >
             
              Length:
            </label>
              <input
              id="length"
                type="number"
                value={details.length || ""}
                onChange={(e) =>
                  setDetails({ ...details, length: e.target.value })
                }
                required
              />
            
          </div>
          </>
        )}
        {type === "dvd" && (
          <>
          <p> The size of the DVD in MB </p>
          <div>
          <label 
          htmlFor="size"
          > 
         
            Size:
            </label>
            <input
            id="size"
              type="text"
              value={details.size || ""}
              onChange={(e) => setDetails({ ...details, size: e.target.value })}
              required
            />
         
          </div>
          </>
        )}
        {/* <button type="submit">Add Product</button> */}
      </form>
    </>
  );
};

export default ProductForm;
