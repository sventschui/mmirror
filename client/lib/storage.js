// @flow
if (process.browser) {
  const Cookies = require('js-cookie');
  function checkLocalStorageAvailable() {
    // eslint-disable-next-line no-undef
    if (typeof window === 'undefined' || !('localStorage' in window)) {
      return false;
    }

    const test = 'test';
    try {
      window.localStorage.setItem(test, test);
      window.localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  const isLocalStorageAvailable = checkLocalStorageAvailable();

  function getValue(key: string) {
    if (isLocalStorageAvailable) {
      return localStorage.getItem(key);
    }

    return Cookies.get(`storage-${key}`);
  }

  module.exports = {
    getKeys() {},
  };
} else {
  module.exports = {};
}
