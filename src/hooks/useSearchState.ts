"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useDebounce } from "@/hooks/useDebounce";

const DEBOUNCE_DELAY = 400;
const DANGEROUS_CHARS_REGEX = /[<>{};\\[\]]/g;

function sanitizeSearch(input: string): string {
  return input.replace(DANGEROUS_CHARS_REGEX, "").trim();
}

export interface UseSearchStateOptions {
  /** Search term currently in the URL. */
  initialSearch: string;
  /** Called with the debounced term and the page to reset to. */
  onSearchChange: (search: string, page: number) => void;
  debounceDelay?: number;
}

export interface UseSearchStateReturn {
  searchInput: string;
  setSearchInput: (value: string) => void;
  debouncedSearch: string;
  isDebouncing: boolean;
  handleClearSearch: () => void;
}

/**
 * Debounced search box state that stays in sync with a URL-backed value:
 * typing updates the input immediately, the parent is notified once the
 * debounced value settles, and external URL changes (back/forward) re-seed
 * the input without echoing back.
 */
export function useSearchState({
  initialSearch,
  onSearchChange,
  debounceDelay = DEBOUNCE_DELAY,
}: UseSearchStateOptions): UseSearchStateReturn {
  const [searchInput, setSearchInput] = useState(initialSearch);
  const debouncedRaw = useDebounce(searchInput, debounceDelay);
  const debouncedSearch = sanitizeSearch(debouncedRaw);
  const isDebouncing = searchInput !== debouncedRaw;

  const [lastSentSearch, setLastSentSearch] = useState(initialSearch);
  const [prevDebouncedSearch, setPrevDebouncedSearch] =
    useState(debouncedSearch);
  if (prevDebouncedSearch !== debouncedSearch) {
    setPrevDebouncedSearch(debouncedSearch);
    setLastSentSearch(debouncedSearch);
  }

  const [prevInitialSearch, setPrevInitialSearch] = useState(initialSearch);
  if (prevInitialSearch !== initialSearch) {
    setPrevInitialSearch(initialSearch);
    if (initialSearch !== lastSentSearch) {
      setSearchInput(initialSearch);
    }
  }

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
