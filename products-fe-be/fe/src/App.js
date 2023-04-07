import ProductsHomePage from "./pages/ProductsHomePage";
import AddProductPage from "./pages/AddProductPage";
import { Routes, Route, BrowserRouter } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProductsHomePage />}></Route>
          <Route path="/add-product" element={<AddProductPage />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
