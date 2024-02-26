import { cfg, twirAppEmote } from './config.ts'

export const shared = (function () {
  const PROTECTED_KEYS = [
    '__proto__',
    'constructor',
    'prototype'
  ]

  function isObject(obj) {
    if (typeof obj === 'object' && obj !== null) {
      if (typeof Object.getPrototypeOf === 'function') {
        const prototype = Object.getPrototypeOf(obj)
        return prototype === Object.prototype || prototype === null
      }

      return Object.prototype.toString.call(obj) === '[object Object]'
    }

    return false
  }

  function deepMerge(...objects) {
    return objects.reduce((result, current) => {
      Object.keys(current).forEach((key) => {
        if (PROTECTED_KEYS.includes(key)) {
          return
        }

        if (Array.isArray(result[key]) && Array.isArray(current[key])) {
          result[key] = false
            ? Array.from(new Set(result[key].concat(current[key])))
            : current[key]
        } else if (isObject(result[key]) && isObject(current[key])) {
          result[key] = deepMerge(result[key], current[key])
        } else {
          result[key] = current[key]
        }
      })

      return result
    }, {})
  }

  function framePause(frames = 1) {
    return new Promise(function (resolve) {
      if (frames < 1) {
        resolve(false)
        return
      }
      let n = 0
      function _next() {
        n++
        if (n < frames) {
          requestAnimationFrame(_next)
          return
        }
        resolve(true)
      }
      requestAnimationFrame(_next)
    })
  }

  function countEstimatedTime(ct, t = false) {
    if (t === false) t = Math.floor(cfg.emote.time * 1000)
    const f = Math.floor(t / shared.msPerFrame.value)
    const r = f / ct
    if (r > 1) return { f: Math.ceil(r), ct: 1 }
    return { f: 1, ct: Math.ceil(1 / r) }
  }

  function sleep(ms) {
    if (ms < shared.msPerFrame.value) {
      return framePause()
    }

    return new Promise((resolve) => {
      let startMs = 0

      function next(timestamp) {
        if (startMs === 0) {
          startMs = timestamp
          requestAnimationFrame(next)
          return
        } else if (timestamp - startMs < ms) {
          requestAnimationFrame(next)
          return
        }
        resolve(true)
      }
      requestAnimationFrame(next)
    })
  }

  function safePoints(h, v, th, r, fL, fT, fR, fB) {
    const hD = Math.floor(h + r * Math.cos(th))
    const vD = Math.floor(v + r * Math.sin(th))
    const slope = Math.tan(th)

    let hL = Number.MAX_SAFE_INTEGER
    let hU = 0
    let vL = Number.MAX_SAFE_INTEGER
    let vU = 0

    if (hD < fL) {
      hL = h - (hU = fL)
    } else if (hD > fR) {
      hL = (hU = fR) - h
    }

    if (vD < fT) {
      vL = v - (vU = fT)
    } else if (vD > fB) {
      vL = (vU = fB) - v
    }

    if (vU === 0 && hU === 0) return true
    let vT = vU
    let hT = hU

    if (hL > vL) {
      hT = Math.floor((vT - v) / slope + h)
    } else {
      vT = Math.floor((hT - h) * slope + v)
    }

    const l = Math.sqrt(Math.abs(h - hT) ** 2 + Math.abs(v - vT) ** 2)
    return l > Math.ceil(r / 2)
  }

  function setImgSrc(img, url) {
    img.alt = ''

    img.onload = function () {
      img.onerror = null
      img.onload = null
    }

    img.onerror = function () {
      img.onerror = null
      img.onload = null
      img.src = twirAppEmote
    }

    img.src = url
  }

  function styleEmoteString(aNames, aDelays, aDurs, aTimings, aFills, aIters) {
    let style = ''

    if (aNames.length > 0) {
      style += ' animation-name: ' + aNames.join() + ';'
      style += ' animation-delay: ' + aDelays.join() + ';'
      style += ' animation-duration: ' + aDurs.join() + ';'
      style += ' animation-timing-function: ' + aTimings.join() + ';'
      style += ' animation-fill-mode: ' + aFills.join() + ';'
      style += ' animation-iteration-count: ' + aIters.join() + ';'
    }

    if (aNames.includes('fadeIn')) {
      style += ' opacity: 0;'
    }

    return style
  }

  function styleEmote(
    aNames,
    aDelays,
    aDurs,
    aTimings,
    aFills,
    aIters,
    fadeIn = true,
    zoomIn = true,
    fadeOut = true,
    zoomOut = true,
    tMS = false
  ) {
    if (tMS === false) {
      tMS = Math.floor(cfg.emote.time * 1000)
    }

    const tFI = cfg.emote.animation.fade.in / 100
    const tFO = cfg.emote.animation.fade.out / 100
    const tZI = cfg.emote.animation.zoom.in / 100
    const tZO = cfg.emote.animation.zoom.out / 100

    if (fadeIn) {
      aNames.push('fadeIn')
      aDelays.push('0s')
      aDurs.push(Math.floor(tMS * tFI) + 'ms')
      aTimings.push('ease-in')
      aFills.push('forwards')
      aIters.push('1')
    }

    if (zoomIn) {
      aNames.push('zoomIn')
      aDelays.push('0s')
      aDurs.push(Math.floor(tMS * tZI) + 'ms')
      aTimings.push('linear')
      aFills.push('forwards')
      aIters.push('1')
    }

    if (fadeOut) {
      aNames.push('fadeOut')
      aDelays.push(Math.floor(tMS - tMS * tFO) + 'ms')
      aDurs.push(Math.floor(tMS * tFO) + 'ms')
      aTimings.push('ease-out')
      aFills.push('forwards')
      aIters.push('1')
    } else {
      aNames.push('noFadeOut')
      aDelays.push(tMS - 50 + 'ms')
      aDurs.push('50ms')
      aTimings.push('ease-out')
      aFills.push('forwards')
      aIters.push('1')
    }

    if (zoomOut) {
      aNames.push('zoomOut')
      aDelays.push(Math.floor(tMS - tMS * tZO) + 'ms')
      aDurs.push(Math.floor(tMS * tZO) + 'ms')
      aTimings.push('linear')
      aFills.push('forwards')
      aIters.push('1')
    }

    return styleEmoteString(aNames, aDelays, aDurs, aTimings, aFills, aIters)
  }

  function random(num) {
    const r = new Uint32Array(1)
    crypto.getRandomValues(r)
    const f = r[0] / 4294967295
    if (num === undefined) return f
    if (num < 1) return f * num
    return Math.floor(f * num)
  }

  function randomFromRange(range) {
    return shared.random(range.max - range.min) + range.min
  }

  function doNextFrame(callback) {
    const a = []
    for (let i = 1, l = arguments.length; i < l; i++) {
      a.push(arguments[i])
    }

    let n = false
    function next() {
      if (n === false) {
        n = true
        requestAnimationFrame(next)
        return
      }
      callback(...a)
    }
    requestAnimationFrame(next)
  }

  const msPerFrame = (function () {
    let raf
    let _init = 0
    const _avg = []

    function start() {
      if (msPerFrame.value !== 0) return
      requestAnimationFrame(test)
    }

    function stop() {
      if (raf !== undefined) {
        cancelAnimationFrame(raf)
        raf = undefined
      }
    }

    function test(ms) {
      if (_init !== 0) _avg.push(ms - _init)
      if (_avg.length > 2)
        msPerFrame.value = _avg.reduce((a, b) => a + b) / _avg.length
      if (_avg.length > 300) {
        msPerFrame.value = Math.round(msPerFrame.value * 1000) / 1000
        return
      }
      _init = ms
      raf = requestAnimationFrame(test)
    }

    return {
      start,
      stop,
      value: 0
    }
  })()

  return {
    deepMerge,
    framePause,
    countEstimatedTime,
    sleep,
    safePoints,
    setImgSrc,
    styleEmote,
    styleEmoteString,
    random,
    randomFromRange,
    doNextFrame,
    msPerFrame
  }
})()
