import "@testing-library/jest-dom"; // Extra matchers for Jest
global.matchMedia =
  global.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: () => {},
      removeListener: () => {},
    };
  };
