import React, { useState } from "react";
import "./Search.css";

interface SearchProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onSave?: () => void;
  onUpdate?: () => void;
  onNew: () => void;
  showSaveOrUpdate?: "save" | "update"; // determines which button replaces search
}

const Search: React.FC<SearchProps> = ({
  placeholder = "Search...",
  onSearch,
  onSave,
  onUpdate,
  onNew,
  showSaveOrUpdate = "save",
}) => {
  const [searched, setSearched] = useState(false);
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onSearch(query);
    setSearched(true); // replace search button with save/update
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

      {/* Left button: Search initially, Save/Update after click */}
      {!searched && (
        <button className="button search-button" onClick={handleSearch}>
          Search
        </button>
      )}

      {searched && showSaveOrUpdate === "save" && onSave && (
        <button className="button save-button" onClick={onSave}>
          Save
        </button>
      )}
      {searched && showSaveOrUpdate === "update" && onUpdate && (
        <button className="button update-button" onClick={onUpdate}>
          Update
        </button>
      )}

      {/* Right button: New always */}
      <button className="button new-button" onClick={onNew}>
        New
      </button>
    </div>
  );
};

export default Search;
