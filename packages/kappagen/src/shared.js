export const shared = (function () {
  function random(num) {
    const r = new Uint32Array(1);
    window.crypto.getRandomValues(r);
    const f = r[0] / 4294967295;
    if (num === undefined) return f;
    if (num < 1) return f * num;
    return Math.floor(f * num);
  }

  function doNextFrame(callback) {
    const a = [];
    for (let i = 1, l = arguments.length; i < l; i++) {
      a.push(arguments[i]);
    }
    let n = false;
    function _next() {
      if (n === false) {
        n = true;
        window.requestAnimationFrame(_next);
        return;
      }
      callback(...a);
    }
    window.requestAnimationFrame(_next);
  }

  const msPerFrame = (function () {
    let _init = 0;
    const _avg = [];

    function init() {
      if (msPerFrame.value !== 0) return;
      window.requestAnimationFrame(_test);
    }

    function _test(ms) {
      if (_init !== 0) _avg.push(ms - _init);
      if (_avg.length > 2)
      msPerFrame.value = _avg.reduce((a, b) => a + b) / _avg.length;
      if (_avg.length > 300) {
        msPerFrame.value = Math.round(msPerFrame.value * 1000) / 1000;
        return;
      }
      _init = ms;
      window.requestAnimationFrame(_test);
    }

    return {
      init,
      value: 0,
    };
  })();

  return {
    random,
    doNextFrame,
    msPerFrame,
  };
})();
