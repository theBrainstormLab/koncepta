import Footer from "./components/footer";
import Navbar from "./components/navbar";
import Home from "./pages/home";

function App() {
  return (
    <>
      <Navbar />
      <div id="content">
        <Home />
      </div>
      <Footer />
    </>
  );
}

export default App;
