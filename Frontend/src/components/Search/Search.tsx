import React, { useState } from "react";
import "./Search.css";
import Popup from "../Popup/Popup";

interface SearchProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onNew?: () => void;
}

const Search: React.FC<SearchProps> = ({ placeholder = "Search...", onSearch, onNew }) => {
  const [query, setQuery] = useState("");
  const [popupType, setPopupType] = useState<"loading" | "done" | "notdone" | null>(null);
  const [popupMessage, setPopupMessage] = useState<string>("");

  const handleSearch = () => {
    if (!query) {
      setPopupType("notdone");
      setPopupMessage("Please enter a search value");
      return;
    }
    if (onSearch) onSearch(query);
  };

  const handleNew = () => {
    if (onNew) {
      onNew();
    } else {
      // Default behavior: refresh page
      window.location.href = window.location.href;
    }
  };

  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
      </div>

      <button className="button search-button" onClick={handleSearch}>
        Search
      </button>

      <button className="button new-button" onClick={handleNew}>
        New
      </button>

      {popupType && (
        <Popup
          isOpen={true}
          type={popupType}
          message={popupMessage}
          onClose={() => setPopupType(null)}
        />
      )}
    </div>
  );
};

export default Search;
