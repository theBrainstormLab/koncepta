import { Routes, Route } from 'react-router-dom'

import Footer from "./components/footer";
import Navbar from "./components/navbar";
import Home from "./pages/home";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/about" element={<About />} /> */}
      </Routes>
      <Footer />
    </>

  );
}

export default App;
