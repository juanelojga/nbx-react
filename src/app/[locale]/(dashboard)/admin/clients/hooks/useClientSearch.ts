import { useCallback, useEffect, useRef, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";

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
  const debouncedRaw = useDebounce(searchInput, debounceDelay);
  const debouncedSearch = sanitizeInput(debouncedRaw);
  const isDebouncing = searchInput !== debouncedRaw;

  // Track last value sent to parent via render-time state
  const [lastSentSearch, setLastSentSearch] = useState(initialSearch);
  const [prevDebouncedSearch, setPrevDebouncedSearch] =
    useState(debouncedSearch);
  if (prevDebouncedSearch !== debouncedSearch) {
    setPrevDebouncedSearch(debouncedSearch);
    setLastSentSearch(debouncedSearch);
  }

  // Sync from URL only for external changes (browser back/forward)
  const [prevInitialSearch, setPrevInitialSearch] = useState(initialSearch);
  if (prevInitialSearch !== initialSearch) {
    setPrevInitialSearch(initialSearch);
    if (initialSearch !== lastSentSearch) {
      setSearchInput(initialSearch);
    }
  }

  // Fire onSearchChange only when debounced value actually changes
  const prevDebouncedRef = useRef(debouncedSearch);
  useEffect(() => {
    if (prevDebouncedRef.current !== debouncedSearch) {
      prevDebouncedRef.current = debouncedSearch;
      onSearchChange(debouncedSearch, 1);
    }
  }, [debouncedSearch, onSearchChange]);

  const handleClearSearch = useCallback(() => {
    setSearchInput("");
    setLastSentSearch("");
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
