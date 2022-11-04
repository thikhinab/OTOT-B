import { BrowserRouter, Routes, Route } from "react-router-dom";
import Books from "./pages/Books";
import Serverless from "./pages/Serverless";
import NavigationBar from "./components/NavigationBar";

function App() {
  return (
    <BrowserRouter>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Books />} />
        <Route path="serverless" element={<Serverless />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
