import { useCallback, useEffect, useState } from "react";

const DEBOUNCE_DELAY = 400;
const DANGEROUS_CHARS_REGEX = /[<>{};\\\[\]]/g;

function sanitizeInput(input: string): string {
  return input.replace(DANGEROUS_CHARS_REGEX, "").trim();
}

interface UseClientSearchOptions {
  initialSearch: string;
  onSearchChange: (search: string, page: number) => void;
  debounceDelay?: number;
}

interface UseClientSearchReturn {
  searchInput: string;
  setSearchInput: (value: string) => void;
  debouncedSearch: string;
  isDebouncing: boolean;
  handleClearSearch: () => void;
}

export function useClientSearch({
  initialSearch,
  onSearchChange,
  debounceDelay = DEBOUNCE_DELAY,
}: UseClientSearchOptions): UseClientSearchReturn {
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [isDebouncing, setIsDebouncing] = useState(false);

  // Sync search input from URL when it changes (e.g., browser back/forward)
  useEffect(() => {
    if (initialSearch !== searchInput && !isDebouncing) {
      setSearchInput(initialSearch);
      setDebouncedSearch(initialSearch);
    }
  }, [initialSearch, searchInput, isDebouncing]);

  // Debounce search input and update URL
  useEffect(() => {
    if (searchInput !== debouncedSearch) {
      setIsDebouncing(true);
    }

    const timer = setTimeout(() => {
      const sanitized = sanitizeInput(searchInput);
      setDebouncedSearch(sanitized);
      onSearchChange(sanitized, 1);
      setIsDebouncing(false);
    }, debounceDelay);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const handleClearSearch = useCallback(() => {
    setSearchInput("");
    setDebouncedSearch("");
    onSearchChange("", 1);
  }, [onSearchChange]);

  return {
    searchInput,
    setSearchInput,
    debouncedSearch,
    isDebouncing,
    handleClearSearch,
  };
}
