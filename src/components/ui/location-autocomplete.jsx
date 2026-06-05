import React, { useEffect, useRef, useState } from "react";
import { searchLocations } from "@/Service/GlobalApi";

function LocationAutocomplete({ onSelect, placeholder, className }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await searchLocations(query);
        setSuggestions(results);
        setIsOpen(results.length > 0);
      } catch (err) {
        console.error("Location search failed:", err);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (location) => {
    setQuery(location.label);
    setIsOpen(false);
    onSelect?.(location);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => suggestions.length > 0 && setIsOpen(true)}
        placeholder={placeholder || "Enter a City"}
        className={className}
        autoComplete="off"
      />
      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full rounded-md border border-input bg-background shadow-lg max-h-60 overflow-auto">
          {suggestions.map((item, index) => (
            <li
              key={`${item.label}-${index}`}
              onClick={() => handleSelect(item)}
              className="cursor-pointer px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground text-left"
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
      {isLoading && query.length >= 2 && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          ...
        </span>
      )}
    </div>
  );
}

export default LocationAutocomplete;
