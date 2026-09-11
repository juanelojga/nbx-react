import { act, renderHook } from "@testing-library/react";

import { useSearchState } from "../useSearchState";

const DEBOUNCE_DELAY = 400;

describe("useSearchState", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("seeds from initialSearch without notifying", () => {
    const onSearchChange = jest.fn();
    const { result } = renderHook(() =>
      useSearchState({ initialSearch: "hello", onSearchChange })
    );

    act(() => {
      jest.advanceTimersByTime(DEBOUNCE_DELAY);
    });

    expect(result.current.searchInput).toBe("hello");
    expect(result.current.debouncedSearch).toBe("hello");
    expect(result.current.isDebouncing).toBe(false);
    expect(onSearchChange).not.toHaveBeenCalled();
  });

  it("notifies once the debounced value settles, stripping unsafe characters", () => {
    const onSearchChange = jest.fn();
    const { result } = renderHook(() =>
      useSearchState({ initialSearch: "", onSearchChange })
    );

    act(() => {
      result.current.setSearchInput("<bad>");
    });
    expect(result.current.isDebouncing).toBe(true);
    expect(onSearchChange).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(DEBOUNCE_DELAY);
    });

    expect(onSearchChange).toHaveBeenCalledWith("bad", 1);
  });

  it("re-seeds the input on external URL changes", () => {
    const { result, rerender } = renderHook(
      ({ initialSearch }) =>
        useSearchState({ initialSearch, onSearchChange: jest.fn() }),
      { initialProps: { initialSearch: "first" } }
    );

    rerender({ initialSearch: "second" });

    expect(result.current.searchInput).toBe("second");
  });

  it("clears immediately", () => {
    const onSearchChange = jest.fn();
    const { result, rerender } = renderHook(
      ({ initialSearch }) => useSearchState({ initialSearch, onSearchChange }),
      { initialProps: { initialSearch: "test" } }
    );

    act(() => {
      result.current.handleClearSearch();
    });

    expect(onSearchChange).toHaveBeenCalledWith("", 1);
    rerender({ initialSearch: "" });
    expect(result.current.searchInput).toBe("");
  });
});
