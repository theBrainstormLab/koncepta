import { Routes, Route } from 'react-router-dom'

import Footer from "./components/footer";
import Navbar from "./components/navbar";
import Home from "./pages/home";
import NotFound from './pages/NotFound';
import Modules from './pages/modules';
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/modules" element={<Modules />} />
        {/* <Route path="/about" element={<About />} /> */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
