import "./SearchHeader.css";

function SearchHeader() {
  return (
    <section className="search-header">
      <div className="search-bar">
        <input
          type="text"
          placeholder="What service do you need?"
        />
      </div>
    </section>
  );
}

export default SearchHeader;
