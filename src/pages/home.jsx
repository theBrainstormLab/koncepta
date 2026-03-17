import { useState } from "react";
import { Icon } from "@iconify-icon/react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("Computer science");

  return (
    <div className="home">
      <div className="title">
        <h1>learn koncept</h1>
        <h1>with us, using AI</h1>
      </div>
      <div className="subtitle">
        Get the notes you were searching everywhere for.<br />
        Understand things faster without the panic.
      </div>

      <div className="search-bar">
        <span className="search-bar__icon">
          <Icon icon="ri:search-2-line" />
        </span>
        <input
          type="text"
          className="search-bar__input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
        />
        <div className="search-bar__dropdown">
          <select
            className="search-bar__select"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            <option value="Computer science">Computer science</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Physics">Physics</option>
            <option value="Biology">Biology</option>
          </select>
          <span className="search-bar__chevron">
            <Icon icon="iconamoon:arrow-down-2" />
          </span>
        </div>
      </div>
    </div>
  )
}