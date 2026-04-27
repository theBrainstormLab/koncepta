import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Icon } from "@iconify-icon/react";

function Modules() {
  const [query, setQuery] = useState("");

  const { state } = useLocation();
  const course = state;

  return (
    <div className="module-page">
      <h1>{course.title}</h1>

      <div className="search-bar">
        <span className="search-bar__icon">
          <Icon icon="ri:search-2-line" />
        </span>

        <input
          type="text"
          className="search-bar__input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search modules..."
        />
      </div>

      <div className="course-grid">
        {course.modules
          .filter((mod) => mod.toLowerCase().includes(query.toLowerCase()))
          .map((mod, i) => (
            <div key={i} className="course-card">
              <h3 className="course-title">{mod}</h3>

              <p className="course-code">Module {i + 1}</p>

              <div className="course-degree">
                <Icon icon="ri:pen-nib-line" />
                {course.title}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Modules;
