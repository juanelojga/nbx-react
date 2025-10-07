import "@testing-library/jest-dom";

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
