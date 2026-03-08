import { renderHook, act } from "@testing-library/react";
import { useClientSearch } from "../useClientSearch";

jest.useFakeTimers();

const DEBOUNCE_DELAY = 400;

describe("useClientSearch", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("initial state matches initialSearch", () => {
    const { result } = renderHook(() =>
      useClientSearch({
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
      useClientSearch({
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
      useClientSearch({
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
      useClientSearch({
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
      ({ initialSearch }) => useClientSearch({ initialSearch, onSearchChange }),
      { initialProps: { initialSearch: "first" } }
    );

    // Simulate URL change (browser back)
    rerender({ initialSearch: "second" });

    expect(result.current.searchInput).toBe("second");
  });

  it("handleClearSearch calls onSearchChange with empty string", () => {
    const onSearchChange = jest.fn();
    const { result, rerender } = renderHook(
      ({ initialSearch }) => useClientSearch({ initialSearch, onSearchChange }),
      { initialProps: { initialSearch: "test" } }
    );

    act(() => {
      result.current.handleClearSearch();
    });

    expect(onSearchChange).toHaveBeenCalledWith("", 1);

    // Simulate parent updating initialSearch after onSearchChange
    rerender({ initialSearch: "" });

    expect(result.current.searchInput).toBe("");
  });

  it("debounce fires onSearchChange after delay", () => {
    const onSearchChange = jest.fn();
    const { result } = renderHook(() =>
      useClientSearch({
        initialSearch: "",
        onSearchChange,
      })
    );

    act(() => {
      result.current.setSearchInput("query");
    });

    // Before delay
    expect(onSearchChange).not.toHaveBeenCalled();

    // After delay
    act(() => {
      jest.advanceTimersByTime(DEBOUNCE_DELAY);
    });

    expect(onSearchChange).toHaveBeenCalledWith("query", 1);
  });
});
