import React, { createContext, useContext, useState } from 'react';

const SearchFilterContext = createContext();

export const SearchFilterProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    gender: "",
    size: "",
    color: "",
    minPrice: "",
    maxPrice: "",
    minRating: "",
    sort: "",
  });

  return (
    <SearchFilterContext.Provider value={{ searchQuery, setSearchQuery, filters, setFilters }}>
      {children}
    </SearchFilterContext.Provider>
  );
};

export const useSearchFilter = () => useContext(SearchFilterContext);
