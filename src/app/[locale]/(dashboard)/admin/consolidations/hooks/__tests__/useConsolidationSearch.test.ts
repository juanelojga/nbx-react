import { renderHook, act } from "@testing-library/react";
import { useConsolidationSearch } from "../useConsolidationSearch";

jest.useFakeTimers();

const DEBOUNCE_DELAY = 400;

describe("useConsolidationSearch", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("initial state matches initialSearch", () => {
    const { result } = renderHook(() =>
      useConsolidationSearch({
        initialSearch: "hello",
        onSearchChange: jest.fn(),
      })
    );

    expect(result.current.searchInput).toBe("hello");
    expect(result.current.debouncedSearch).toBe("hello");
    expect(result.current.isDebouncing).toBe(false);
  });

  it("does not call onSearchChange on mount", () => {
    const onSearchChange = jest.fn();
    renderHook(() =>
      useConsolidationSearch({
        initialSearch: "test",
        onSearchChange,
      })
    );

    act(() => {
      jest.advanceTimersByTime(DEBOUNCE_DELAY);
    });

    expect(onSearchChange).not.toHaveBeenCalled();
  });

  it("does not lose the first typed character", () => {
    const onSearchChange = jest.fn();
    const { result } = renderHook(() =>
      useConsolidationSearch({
        initialSearch: "",
        onSearchChange,
      })
    );

    act(() => {
      result.current.setSearchInput("a");
    });

    expect(result.current.searchInput).toBe("a");
    expect(result.current.isDebouncing).toBe(true);

    act(() => {
      jest.advanceTimersByTime(DEBOUNCE_DELAY);
    });

    expect(result.current.debouncedSearch).toBe("a");
    expect(onSearchChange).toHaveBeenCalledWith("a", 1);
  });

  it("strips dangerous characters after debounce", () => {
    const onSearchChange = jest.fn();
    const { result } = renderHook(() =>
      useConsolidationSearch({
        initialSearch: "",
        onSearchChange,
      })
    );

    act(() => {
      result.current.setSearchInput("<bad>");
    });

    act(() => {
      jest.advanceTimersByTime(DEBOUNCE_DELAY);
    });

    expect(onSearchChange).toHaveBeenCalledWith("bad", 1);
  });

  it("syncs when initialSearch changes (browser back/forward)", () => {
    const onSearchChange = jest.fn();
    const { result, rerender } = renderHook(
      ({ initialSearch }) =>
        useConsolidationSearch({ initialSearch, onSearchChange }),
      { initialProps: { initialSearch: "first" } }
    );

    rerender({ initialSearch: "second" });

    expect(result.current.searchInput).toBe("second");
  });

  it("handleClearSearch calls onSearchChange with empty string", () => {
    const onSearchChange = jest.fn();
    const { result, rerender } = renderHook(
      ({ initialSearch }) =>
        useConsolidationSearch({ initialSearch, onSearchChange }),
      { initialProps: { initialSearch: "test" } }
    );

    act(() => {
      result.current.handleClearSearch();
    });

    expect(onSearchChange).toHaveBeenCalledWith("", 1);

    rerender({ initialSearch: "" });

    expect(result.current.searchInput).toBe("");
  });

  it("debounce fires onSearchChange after delay", () => {
    const onSearchChange = jest.fn();
    const { result } = renderHook(() =>
      useConsolidationSearch({
        initialSearch: "",
        onSearchChange,
      })
    );

    act(() => {
      result.current.setSearchInput("query");
    });

    expect(onSearchChange).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(DEBOUNCE_DELAY);
    });

    expect(onSearchChange).toHaveBeenCalledWith("query", 1);
  });
});
