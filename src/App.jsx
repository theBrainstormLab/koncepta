import Footer from "./components/footer";
import Navbar from "./components/navbar";

function App() {
  return (
    <>
      <div id="content">
        <Navbar />

        <div className="title">
          <h1>notes</h1>
          <h1>concepts</h1>
          <h1>ready</h1>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default App;
