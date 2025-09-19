import React, { useState } from "react";
import "./Search.css";
import Popup from "../Popup/Popup";

interface SearchProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onNew: () => void;
}

const Search: React.FC<SearchProps> = ({ placeholder = "Search...", onSearch, onNew }) => {
  const [query, setQuery] = useState("");
  const [popupType, setPopupType] = useState<"loading" | "done" | "notdone" | null>(null);
  const [popupMessage, setPopupMessage] = useState<string>("");

  const handleSearch = () => {
    setPopupType("loading");
    onSearch(query);

    // simulate async API
    setTimeout(() => {
      const success = Math.random() > 0.5;
      if (success) {
        setPopupMessage("Search completed!");
        setPopupType("done");
      } else {
        setPopupMessage("Search failed!");
        setPopupType("notdone");
      }
    }, 2000);
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

      <button className="button search-button" onClick={handleSearch}>Search</button>
      <button className="button new-button" onClick={onNew}>New</button>

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
