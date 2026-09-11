import { act, renderHook } from "@testing-library/react";

import { useRateLimit } from "../useRateLimit";

describe("useRateLimit", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-01-01T00:00:00Z"));
    sessionStorage.clear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("allows maxAttempts and locks the next one", () => {
    const { result } = renderHook(() => useRateLimit(3, 60_000));

    const verdicts: boolean[] = [];
    act(() => {
      verdicts.push(result.current.attempt());
      verdicts.push(result.current.attempt());
      verdicts.push(result.current.attempt());
      verdicts.push(result.current.attempt());
    });

    expect(verdicts).toEqual([true, true, true, false]);
    expect(result.current.isLocked).toBe(true);
    expect(result.current.remaining).toBe(0);
  });

  it("computes the verdict synchronously for calls in the same tick", () => {
    const { result } = renderHook(() => useRateLimit(1, 60_000));

    let first = false;
    let second = true;
    act(() => {
      first = result.current.attempt();
      second = result.current.attempt();
    });

    expect(first).toBe(true);
    expect(second).toBe(false);
  });

  it("unlocks after the window elapses", () => {
    const { result } = renderHook(() => useRateLimit(1, 1_000));

    act(() => {
      result.current.attempt();
    });
    expect(result.current.isLocked).toBe(true);

    act(() => {
      jest.advanceTimersByTime(1_001);
    });
    expect(result.current.isLocked).toBe(false);
    expect(result.current.attempts).toBe(0);
  });

  it("persists the lock across remounts when a storage key is given", () => {
    const first = renderHook(() => useRateLimit(1, 60_000, "rl-test"));
    act(() => {
      first.result.current.attempt();
    });
    first.unmount();

    const second = renderHook(() => useRateLimit(1, 60_000, "rl-test"));
    expect(second.result.current.isLocked).toBe(true);

    let verdict = true;
    act(() => {
      verdict = second.result.current.attempt();
    });
    expect(verdict).toBe(false);
  });

  it("reset clears the counter and storage", () => {
    const { result } = renderHook(() => useRateLimit(1, 60_000, "rl-reset"));
    act(() => {
      result.current.attempt();
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.isLocked).toBe(false);
    expect(sessionStorage.getItem("rl-reset")).toBeNull();
  });
});
