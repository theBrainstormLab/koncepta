import { Icon } from "@iconify-icon/react";

function App() {
  return (
    <>
      <div id="home">
        <div className="nav">
          <a href="/" className="nav-item">
            koncepta
          </a>
          <a href="/" className="nav-item">
            about
          </a>
          <div className="nav-icon">
            <Icon icon="ri:sun-line" width="22" height="22" />
          </div>
          <a href="/" className="nav-item">
            notes
          </a>
          <a href="/" className="nav-item">
            syllabus
          </a>
        </div>

        <div className="title">
          <h1>notes</h1>
          <h1>concepts</h1>
          <h1>ready</h1>
        </div>
      </div>
    </>
  );
}

export default App;
