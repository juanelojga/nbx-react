import "@testing-library/jest-dom";

// Mock next-intl navigation
jest.mock("next-intl/navigation", () => ({
  createNavigation: () => ({
    Link: ({ children, href, ...props }) => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const React = require("react");
      return React.createElement("a", { href, ...props }, children);
    },
    redirect: jest.fn(),
    usePathname: jest.fn(() => "/"),
    useRouter: jest.fn(() => ({
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    })),
  }),
}));

// Mock next-intl routing
jest.mock("next-intl/routing", () => ({
  defineRouting: jest.fn((config) => config),
}));

// Mock HTMLMediaElement for Radix UI components
global.HTMLElement.prototype.scrollIntoView = jest.fn();
global.HTMLElement.prototype.releasePointerCapture = jest.fn();
global.HTMLElement.prototype.hasPointerCapture = jest.fn();

// Mock ResizeObserver used by Radix UI
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock image loading for Radix UI Avatar
// This is crucial for Avatar.Image to work in tests
const originalImage = global.Image;
global.Image = class extends originalImage {
  constructor(...args) {
    super(...args);
    // Trigger onload immediately in next tick
    setTimeout(() => {
      if (this.onload) {
        this.onload(new Event("load"));
      }
    }, 0);
  }
};

// Extend Jest matchers
expect.extend({
  toBeEmptyDOMElement(received) {
    const pass = received.innerHTML === "";
    if (pass) {
      return {
        message: () => `expected element not to be empty`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected element to be empty`,
        pass: false,
      };
    }
  },
});
