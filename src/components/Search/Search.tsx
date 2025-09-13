import React, { useState } from "react";
import "./Search.css";

interface SearchProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onNew: () => void;
}

const Search: React.FC<SearchProps> = ({ placeholder = "Search...", onSearch, onNew }) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onSearch(query);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="search-container">
      {/* Input */}
      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </div>

      {/* Buttons */}
      <button className="button search-button" onClick={handleSearch}>
        Search
      </button>
      <button className="button new-button" onClick={onNew}>
        New
      </button>
    </div>
  );
};

export default Search;
