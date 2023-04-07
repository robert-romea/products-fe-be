import React from "react";
import "../styles/productCard.scss";

const ProductCard = ({ product, handleCheckboxChange }) => {
  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  }

  return (
    <>
      <div key={product.SKU}>
        <div className="card">
          <div class="card__header">
            <input
              type="checkbox"
              name="delete-checkbox"
              id="delete-checkbox"
              className="delete-checkbox"
              onChange={(event) => handleCheckboxChange(event, product.SKU)}
            />

            <h2 className="card__title"> {product.Name} </h2>
          </div>
          <div className="card__content">
            {/* <p> {product.Details} </p> */}
            <p>SKU: {product.SKU} </p>
            <p>Price: ${product.Price} </p>
            {
              product.Details.weight && (
                <p>Weight: {product.Details.weight}KG </p>
              )
            }
            {
              product.Details.size && (
                <p>Size: {product.Details.size} </p>
              )
            }
            {
              product.Details.length && (
                <p>Dimensions: {product.Details.width}x{product.Details.height}x{product.Details.length} (cm)  </p>
              )
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
