export const shared = (function () {
  function getRandomNumber(maxValue?: number) {
    const randomArray = new Uint32Array(1);
    window.crypto.getRandomValues(randomArray);
    const randomFloat = randomArray[0] / 4294967295;
    if (maxValue === undefined) {
      return randomFloat;
    }
    if (maxValue < 1) {
      return randomFloat * maxValue;
    }
    return Math.floor(randomFloat * maxValue);
  }

  function doNextFrame(callback: Function, ...args: any[]) {
    let isPending = false;
    function next() {
      if (isPending === false) {
        isPending = true;
        window.requestAnimationFrame(next);
        return;
      }
      callback(...args);
    }
    window.requestAnimationFrame(next);
  }

  const msPerFrame = (function () {
    let initTime = 0;
    const averageArray: number[] = [];

    function initialize() {
      if (shared.msPerFrame.value !== 0) return;
      window.requestAnimationFrame(test);
    }

    function test(currentTime: number) {
      if (initTime !== 0) averageArray.push(currentTime - initTime);
      if (averageArray.length > 2)
        shared.msPerFrame.value =
          averageArray.reduce((a, b) => a + b) / averageArray.length;
      if (averageArray.length > 300) {
        shared.msPerFrame.value =
          Math.round(shared.msPerFrame.value * 1000) / 1000;
        return;
      }
      initTime = currentTime;
      window.requestAnimationFrame(test);
    }

    return {
      initialize,
      value: 0,
    };
  })();

  return {
    getRandomNumber: getRandomNumber,
    doNextFrame: doNextFrame,
    msPerFrame: msPerFrame,
  };
})();
