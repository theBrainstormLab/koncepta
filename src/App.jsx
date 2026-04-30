import { Routes, Route } from "react-router-dom";

import Footer from "./components/footer";
import Navbar from "./components/navbar";
import Home from "./pages/home";
import NotFound from "./pages/NotFound";
import Modules from "./pages/modules";
import NoteView from "./pages/NoteView";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/modules" element={<Modules />} />
        <Route path="/note-view" element={<NoteView />} />

        {/* <Route path="/about" element={<About />} /> */}
      </Routes>
      <Footer />
    </>
  );
}

export default App;
