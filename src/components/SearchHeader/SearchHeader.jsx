import { useState } from "react";
import "./SearchHeader.css";

function SearchHeader({ onSearch }) {
  const [search, setSearch] = useState("");

  function handleChange(event) {
    const value = event.target.value;
    setSearch(value);
    onSearch(value);
  }

  return (
    <section className="search-header">
      <div className="search-bar">
        <input
          type="text"
          placeholder="What service do you need?"
          value={search}
          onChange={handleChange}
        />
      </div>
    </section>
  );
}

export default SearchHeader;
