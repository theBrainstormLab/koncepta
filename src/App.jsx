import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import Footer from "./components/footer";
import Navbar from "./components/navbar";
import RouteFallback from "./components/RouteFallback";

const Home = lazy(() => import("./pages/home"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Modules = lazy(() => import("./pages/modules"));
const NoteView = lazy(() => import("./pages/NoteView"));
const About = lazy(() => import("./pages/about"));
const Profile = lazy(() => import("./pages/Profile"));
const Papers = lazy(() => import("./pages/Papers"));

function App() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/notes/:courseCode" element={<Modules />} />
          <Route path="/notes/:courseCode/:moduleId" element={<NoteView />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/papers" element={<Papers />} />
        </Routes>
      </Suspense>
      <Footer />
    </>
  );
}

export default App;
