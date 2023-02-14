import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import ShopList from "./pages/ShopList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/ShopList" element={<ShopList />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
