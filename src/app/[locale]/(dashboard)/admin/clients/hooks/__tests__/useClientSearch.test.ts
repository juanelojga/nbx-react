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

  it("strips dangerous characters on initial debounce", () => {
    const onSearchChange = jest.fn();
    renderHook(() =>
      useClientSearch({
        initialSearch: "<bad>",
        onSearchChange,
      })
    );

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

    // Flush initial debounce
    act(() => {
      jest.advanceTimersByTime(DEBOUNCE_DELAY);
    });

    // Simulate URL change (browser back)
    rerender({ initialSearch: "second" });

    expect(result.current.searchInput).toBe("second");
    expect(result.current.debouncedSearch).toBe("second");
  });

  it("handleClearSearch calls onSearchChange with empty string", () => {
    const onSearchChange = jest.fn();
    const { result, rerender } = renderHook(
      ({ initialSearch }) => useClientSearch({ initialSearch, onSearchChange }),
      { initialProps: { initialSearch: "test" } }
    );

    // Flush initial debounce
    act(() => {
      jest.advanceTimersByTime(DEBOUNCE_DELAY);
    });
    onSearchChange.mockClear();

    act(() => {
      result.current.handleClearSearch();
    });

    expect(onSearchChange).toHaveBeenCalledWith("", 1);

    // Simulate parent updating initialSearch after onSearchChange
    rerender({ initialSearch: "" });

    expect(result.current.searchInput).toBe("");
    expect(result.current.debouncedSearch).toBe("");
  });

  it("debounce fires onSearchChange after delay", () => {
    const onSearchChange = jest.fn();
    renderHook(() =>
      useClientSearch({
        initialSearch: "test",
        onSearchChange,
      })
    );

    // Before delay
    expect(onSearchChange).not.toHaveBeenCalled();

    // After delay
    act(() => {
      jest.advanceTimersByTime(DEBOUNCE_DELAY);
    });

    expect(onSearchChange).toHaveBeenCalledWith("test", 1);
  });
});
