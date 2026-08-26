import { Routes, Route } from "react-router-dom";

import Footer from "./components/footer";
import Navbar from "./components/navbar";
import Home from "./pages/home";
import NotFound from "./pages/NotFound";
import Modules from "./pages/modules";
import NoteView from "./pages/NoteView";
import About from "./pages/about";
import Profile from "./pages/Profile";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/notes/:courseCode" element={<Modules />} />
        <Route path="/notes/:courseCode/:moduleId" element={<NoteView />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:username" element={<Profile />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
