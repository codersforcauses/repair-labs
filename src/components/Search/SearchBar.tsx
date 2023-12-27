import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface SearchBarProps {
  onSearchChange?: (searchText: string) => void;
  onButtonClick?: (searchText: string) => void;
  className?: string;
  saveInURL?: boolean;
  paramName?: string;
}
export interface SearchBarRef {
  clearSearch: () => void;
}

/**
 * The button will not be clickable if an onButtonClick event isn't provided
 */
const SearchBar = forwardRef<SearchBarRef, SearchBarProps>(
  (
    {
      onSearchChange,
      onButtonClick,
      className,
      saveInURL = false,
      paramName = "search"
    },
    ref
  ) => {
    const [searchText, setSearchText] = useState<string>("");

    const updateURL = (searchText: string) => {
      if (!saveInURL) return;
      const params = new URLSearchParams(window.location.search);

      if (!searchText) params.delete(paramName);
      else params.set(paramName, searchText);

      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState(
        { ...window.history.state, as: newUrl, url: newUrl },
        "",
        newUrl
      );
    };

    useEffect(() => {
      const savedText = new URLSearchParams(window.location.search).get(
        paramName
      );
      if (!saveInURL || !savedText) return;

      setSearchText(savedText);
      onSearchChange?.(savedText);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const search = (text: string) => {
      setSearchText(text);
      onSearchChange?.(text);
      updateURL(text);
    };

    useImperativeHandle(ref, () => ({
      clearSearch: () => search("")
    }));

    return (
      <div className={className}>
        <div className="relative z-10 w-full text-gray-600 h-10 rounded-3xl border-none bg-gray-100 text-sm">
          <input
            className="w-full h-full bg-transparent rounded-[inherit] px-5 py-2 focus:shadow-md focus:outline-none"
            type="search"
            name="search"
            placeholder="Search"
            value={searchText}
            onChange={(e) => search(e.target.value)}
          />
          <button
            className={`absolute right-4 top-2/4 -translate-y-2/4 transform text-gray-500 ${
              onButtonClick ? "" : "pointer-events-none"
            }`}
            onClick={() => onButtonClick?.(searchText)}
          >
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      </div>
    );
  }
);
SearchBar.displayName = "SearchBar";
export default SearchBar;
