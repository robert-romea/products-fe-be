const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const moment = require("moment");
const https = require("https");
const fs = require("fs");

const app = express();
const port = 3000;

const connection = mysql.createConnection({
  host: "",
  user: "",
  password: "",
  database: "",
  multipleStatements: true, // enable multiple statements
});

// Enable CORS for the React app's domain
app.use(
  cors({
    origin: "https://dolphin-app-tyda7.ondigitalocean.app",
  })
);

// Connect to the MySQL database
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database: ", err);
    return;
  }
  console.log("Connected to database");
});

// Parse JSON request bodies
app.use(express.json());

//API endpoint for retrieving products
app.get("/api/products", (req, res) => {
  // Execute a SELECT query with an inner join to retrieve all complete products from the MySQL database
  connection.query(
    `
    SELECT p.SKU, p.Name, p.Price, 
  CASE
    WHEN b.Weight IS NOT NULL THEN JSON_OBJECT('weight', b.Weight)
    WHEN f.Length IS NOT NULL THEN JSON_OBJECT('length', f.Length, 'width', f.Width, 'height', f.Height)
    WHEN d.Size IS NOT NULL THEN JSON_OBJECT('size', d.Size)
  END AS Details
FROM products p
LEFT JOIN books b ON p.SKU = b.SKU
LEFT JOIN furniture f ON p.SKU = f.SKU
LEFT JOIN dvds d ON p.SKU = d.SKU
WHERE b.SKU IS NOT NULL OR f.SKU IS NOT NULL OR d.SKU IS NOT NULL;

  `,
    (error, results, fields) => {
      if (error) {
        console.error("Error executing query:", error);
        return res
          .status(500)
          .send("Error retrieving products from the database");
      }
      // Return the array of complete products as a JSON response
      return res.status(200).json(results);
    }
  );
});

// API endpoint for adding a product
app.post("/api/products", (req, res) => {
  const { type } = req.query;
  const { sku, name, price, details } = req.body;

  let sql;

  switch (type) {
    case "book":
      if (!details || !details.weight) {
        return res.status(400).send("Weight is required for book products");
      }
      sql = `
          INSERT INTO products (SKU, Name, Price)
          VALUES ('${sku}', '${name}', '${price}');
          INSERT INTO books (SKU, Weight)
          VALUES ('${sku}', '${details.weight}');
        `;
      break;
    case "furniture":
      if (!details || !details.height || !details.width || !details.length) {
        return res
          .status(400)
          .send(
            "Height, width, and length are required for furniture products"
          );
      }
      sql = `
          INSERT INTO products (SKU, Name, Price)
          VALUES ('${sku}', '${name}', '${price}');
          INSERT INTO furniture (SKU, Height, Width, Length)
          VALUES ('${sku}', ${details.height}, ${details.width}, ${details.length});
        `;
      break;
    case "dvd":
      if (!details || !details.size) {
        return res.status(400).send("Size is required for DVD products");
      }
      sql = `
          INSERT INTO products (SKU, Name, Price)
          VALUES ('${sku}', '${name}', '${price}');
          INSERT INTO dvds (SKU, Size)
          VALUES ('${sku}', '${details.size}');
        `;
      break;
    default:
      return res.status(400).send("Invalid product type");
  }

  connection.query(sql, (error, results, fields) => {
    if (error) {
      console.error("Error executing query:", error);
      return res.status(500).send("Error inserting product into the database");
    }
    return res.status(200).json({ message: "Product inserted successfully" });
  });
});

// API endpoint for deleting a product by SKU
// app.delete("/api/products/:sku", (req, res) => {
//   const { sku } = req.params;

//   // First, delete the product from the specific product type table (books, furniture, or dvds)
//   const deleteSpecificProduct = `
//     DELETE b, f, d
//     FROM books b
//     LEFT JOIN furniture f ON b.SKU = f.SKU
//     LEFT JOIN dvds d ON b.SKU = d.SKU
//     WHERE b.SKU = '${sku}' OR f.SKU = '${sku}' OR d.SKU = '${sku}';
//   `;

//   connection.query(deleteSpecificProduct, (error, results, fields) => {
//     if (error) {
//       console.error("Error executing query:", error);
//       return res.status(500).send("Error deleting specific product from the database");
//     }

//     // If no rows were affected, the specified SKU was not found
//     if (results.affectedRows === 0) {
//       return res.status(404).send("Product not found");
//     }

//     // Next, delete the product from the main products table
//     const deleteProduct = `
//       DELETE FROM products WHERE SKU = '${sku}';
//     `;

//     connection.query(deleteProduct, (error, results, fields) => {
//       if (error) {
//         console.error("Error executing query:", error);
//         return res.status(500).send("Error deleting product from the database");
//       }

//       // Return a success message
//       return res.status(200).json({ message: "Product deleted successfully" });
//     });
//   });
// });

app.delete("/api/products/:sku", (req, res) => {
  const { sku } = req.params;

  // Start a transaction to ensure all deletions are successful or rolled back
  connection.beginTransaction((error) => {
    if (error) {
      console.error("Error starting transaction:", error);
      return res.status(500).send("Error starting transaction");
    }

    // First, delete the product from the specific product type tables (books, furniture, or dvds)
    const deleteSpecificProduct = `
      DELETE FROM books WHERE SKU = '${sku}';
      DELETE FROM furniture WHERE SKU = '${sku}';
      DELETE FROM dvds WHERE SKU = '${sku}';
    `;

    connection.query(deleteSpecificProduct, (error, results, fields) => {
      if (error) {
        console.error("Error executing query:", error);
        connection.rollback();
        return res
          .status(500)
          .send("Error deleting specific product from the database");
      }

      // Next, delete the product from the main products table
      const deleteProduct = `
        DELETE FROM products WHERE SKU = '${sku}';
      `;

      connection.query(deleteProduct, (error, results, fields) => {
        if (error) {
          console.error("Error executing query:", error);
          connection.rollback();
          return res
            .status(500)
            .send("Error deleting product from the database");
        }

        // If no rows were affected, the specified SKU was not found
        if (results.affectedRows === 0) {
          connection.rollback();
          return res.status(404).send("Product not found");
        }

        // Commit the transaction
        connection.commit((error) => {
          if (error) {
            console.error("Error committing transaction:", error);
            connection.rollback();
            return res.status(500).send("Error committing transaction");
          }

          // Return a success message
          return res
            .status(200)
            .json({ message: "Product deleted successfully" });
        });
      });
    });
  });
});

// const privateKey = fs.readFileSync("key.pem", "utf8");
// const certificate = fs.readFileSync("cert.pem", "utf8");
// const credentials = { key: privateKey, cert: certificate };

// const httpsServer = https.createServer(credentials, app);

// Start the server
// httpsServer.listen(port, "0.0.0.0", () => {
//   console.log(`HTTPS Server running on port ${port}`);
// });

// Start the server

const privateKey = fs.readFileSync(
  "/etc/letsencrypt/live/my-prod-api.online/privkey.pem",
  "utf8"
);
const certificate = fs.readFileSync(
  "/etc/letsencrypt/live/my-prod-api.online/fullchain.pem",
  "utf8"
);

const sslOptions = {
  key: privateKey,
  cert: certificate,
  secureProtocol: "TLSv1_2_method", // TLSv1.2
  // Uncomment the line below to enable both TLSv1.2 and TLSv1.3
  // secureProtocol: 'TLSv1_3_method', // TLSv1.3
};

const server = https.createServer(sslOptions, app);

server.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});