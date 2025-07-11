import { cfg, letters, pyramidDistribution, timing } from './config.ts'
import { shared } from './shared.js'

export function createKappagen(target) {
  let _eActive = 0
  let _iTitanic = 0

  function getTargetSize() {
    const bounding = target.getBoundingClientRect()
    return {
      height: bounding.height,
      width: bounding.width
    }
  }

  const sizes = getTargetSize()

  const gc = (function () {
    const _toGC = {}

    let _tGC = false

    function doGC() {
      if (_tGC === false) return
      clearTimeout(_tGC)
      _tGC = false
      let done = true
      const tNow = new Date().getTime()
      for (const idx in _toGC) {
        if (!_toGC.hasOwnProperty(idx)) continue
        done = false
        const i = _toGC[idx].img
        const t = _toGC[idx].end
        const d = _toGC[idx].dec
        if (_toGC[idx].space) {
          const r = i.getBoundingClientRect()
          if (
            t > tNow &&
            r.bottom > 0 &&
            r.right > 0 &&
            r.top < sizes.height &&
            r.left < sizes.width
          )
            continue
        } else {
          if (t > tNow) continue
        }
        delete _toGC[idx]
        if (i.parentNode !== null) target.removeChild(i)
        if (d === true) _eActive--
        else if (d !== false && !isNaN(d)) _eActive -= d
      }
      if (!done) _tGC = setTimeout(doGC, 500)
    }

    function hook(img, space = true, decActive = true, t = false) {
      if (t === false) t = Math.floor(cfg.emote.time * 1000)
      let x = 0
      do {
        x++
      } while (_toGC.hasOwnProperty(x))
      _toGC[x] = {
        img: img,
        space: space,
        dec: decActive,
        end: new Date().getTime() + t
      }
      if (_tGC === false) _tGC = setTimeout(doGC, 500)
    }

    return {
      hook
    }
  })()

  const emote = (function () {
    const _toShow = []

    let _tEmote = false

    const list = (function () {
      function $Still(eInf, sW, sH, eH, tInit = 0) {
        if (tInit === 0) tInit = new Date().getTime()
        if (_iTitanic > tInit) return
        let eW = eH
        if (eInf.width !== undefined && eInf.height !== undefined) {
          eW = (eInf.width / eInf.height) * eH
        }
        const h = shared.random(sW - eW)
        const v = shared.random(sH - eH)
        let s = 'top: ' + v + 'px;'
        s += ' left: ' + h + 'px;'
        s += ' --emote-height: ' + eH + 'px;'
        s += ' --emote-width: ' + eW + 'px;'
        const tMS = Math.floor(
          cfg.emote.time * 1000 * timing.display.Still.time
        )
        s += shared.styleEmote(
          [],
          [],
          [],
          [],
          [],
          [],
          cfg.emote.in.fade,
          cfg.emote.in.zoom,
          cfg.emote.out.fade,
          cfg.emote.out.zoom,
          tMS
        )
        addEmoteToDocument(tInit, eInf.url, { style: s }, false, {
          space: false,
          time: tMS
        })
        if (eInf.hasOwnProperty('zwe')) {
          for (let i = 0, l = eInf.zwe.length; i < l; i++) {
            addEmoteToDocument(tInit, eInf.zwe[i].url, { style: s }, false, {
              space: false,
              time: tMS
            })
          }
        }
      }

      function $StraightLine(
        eInf,
        sW,
        sH,
        eH,
        x = false,
        y = false,
        tInit = 0
      ) {
        if (tInit === 0) tInit = new Date().getTime()
        if (_iTitanic > tInit) return
        let eW = eH
        if (eInf.width !== undefined && eInf.height !== undefined) {
          eW = (eInf.width / eInf.height) * eH
        }
        const eHh = Math.ceil(eH / 2)
        const eWh = Math.ceil(eW / 2)
        let h = x
        if (h === false) h = shared.random(sW) - eWh
        let v = y
        if (v === false) v = shared.random(sH) - eHh
        const r = Math.min(sW, sH) * (shared.random() + 1)
        let th = shared.random() * cfg.radius
        if (!x && !y) {
          const nH = eH * -1
          const nW = eW * -1
          while (!shared.safePoints(h, v, th, r, nW, nH, sW, sH)) {
            th = shared.random() * cfg.radius
          }
        }
        const hD = Math.floor(h + r * Math.cos(th))
        const vD = Math.floor(v + r * Math.sin(th))
        let s = '--emote-height: ' + eH + 'px;'
        s += ' --emote-width: ' + eW + 'px;'
        const tMS = Math.floor(
          cfg.emote.time * 1000 * timing.display.StraightLine.time
        )
        s += ' transform: translate(' + h + 'px, ' + v + 'px);'
        s += shared.styleEmote(
          [],
          [],
          [],
          [],
          [],
          [],
          cfg.emote.in.fade,
          cfg.emote.in.zoom,
          cfg.emote.out.fade,
          cfg.emote.out.zoom,
          tMS
        )
        addEmoteToDocument(
          tInit,
          eInf.url,
          { style: s, classes: ['etStraightLine'] },
          false,
          { time: tMS },
          { x: hD, y: vD }
        )
        if (eInf.hasOwnProperty('zwe')) {
          for (let i = 0, l = eInf.zwe.length; i < l; i++) {
            addEmoteToDocument(
              tInit,
              eInf.zwe[i].url,
              { style: s, classes: ['etStraightLine'] },
              false,
              { time: tMS },
              { x: hD, y: vD }
            )
          }
        }
      }

      function $Rise(eInf, sW, sH, eH, tInit = 0) {
        if (tInit === 0) tInit = new Date().getTime()
        if (_iTitanic > tInit) return
        let eW = eH
        if (eInf.width !== undefined && eInf.height !== undefined) {
          eW = (eInf.width / eInf.height) * eH
        }
        const eWh = Math.ceil(eW / 2)
        const h = shared.random(sW) - eWh
        const v = Math.floor(
          sH * shared.randomFromRange(timing.display.Rise.origin)
        )
        let s = 'left: ' + h + 'px;'
        s += ' --emote-height: ' + eH + 'px;'
        s += ' --emote-width: ' + eW + 'px;'
        if (cfg.emote.out.fade || cfg.emote.out.zoom)
          s +=
            ' offset-path: path("M 0 ' +
            v +
            ' L 0 ' +
            Math.floor(v * 0.05) +
            '") ;'
        else s += ' offset-path: path("M 0 ' + v + ' L 0 -' + eH + '") ;'
        const aNames = []
        const aDelays = []
        const aDurs = []
        const aTimings = []
        const aFills = []
        const aIters = []
        if (shared.random(2) === 0) aNames.push('wiggleL')
        else aNames.push('wiggleR')
        const tMS = Math.floor(cfg.emote.time * 1000 * timing.display.Rise.time)
        const d = Math.floor(
          tMS * shared.randomFromRange(timing.display.Rise.wiggle.delay)
        )
        aDelays.push(d + 'ms')
        const w = Math.floor(
          tMS * shared.randomFromRange(timing.display.Rise.wiggle)
        )
        aDurs.push(w + 'ms')
        aTimings.push('ease-in-out')
        aFills.push('both')
        aIters.push('infinite')
        aNames.push('offsetPath')
        aDelays.push('0s')
        aDurs.push(tMS + 'ms')
        aTimings.push('linear')
        aFills.push('forwards')
        aIters.push('1')
        s += shared.styleEmote(
          aNames,
          aDelays,
          aDurs,
          aTimings,
          aFills,
          aIters,
          cfg.emote.in.fade,
          cfg.emote.in.zoom,
          cfg.emote.out.fade,
          cfg.emote.out.zoom,
          tMS
        )
        addEmoteToDocument(tInit, eInf.url, { style: s }, false, {
          space: false,
          time: tMS
        })
        if (eInf.hasOwnProperty('zwe')) {
          for (let i = 0, l = eInf.zwe.length; i < l; i++) {
            addEmoteToDocument(tInit, eInf.zwe[i].url, { style: s }, false, {
              space: false,
              time: tMS
            })
          }
        }
      }

      const $Bounce = (function () {
        function $c_Bounce(eInf, sW, sH, eH, tInit = 0) {
          if (tInit === 0) tInit = new Date().getTime()
          if (_iTitanic > tInit) return
          let eW = eH
          if (eInf.width !== undefined && eInf.height !== undefined) {
            eW = (eInf.width / eInf.height) * eH
          }
          const eWh = Math.ceil(eW / 2)
          const sWm = Math.ceil(sW / 2)
          const h = Math.floor(shared.random(sW) - eWh)
          const v = Math.floor(
            sH * shared.randomFromRange(timing.display.Bounce.origin)
          )
          const tMS = Math.floor(
            cfg.emote.time * 1000 * timing.display.Bounce.time
          )
          const vMS = tMS / 300 / (16 + 2 / 3)
          let velH = shared.randomFromRange(timing.display.Bounce.velocity.h)
          const velV = shared.randomFromRange(timing.display.Bounce.velocity.v)
          if (h + eWh > sWm) velH = -1 * velH
          let s = '--emote-height: ' + eH + 'px;'
          s += ' --emote-width: ' + eW + 'px;'
          s += shared.styleEmote(
            [],
            [],
            [],
            [],
            [],
            [],
            cfg.emote.in.fade,
            cfg.emote.in.zoom,
            cfg.emote.out.fade,
            cfg.emote.out.zoom,
            tMS
          )
          s += ' transform: translate(' + h + 'px, ' + v + 'px);'
          const bX = h
          const bY = v
          const iArr = []
          iArr.push(
            addEmoteToDocument(tInit, eInf.url, { style: s }, true, {
              time: tMS
            })
          )
          if (eInf.hasOwnProperty('zwe')) {
            for (let i = 0, l = eInf.zwe.length; i < l; i++) {
              iArr.push(
                addEmoteToDocument(tInit, eInf.zwe[i].url, { style: s }, true, {
                  time: tMS
                })
              )
            }
          }
          requestAnimationFrame(function (ts) {
            _tLoop(tInit, iArr, bX, bY, velH, velV, vMS, sH, eH, ts, ts)
          })
        }

        function _tLoop(tInit, iArr, bX, bY, velH, velV, vMS, sH, eH, myT, ts) {
          if (_iTitanic > tInit) return
          if (iArr[0].parentElement === null) return
          let steps = 1
          if (myT === 0) myT = ts
          else {
            steps = Math.max(1, Math.floor((ts - myT) / 16))
            myT = ts
          }
          for (let i = 0; i < steps; i++) {
            bX += velH / vMS
            bY += velV / vMS
            velV += timing.display.Bounce.gravity / vMS
            const sB = sH - eH
            if (bY >= sB) {
              bY = sB
              velV *= -1 * (1 - timing.display.Bounce.velocity.loss)
              velV = Math.floor(velV)
            }
          }
          for (let i = 0, l = iArr.length; i < l; i++) {
            iArr[i].style.transform = 'translate(' + bX + 'px, ' + bY + 'px)'
          }
          requestAnimationFrame(function (fTS) {
            _tLoop(tInit, iArr, bX, bY, velH, velV, vMS, sH, eH, myT, fTS)
          })
        }

        return $c_Bounce
      })()

      function $Speed(eInf, sW, sH, eH, tInit = 0) {
        if (tInit === 0) tInit = new Date().getTime()
        if (_iTitanic > tInit) return
        let eW = eH
        if (eInf.width !== undefined && eInf.height !== undefined) {
          eW = (eInf.width / eInf.height) * eH
        }
        const eWh = Math.ceil(eW / 2)
        const sWm = Math.ceil(sW / 2)
        const h = shared.random(sW) - eWh
        const v = Math.floor(
          sH * shared.randomFromRange(timing.display.Speed.origin)
        )
        let s = 'top: ' + v + 'px;'
        s += ' left: ' + h + 'px;'
        s += ' --emote-height: ' + eH + 'px;'
        s += ' --emote-width: ' + eW + 'px;'
        const aNames = []
        const aDelays = []
        const aDurs = []
        const aTimings = []
        const aFills = []
        const aIters = []
        const dsO = {}
        if (h + eWh > sWm) {
          dsO.origin = 'right'
          aNames.push('speedL')
        } else {
          dsO.origin = 'left'
          aNames.push('speedR')
        }
        const tMS = Math.floor(
          cfg.emote.time * 1000 * timing.display.Speed.time
        )
        const d = Math.floor(tMS * timing.display.Speed.delay)
        aDelays.push(d + 'ms')
        aDurs.push(tMS - d + 'ms')
        aTimings.push('ease-in')
        aFills.push('forwards')
        aIters.push('1')
        s += shared.styleEmote(
          aNames,
          aDelays,
          aDurs,
          aTimings,
          aFills,
          aIters,
          cfg.emote.in.fade,
          cfg.emote.in.zoom,
          cfg.emote.out.fade,
          cfg.emote.out.zoom,
          tMS
        )
        addEmoteToDocument(tInit, eInf.url, { style: s, dataset: dsO }, false, {
          time: tMS
        })
        if (eInf.hasOwnProperty('zwe')) {
          for (let i = 0, l = eInf.zwe.length; i < l; i++) {
            addEmoteToDocument(
              tInit,
              eInf.zwe[i].url,
              { style: s, dataset: dsO },
              false,
              { time: tMS }
            )
          }
        }
      }

      function $Drop(eInf, sW, sH, eH, tInit = 0) {
        if (tInit === 0) tInit = new Date().getTime()
        if (_iTitanic > tInit) return
        let eW = eH
        if (eInf.width !== undefined && eInf.height !== undefined) {
          eW = (eInf.width / eInf.height) * eH
        }
        const eWh = Math.ceil(eW / 2)
        const h = shared.random(sW) - eWh
        let s = 'left: ' + h + 'px;'
        s += ' --emote-height: ' + eH + 'px;'
        s += ' --emote-width: ' + eW + 'px;'
        const aNames = []
        const aDelays = []
        const aDurs = []
        const aTimings = []
        const aFills = []
        const aIters = []
        const dsO = {}
        if (shared.random(2) === 0) {
          dsO.origin = 'topleft'
          aNames.push('dropL')
        } else {
          dsO.origin = 'topright'
          aNames.push('dropR')
        }
        aDelays.push('0s')
        const tMS = Math.floor(cfg.emote.time * 1000 * timing.display.Drop.time)
        aDurs.push(tMS + 'ms')
        aTimings.push('ease-in')
        aFills.push('forwards')
        aIters.push('1')
        s += shared.styleEmote(
          aNames,
          aDelays,
          aDurs,
          aTimings,
          aFills,
          aIters,
          false,
          false,
          cfg.emote.out.fade,
          cfg.emote.out.zoom,
          tMS
        )
        addEmoteToDocument(tInit, eInf.url, { style: s, dataset: dsO }, false, {
          space: false,
          time: tMS
        })
        if (eInf.hasOwnProperty('zwe')) {
          for (let i = 0, l = eInf.zwe.length; i < l; i++) {
            addEmoteToDocument(
              tInit,
              eInf.zwe[i].url,
              { style: s, dataset: dsO },
              false,
              { space: false, time: tMS }
            )
          }
        }
      }

      const $Crazy = (function () {
        /* LAYOUT SHIFTS
         * =============
         * squashes via scale
         * offset-path requires support for offset-anchor/offset-position
         * due to transform-origin changes during squash
         */

        function $c_Crazy(eInf, sW, sH, eH, tInit = 0) {
          if (tInit === 0) tInit = new Date().getTime()
          if (_iTitanic > tInit) return
          let eW = eH
          if (eInf.width !== undefined && eInf.height !== undefined) {
            eW = (eInf.width / eInf.height) * eH
          }
          const sR = sW - eW
          const sB = sH - eH
          const h = shared.random(sR - 5) + 10
          const v = shared.random(sB - 5) + 10
          let s = 'top: ' + v + 'px;'
          s += ' left: ' + h + 'px;'
          s += ' --emote-height: ' + eH + 'px;'
          s += ' --emote-width: ' + eW + 'px;'
          const dests = []
          const tMS = Math.floor(
            cfg.emote.time * 1000 * timing.display.Crazy.time
          )
          const rate = Math.sqrt(timing.display.Crazy.distance ** 2 / 2) / tMS
          const traj = { x: 0, y: 0 }
          while (traj.x === 0 && traj.y === 0) {
            traj.x = shared.random() * (rate * 2) - rate
            traj.y = shared.random() * (rate * 2) - rate
          }
          const pos = { x: h, y: v, t: 0 }
          let lastT = 0
          let bCt = 0
          const sqTime = Math.floor(tMS * timing.display.Crazy.squash.time * 2)
          while (bCt * sqTime + pos.t < tMS) {
            pos.x += traj.x
            pos.y += traj.y
            pos.t += 1
            let wall = false
            if (pos.x <= 0) {
              pos.x = 0
              traj.x *= -1
              wall = 1
            } else if (pos.x >= sR) {
              pos.x = sR
              traj.x *= -1
              wall = 3
            }
            if (pos.y <= 0) {
              pos.y = 0
              traj.y *= -1
              wall = 2
            } else if (pos.y >= sB) {
              pos.y = sB
              traj.y *= -1
              wall = 4
            }
            if (wall !== false) {
              bCt++
              dests.push({
                x: Math.floor(pos.x),
                y: Math.floor(pos.y),
                t: pos.t - lastT,
                w: wall
              })
              lastT = pos.t
            }
          }
          dests.push({ x: pos.x, y: pos.y, t: pos.t - lastT, w: 0 })
          s += shared.styleEmote(
            [],
            [],
            [],
            [],
            [],
            [],
            cfg.emote.in.fade,
            cfg.emote.in.zoom,
            cfg.emote.out.fade,
            cfg.emote.out.zoom,
            tMS
          )
          const iArr = []
          iArr.push(
            addEmoteToDocument(tInit, eInf.url, { style: s }, true, {
              space: false,
              time: tMS
            })
          )
          if (eInf.hasOwnProperty('zwe')) {
            for (let i = 0, l = eInf.zwe.length; i < l; i++) {
              iArr.push(
                addEmoteToDocument(tInit, eInf.zwe[i].url, { style: s }, true, {
                  space: false,
                  time: tMS
                })
              )
            }
          }
          const d = 0
          const lA = iArr.length
          const lD = dests.length
          shared.doNextFrame(_tLoop, tInit, lA, iArr, lD, dests, d)
        }

        function _tLoop(tInit, lA, iArr, lD, dests, d) {
          if (_iTitanic > tInit) return
          if (d >= lD) return
          const squashT = Math.floor(
            cfg.emote.time *
              1000 *
              timing.display.Crazy.time *
              timing.display.Crazy.squash.time
          )
          for (let i = 0; i < lA; i++) {
            iArr[i].dataset.origin = 'center'
            iArr[i].dataset.squash = 'no'
            iArr[i].style.top = dests[d].y + 'px'
            iArr[i].style.left = dests[d].x + 'px'
            iArr[i].style.transition =
              'top ' +
              dests[d].t +
              'ms linear, left ' +
              dests[d].t +
              'ms linear, transform ' +
              squashT +
              'ms linear'
          }
          d++
          setTimeout(_tSquash, dests[d - 1].t, tInit, lA, iArr, lD, dests, d)
        }

        function _tSquash(tInit, lA, iArr, lD, dests, d) {
          if (_iTitanic > tInit) return
          const squashT = Math.floor(
            cfg.emote.time *
              1000 *
              timing.display.Crazy.time *
              timing.display.Crazy.squash.time
          )
          for (let i = 0; i < lA; i++) {
            switch (dests[d - 1].w) {
              case 1:
                iArr[i].dataset.origin = 'left'
                iArr[i].dataset.squash = 'horizontal'
                break
              case 2:
                iArr[i].dataset.origin = 'top'
                iArr[i].dataset.squash = 'vertical'
                break
              case 3:
                iArr[i].dataset.origin = 'right'
                iArr[i].dataset.squash = 'horizontal'
                break
              case 4:
                iArr[i].dataset.origin = 'bottom'
                iArr[i].dataset.squash = 'vertical'
                break
            }
          }
          setTimeout(_tUnsquash, squashT, tInit, lA, iArr, lD, dests, d)
        }

        function _tUnsquash(tInit, lA, iArr, lD, dests, d) {
          if (_iTitanic > tInit) return
          const squashT = Math.floor(
            cfg.emote.time *
              1000 *
              timing.display.Crazy.time *
              timing.display.Crazy.squash.time
          )
          for (let i = 0; i < lA; i++) {
            iArr[i].dataset.squash = 'no'
          }
          setTimeout(_tLoop, squashT, tInit, lA, iArr, lD, dests, d)
        }

        return $c_Crazy
      })()

      function $Confetti(eInf, sW, sH, eH, tInit = 0) {
        if (tInit === 0) tInit = new Date().getTime()
        if (_iTitanic > tInit) return
        let eW = eH
        if (eInf.width !== undefined && eInf.height !== undefined) {
          eW = (eInf.width / eInf.height) * eH
        }
        const eWh = Math.ceil(eW / 2)
        const h = shared.random(sW) - eWh
        let s = 'left: ' + h + 'px;'
        s += ' --emote-height: ' + eH + 'px;'
        s += ' --emote-width: ' + eW + 'px;'
        const aNames = []
        const aDelays = []
        const aDurs = []
        const aTimings = []
        const aFills = []
        const aIters = []
        switch (shared.random(3)) {
          case 0:
            aNames.push('confettiA')
            break
          case 1:
            aNames.push('confettiB')
            break
          case 2:
            aNames.push('confettiC')
            break
        }
        aDelays.push('0s')
        const tMS = Math.floor(
          cfg.emote.time * 1000 * timing.display.Confetti.time
        )
        aDurs.push(tMS + 'ms')
        aTimings.push('linear')
        aFills.push('forwards')
        aIters.push('1')
        s += shared.styleEmote(
          aNames,
          aDelays,
          aDurs,
          aTimings,
          aFills,
          aIters,
          false,
          false,
          cfg.emote.out.fade,
          false,
          tMS
        )
        addEmoteToDocument(tInit, eInf.url, { style: s }, false, {
          space: false,
          time: tMS
        })
        if (eInf.hasOwnProperty('zwe')) {
          for (let i = 0, l = eInf.zwe.length; i < l; i++) {
            addEmoteToDocument(tInit, eInf.zwe[i].url, { style: s }, false, {
              space: false,
              time: tMS
            })
          }
        }
      }

      const $Throw = (function () {
        function $c_Throw(eInf, sW, sH, eH, tInit = 0) {
          if (tInit === 0) tInit = new Date().getTime()
          if (_iTitanic > tInit) return
          let eW = eH
          if (eInf.width !== undefined && eInf.height !== undefined) {
            eW = (eInf.width / eInf.height) * eH
          }
          const sR = sW - eW
          const sB = sH - eH
          const h = shared.random(2) === 0 ? eW * -1 : sW
          const v = shared.random(sH + eH) - eH
          const hD = Math.floor(
            sR * shared.randomFromRange(timing.display.Throw.dest.h)
          )
          const vD = Math.floor(
            sB * shared.randomFromRange(timing.display.Throw.dest.v)
          )
          const dH = shared.random() * eH
          const tMS = Math.floor(
            cfg.emote.time * 1000 * timing.display.Throw.time
          )
          const t2 = Math.floor(tMS * timing.display.Throw.toss)
          const t3 = Math.floor(tMS * timing.display.Throw.drop)
          let s = '--emote-height: ' + eH + 'px;'
          s += ' --emote-width: ' + eW + 'px;'
          s += ' transform: translate(' + h + 'px, ' + v + 'px);'
          let s2 = '--emote-height: ' + eH + 'px;'
          s2 += ' --emote-width: ' + eW + 'px;'
          let r = '360'
          if (h > 0) r = '-360'
          s2 +=
            ' transform: translate(' +
            hD +
            'px, ' +
            (sH - dH) +
            'px) rotate(' +
            r +
            'deg);'
          const aNames = []
          const aDelays = []
          const aDurs = []
          const aTimings = []
          const aFills = []
          const aIters = []
          if (cfg.emote.out.fade) {
            const fOut = cfg.emote.animation.fade.out / 100
            const t3F = t3 * fOut
            aNames.push('fadeOut')
            aDelays.push(Math.floor(t3 - t3F) + 'ms')
            aDurs.push(Math.floor(t3F) + 'ms')
            aTimings.push('ease-out')
            aFills.push('forwards')
            aIters.push('1')
          } else {
            aNames.push('noFadeOut')
            aDelays.push(t3 - 50 + 'ms')
            aDurs.push('50ms')
            aTimings.push('ease-out')
            aFills.push('forwards')
            aIters.push('1')
          }
          if (cfg.emote.out.zoom) {
            const zOut = cfg.emote.animation.zoom.out / 100
            const t3Z = t3 * zOut
            aNames.push('zoomOut')
            aDelays.push(Math.floor(t3 - t3Z) + 'ms')
            aDurs.push(Math.floor(t3Z) + 'ms')
            aTimings.push('linear')
            aFills.push('forwards')
            aIters.push('1')
          }
          s2 += shared.styleEmoteString(
            aNames,
            aDelays,
            aDurs,
            aTimings,
            aFills,
            aIters,
            tMS
          )
          const iArr = []
          iArr.push(
            addEmoteToDocument(
              tInit,
              eInf.url,
              { style: s, classes: ['etThrowTwist'] },
              true,
              { space: false, time: tMS }
            )
          )
          if (eInf.hasOwnProperty('zwe')) {
            for (let i = 0, l = eInf.zwe.length; i < l; i++) {
              iArr.push(
                addEmoteToDocument(
                  tInit,
                  eInf.zwe[i].url,
                  { style: s, classes: ['etThrowTwist'] },
                  true,
                  { space: false, time: tMS }
                )
              )
            }
          }
          shared.doNextFrame(_tMove, tInit, iArr, hD, vD)
          setTimeout(_tDrop, t2, tInit, iArr, s2)
        }

        function _tMove(tInit, iArr, hD, vD) {
          if (_iTitanic > tInit) return
          for (let i = 0, l = iArr.length; i < l; i++) {
            iArr[i].style.transform = 'translate(' + hD + 'px, ' + vD + 'px)'
          }
        }

        function _tDrop(tInit, iArr, s2) {
          if (_iTitanic > tInit) return
          for (let i = 0, l = iArr.length; i < l; i++) {
            iArr[i].classList.replace('etThrowTwist', 'etThrowDrop')
            iArr[i].setAttribute('style', s2)
          }
        }

        return $c_Throw
      })()

      const $TheCube = (function () {
        function $c_TheCube(eInf, sW, sH, eH, tInit = 0) {
          if (tInit === 0) tInit = new Date().getTime()
          if (_iTitanic > tInit) return
          const scene = document.createElement('div')
          scene.setAttribute('class', 'scene cube')

          const eHh = Math.ceil(eH / 2)
          const nHh = eHh * -1
          const tMS = Math.floor(
            cfg.emote.time * 1000 * timing.display.TheCube.time
          )
          const cube = document.createElement('div')
          cube.setAttribute('class', 'cube')
          cube.setAttribute('style', 'transform: translateZ(' + nHh + 'px);')
          if (!eInf.hasOwnProperty('zwe') || eInf.zwe.length === 0) {
            const cubeF = document.createElement('img')
            shared.setImgSrc(cubeF, eInf.url)
            cubeF.dataset.face = 'front'
            cube.appendChild(cubeF)
            const cubeB = document.createElement('img')
            shared.setImgSrc(cubeB, eInf.url)
            cubeB.dataset.face = 'back'
            cube.appendChild(cubeB)
            const cubeR = document.createElement('img')
            shared.setImgSrc(cubeR, eInf.url)
            cubeR.dataset.face = 'right'
            cube.appendChild(cubeR)
            const cubeL = document.createElement('img')
            shared.setImgSrc(cubeL, eInf.url)
            cubeL.dataset.face = 'left'
            cube.appendChild(cubeL)
            const cubeT = document.createElement('img')
            shared.setImgSrc(cubeT, eInf.url)
            cubeT.dataset.face = 'top'
            cube.appendChild(cubeT)
            const cubeU = document.createElement('img')
            shared.setImgSrc(cubeU, eInf.url)
            cubeU.dataset.face = 'bottom'
            cube.appendChild(cubeU)
          } else {
            const lZ = eInf.zwe.length
            const cubeF = document.createElement('div')
            cubeF.dataset.face = 'front'
            const pctF = document.createElement('img')
            shared.setImgSrc(pctF, eInf.url)
            cubeF.appendChild(pctF)
            for (let i = 0; i < lZ; i++) {
              const pctZ = document.createElement('img')
              shared.setImgSrc(pctZ, eInf.zwe[i].url)
              cubeF.appendChild(pctZ)
            }
            cube.appendChild(cubeF)
            const cubeB = document.createElement('div')
            cubeB.dataset.face = 'back'
            const pctB = document.createElement('img')
            shared.setImgSrc(pctB, eInf.url)
            cubeB.appendChild(pctB)
            for (let i = 0; i < lZ; i++) {
              const pctZ = document.createElement('img')
              shared.setImgSrc(pctZ, eInf.zwe[i].url)
              cubeB.appendChild(pctZ)
            }
            cube.appendChild(cubeB)
            const cubeR = document.createElement('div')
            cubeR.dataset.face = 'right'
            const pctR = document.createElement('img')
            shared.setImgSrc(pctR, eInf.url)
            cubeR.appendChild(pctR)
            for (let i = 0; i < lZ; i++) {
              const pctZ = document.createElement('img')
              shared.setImgSrc(pctZ, eInf.zwe[i].url)
              cubeR.appendChild(pctZ)
            }
            cube.appendChild(cubeR)
            const cubeL = document.createElement('div')
            cubeL.dataset.face = 'left'
            const pctL = document.createElement('img')
            shared.setImgSrc(pctL, eInf.url)
            cubeL.appendChild(pctL)
            for (let i = 0; i < lZ; i++) {
              const pctZ = document.createElement('img')
              shared.setImgSrc(pctZ, eInf.zwe[i].url)
              cubeL.appendChild(pctZ)
            }
            cube.appendChild(cubeL)
            const cubeT = document.createElement('div')
            cubeT.dataset.face = 'top'
            const pctT = document.createElement('img')
            shared.setImgSrc(pctT, eInf.url)
            cubeT.appendChild(pctT)
            for (let i = 0; i < lZ; i++) {
              const pctZ = document.createElement('img')
              shared.setImgSrc(pctZ, eInf.zwe[i].url)
              cubeT.appendChild(pctZ)
            }
            cube.appendChild(cubeT)
            const cubeU = document.createElement('div')
            cubeU.dataset.face = 'bottom'
            const pctU = document.createElement('img')
            shared.setImgSrc(pctU, eInf.url)
            cubeU.appendChild(pctU)
            for (let i = 0; i < lZ; i++) {
              const pctZ = document.createElement('img')
              shared.setImgSrc(pctZ, eInf.zwe[i].url)
              cubeU.appendChild(pctZ)
            }
            cube.appendChild(cubeU)
          }
          scene.appendChild(cube)
          const h = shared.random(sW) - eHh
          const v = shared.random(sH) - eHh
          const r = Math.min(sW, sH) * (shared.random() + 1)
          let th = shared.random() * cfg.radius
          const nH = eH * -1
          while (!shared.safePoints(h, v, th, r, nH, nH, sW, sH)) {
            th = shared.random() * cfg.radius
          }
          const hD = Math.floor(h + r * Math.cos(th))
          const vD = Math.floor(v + r * Math.sin(th))
          let s = '--emote-height: ' + eH + 'px;'
          s += ' --emote-width: ' + eH + 'px;'
          s += ' --cube-depth: ' + eHh + 'px;'
          s += ' perspective: ' + eH * 3 + 'px;'
          s += ' transform: translate(' + h + 'px, ' + v + 'px);'
          s += shared.styleEmote(
            [],
            [],
            [],
            [],
            [],
            [],
            cfg.emote.in.fade,
            false,
            cfg.emote.out.fade,
            false,
            tMS
          )
          scene.setAttribute('style', s)
          _eActive += 6
          target.appendChild(scene)
          gc.hook(scene, true, 6, tMS)
          shared.doNextFrame(_tMove, tInit, cube, scene, hD, vD, eH)
        }

        function _tMove(tInit, cube, scene, hD, vD, eH) {
          if (_iTitanic > tInit) return
          const nHh = Math.ceil(eH / 2) * -1
          let rX = 0
          let rY = 0
          while (Math.abs(rX) + Math.abs(rY) < 45) {
            rX = (360 - shared.random() * 720) * cfg.emote.cube.speed
            rY = (360 - shared.random() * 720) * cfg.emote.cube.speed
          }
          cube.style.transform =
            'translateZ(' +
            nHh +
            'px) rotateX(' +
            rX +
            'deg) rotateY(' +
            rY +
            'deg)'
          scene.style.transform = 'translate(' + hD + 'px, ' + vD + 'px)'
        }

        return $c_TheCube
      })()

      function $Fountain(eInf, sW, sH, eH, fX, fY, tInit = 0) {
        if (tInit === 0) tInit = new Date().getTime()
        if (_iTitanic > tInit) return
        const tMS = Math.floor(
          cfg.emote.time * 1000 * timing.display.Fountain.time
        )
        let eW = eH
        if (eInf.width !== undefined && eInf.height !== undefined) {
          eW = (eInf.width / eInf.height) * eH
        }
        const sR = sW - eW
        const sB = sH - eH
        let h = fX
        if (h === false)
          h = Math.floor(shared.random() * (sR * 0.33) + sR * 0.33)
        let hD
        if (shared.random(2) === 0) hD = h - shared.random(sR * 0.2)
        else hD = h + shared.random(sR * 0.2)
        let s = '--emote-height: ' + eH + 'px;'
        s += ' --emote-width: ' + eW + 'px;'
        s += ' transform: translateX(' + h + 'px);'
        s +=
          ' offset-path: path("M 0 ' +
          sH +
          ' L 0 ' +
          Math.floor(fY * sH + shared.random(sB / 2)) +
          ' L 0 ' +
          (sH + eH) +
          '");'
        const aNames = []
        const aDelays = []
        const aDurs = []
        const aTimings = []
        const aFills = []
        const aIters = []
        aNames.push('offsetPath')
        aDelays.push('0s')
        aDurs.push(tMS + 'ms')
        aTimings.push('cubic-bezier(0, 0.9, 1, 0.15)')
        aFills.push('forwards')
        aIters.push('1')
        s += shared.styleEmoteString(
          aNames,
          aDelays,
          aDurs,
          aTimings,
          aFills,
          aIters,
          tMS
        )
        addEmoteToDocument(
          tInit,
          eInf.url,
          { style: s, classes: ['etFountain'] },
          false,
          { time: tMS, space: false },
          { x: hD }
        )
        if (eInf.hasOwnProperty('zwe')) {
          for (let i = 0, l = eInf.zwe.length; i < l; i++) {
            addEmoteToDocument(
              tInit,
              eInf.zwe[i].url,
              { style: s, classes: ['etFountain'] },
              false,
              { time: tMS, space: false },
              { x: hD }
            )
          }
        }
      }

      return {
        Still: $Still,
        StraightLine: $StraightLine,
        Rise: $Rise,
        Bounce: $Bounce,
        Speed: $Speed,
        Drop: $Drop,
        Crazy: $Crazy,
        Confetti: $Confetti,
        Throw: $Throw,
        TheCube: $TheCube,
        Fountain: $Fountain
      }
    })()

    function queueEmote(emoteItem) {
      const sW = sizes.width
      const sH = sizes.height
      const eH = Math.max(
        cfg.emote.size.min,
        Math.min(
          cfg.emote.size.max,
          Math.floor(sW * cfg.emote.size.ratio.normal),
          Math.floor(sH * cfg.emote.size.ratio.normal)
        )
      )
      target.style.setProperty('--height', sH + 'px')
      target.style.setProperty('--width', sW + 'px')
      const style = cfg.display.styles[shared.random(cfg.display.styles.length)]
      if (style === undefined) return
      emote.list[style](emoteItem, sW, sH, eH)
    }

    function showEmotes(emotes) {
      _toShow.push(...emotes)

      if (_tEmote !== false) {
        clearTimeout(_tEmote)
        _tEmote = false
      }

      const startShowEmotes = () =>
        (_tEmote = setTimeout(() => {
          emote.showEmotes([])
        }, 500))

      if (cfg.emote.max > 0 && _eActive >= cfg.emote.max) {
        startShowEmotes()
        return
      }
      let emote = null
      while ((emote = _toShow.shift()) !== undefined) {
        queueEmote(emote)
        if (cfg.emote.max > 0 && _eActive > cfg.emote.max) {
          if (cfg.emote.queue > 0 && _toShow.length > cfg.emote.queue)
            _toShow.splice(0, _toShow.length - cfg.emote.queue)
          startShowEmotes()
          break
        }
      }
    }

    return {
      showEmotes,
      list
    }
  })()

  const kappa = (function () {
    const _toKappa = []
    const _conga = []
    const _dKappa = 500

    let _tKappa = false

    const list = (function () {
      const $Fireworks = (function () {
        function $c_Fireworks(kList, sW, sH, eH, iKC) {
          const tInit = new Date().getTime()
          if (_iTitanic > tInit) return
          const oK = kList[shared.random(kList.length)]
          let eW = eH
          if (oK.width !== undefined && oK.height !== undefined) {
            eW = (oK.width / oK.height) * eH
          }
          const eWh = Math.ceil(eW / 2)
          const oX =
            sW *
              timing.kappa.Fireworks.origin.x[
                shared.random(timing.kappa.Fireworks.origin.x.length)
              ] -
            eWh
          const oY =
            sH *
            timing.kappa.Fireworks.origin.y[
              shared.random(timing.kappa.Fireworks.origin.y.length)
            ]
          const cX =
            sW *
            timing.kappa.Fireworks.dest.x[
              shared.random(timing.kappa.Fireworks.dest.x.length)
            ]
          const cY =
            sH *
            timing.kappa.Fireworks.dest.y[
              shared.random(timing.kappa.Fireworks.dest.y.length)
            ]
          const tMS = Math.floor(
            cfg.emote.time * 1000 * timing.kappa.Fireworks.time
          )
          const sendUp = Math.floor(tMS * timing.kappa.Fireworks.speed.rocket)
          let s = '--emote-height: ' + eH + 'px;'
          s += ' --emote-width: ' + eW + 'px;'
          s += ' transform: translate(' + oX + 'px, ' + oY + 'px);'
          const iArr = []
          _eActive--
          iArr.push(
            addEmoteToDocument(
              tInit,
              oK.url,
              { style: s, classes: ['ktFireworkRocket'] },
              true,
              false,
              { x: cX - eWh, y: cY }
            )
          )
          if (oK.hasOwnProperty('zwe')) {
            for (let i = 0, l = oK.zwe.length; i < l; i++) {
              iArr.push(
                addEmoteToDocument(
                  tInit,
                  oK.zwe[i].url,
                  { style: s, classes: ['ktFireworkRocket'] },
                  true,
                  false,
                  { x: cX - eWh, y: cY }
                )
              )
            }
          }
          setTimeout(
            _explode,
            sendUp,
            tInit,
            kList,
            iArr,
            cX,
            cY,
            eH,
            sW,
            sH,
            iKC
          )
        }

        async function _explode(tInit, kList, iArr, cX, cY, eH, sW, sH, iKC) {
          if (_iTitanic > tInit) return
          for (let i = 0, l = iArr.length; i < l; i++) {
            target.removeChild(iArr[i])
            _eActive--
          }
          const tMS = Math.floor(
            cfg.emote.time * 1000 * timing.kappa.Fireworks.time
          )
          const kTime = Math.floor(tMS * timing.kappa.Fireworks.speed.burst)
          const fA = shared.countEstimatedTime(iKC, kTime)
          const r = Math.min(sW, sH) * timing.kappa.Fireworks.radius.base
          const inner = Math.max(
            3,
            Math.floor(iKC * timing.kappa.Fireworks.quantity.small)
          )
          const core = Math.floor(iKC * timing.kappa.Fireworks.quantity.medium)
          const outer = Math.max(
            3,
            Math.floor(iKC * timing.kappa.Fireworks.quantity.large)
          )
          const lK = kList.length
          const sR = r * timing.kappa.Fireworks.radius.small
          for (let v = 0; v < inner; v++) {
            if (_iTitanic > tInit) return
            const sK = kList[shared.random(lK)]
            let eW = eH
            if (sK.width !== undefined && sK.height !== undefined) {
              eW = (sK.width / sK.height) * eH
            }
            const sA = shared.random()
            _eActive--
            _sparkler(tInit, sK.url, cX, cY, eW, eH, sR, sA)
            if (sK.hasOwnProperty('zwe')) {
              for (let i = 0, l = sK.zwe.length; i < l; i++) {
                _sparkler(tInit, sK.zwe[i].url, cX, cY, eW, eH, sR, sA)
              }
            }
            if (v % fA.ct === fA.ct - 1) await shared.framePause(fA.f)
          }
          await shared.sleep(
            Math.floor(tMS * timing.kappa.Fireworks.delays.small)
          )
          const mR = r * timing.kappa.Fireworks.radius.medium
          const dT = Math.ceil(fA.ct / timing.kappa.Fireworks.spread)
          for (let v = 0; v < core; v++) {
            if (_iTitanic > tInit) return
            const sK = kList[shared.random(lK)]
            let eW = eH
            if (sK.width !== undefined && sK.height !== undefined) {
              eW = (sK.width / sK.height) * eH
            }
            const sA = shared.random()
            _eActive--
            _sparkler(tInit, sK.url, cX, cY, eW, eH, mR, sA)
            if (sK.hasOwnProperty('zwe')) {
              for (let i = 0, l = sK.zwe.length; i < l; i++) {
                _sparkler(tInit, sK.zwe[i].url, cX, cY, eW, eH, mR, sA)
              }
            }
            if (v % dT === dT - 1) await shared.framePause()
          }
          await shared.sleep(
            Math.floor(tMS * timing.kappa.Fireworks.delays.large)
          )
          const lR = r * timing.kappa.Fireworks.radius.large
          for (let v = 0; v < outer; v++) {
            if (_iTitanic > tInit) return
            const sK = kList[shared.random(lK)]
            let eW = eH
            if (sK.width !== undefined && sK.height !== undefined) {
              eW = (sK.width / sK.height) * eH
            }
            const sA = shared.random()
            _eActive--
            _sparkler(tInit, sK.url, cX, cY, eW, eH, lR, sA)
            if (sK.hasOwnProperty('zwe')) {
              for (let i = 0, l = sK.zwe.length; i < l; i++) {
                _sparkler(tInit, sK.zwe[i].url, cX, cY, eW, eH, lR, sA)
              }
            }
            if (v % fA.ct === fA.ct - 1) await shared.framePause(fA.f)
          }
        }

        function _sparkler(tInit, url, cX, cY, eW, eH, r, a) {
          if (_iTitanic > tInit) return
          const th = a * cfg.radius
          const eWh = Math.ceil(eW / 2)
          const eX = cX - eWh
          const hD = Math.floor(eX + r * Math.cos(th))
          const vD = Math.floor(cY + r * Math.sin(th))
          const tMS = Math.floor(
            cfg.emote.time * 1000 * timing.kappa.Fireworks.time
          )
          let s = '--emote-height: ' + eH + 'px;'
          s += ' --emote-width: ' + eW + 'px;'
          s += ' transform: translate(' + eX + 'px, ' + cY + 'px);'
          s += shared.styleEmote(
            [],
            [],
            [],
            [],
            [],
            [],
            true,
            false,
            true,
            false,
            tMS
          )
          addEmoteToDocument(
            tInit,
            url,
            { style: s, classes: ['ktFireworkSparkler'] },
            false,
            { space: false, time: tMS },
            { x: hD, y: vD }
          )
        }

        return $c_Fireworks
      })()

      const $Spiral = (function () {
        function $c_Spiral(kList, sW, sH, eH, iKC) {
          const tInit = new Date().getTime()
          if (_iTitanic > tInit) return
          const oX = shared.random() * sW
          const oY = shared.random(sH - eH)
          const r = Math.min(sW, sH)
          shared.doNextFrame(_init, tInit, kList, oX, oY, eH, r, iKC)
        }

        async function _init(tInit, kList, oX, oY, eH, r, iKC) {
          if (_iTitanic > tInit) return
          const c =
            cfg.radius /
            (shared.randomFromRange(timing.kappa.Spiral.vectors) +
              shared.random() * 2)
          let th = shared.random() * cfg.radius
          const o = shared.random(2) === 0
          const tMS = Math.floor(
            cfg.emote.time * 1000 * timing.kappa.Spiral.time
          )
          const sA = shared.countEstimatedTime(iKC, tMS)
          if (sA.ct > timing.kappa.Spiral.bulk) sA.ct = timing.kappa.Spiral.bulk
          for (let i = 0; i < iKC; i++) {
            if (_iTitanic > tInit) return
            if (o) {
              th -= c
              if (th <= 0) th += cfg.radius
            } else {
              th += c
              if (th >= cfg.radius) th -= cfg.radius
            }
            const oK = kList[shared.random(kList.length)]
            let eW = eH
            if (oK.width !== undefined && oK.height !== undefined) {
              eW = (oK.width / oK.height) * eH
            }
            const eWh = Math.ceil(eW / 2)
            _eActive--
            _sparkler(tInit, oK.url, oX - eWh, oY, eW, eH, r, th)
            if (oK.hasOwnProperty('zwe')) {
              for (let j = 0, m = oK.zwe.length; j < m; j++) {
                _sparkler(tInit, oK.zwe[j].url, oX - eWh, oY, eW, eH, r, th)
              }
            }
            if (i % sA.ct === sA.ct - 1) await shared.framePause(sA.f)
          }
        }

        function _sparkler(tInit, url, oX, oY, eW, eH, r, th) {
          if (_iTitanic > tInit) return
          const hD = Math.floor(oX + r * Math.cos(th))
          const vD = Math.floor(oY + r * Math.sin(th))
          const tMS = Math.floor(
            cfg.emote.time * 1000 * timing.kappa.Spiral.time
          )
          let s = '--emote-height: ' + eH + 'px;'
          s += ' --emote-width: ' + eW + 'px;'
          s += ' transform: translate(' + oX + 'px, ' + oY + 'px);'
          s += shared.styleEmote(
            [],
            [],
            [],
            [],
            [],
            [],
            true,
            false,
            true,
            false,
            tMS
          )
          addEmoteToDocument(
            tInit,
            url,
            { style: s, classes: ['ktSpiral'] },
            false,
            { space: false, time: tMS },
            { x: hD, y: vD }
          )
        }

        return $c_Spiral
      })()

      const $Pyramid = (function () {
        function $c_Pyramid(kList, sW, sH) {
          const tInit = new Date().getTime()
          if (_iTitanic > tInit) return
          const drawn = []
          let ct = 0
          const lP = pyramidDistribution.length
          const eH = sW / lP
          for (let i = 0; i < lP; i++) {
            drawn.push(0)
            ct += pyramidDistribution[i]
          }
          const tMS = Math.floor(
            cfg.emote.time * 1000 * timing.kappa.Pyramid.time
          )
          const sT = tMS * timing.kappa.Pyramid.show.total
          const tPerB = Math.max(
            Math.floor(sT / ct),
            timing.kappa.Pyramid.show.min
          )
          const eT = tPerB * ct
          const dT = Math.floor(tMS * timing.kappa.Pyramid.pause)
          let t = 0
          for (let i = 0; i < ct; i++) {
            if (_iTitanic > tInit) return
            let x
            do {
              x = shared.random(lP)
            } while (drawn[x] >= pyramidDistribution[x])
            const oK = kList[shared.random(kList.length)]
            _block(tInit, oK.url, x, t, eH, sH, drawn[x] + 1, eT + dT)
            if (oK.hasOwnProperty('zwe')) {
              for (let j = 0, l = oK.zwe.length; j < l; j++) {
                _eActive++
                _block(
                  tInit,
                  oK.zwe[j].url,
                  x,
                  t,
                  eH,
                  sH,
                  drawn[x] + 1,
                  eT + dT
                )
              }
            }
            drawn[x]++
            t += tPerB
          }
        }

        function _block(tInit, url, x, t, eH, sH, dX, aT) {
          if (_iTitanic > tInit) return
          const img = document.createElement('img')
          img.setAttribute('class', 'emote ktPyramid')
          shared.setImgSrc(img, url)
          const h = Math.floor(eH * x)
          const v = -1 * eH
          const vD = sH - eH * dX
          let s = 'top: 0px;'
          s += ' left: ' + h + 'px;'
          s += ' --emote-height: ' + eH + 'px;'
          s += ' --emote-width: ' + eH + 'px;'
          s += ' transform: translateY(' + v + 'px);'
          img.setAttribute('style', s)
          target.appendChild(img)
          setTimeout(_tDrop, Math.floor(t / 10 + aT), tInit, img, sH)
          setTimeout(_tMove, t, tInit, img, vD)
        }

        function _tMove(tInit, img, vD) {
          if (_iTitanic > tInit) return
          img.style.transform = 'translateY(' + vD + 'px)'
        }

        function _tDrop(tInit, img, sH) {
          if (_iTitanic > tInit) return
          const tMS = Math.floor(
            cfg.emote.time * 1000 * timing.kappa.Pyramid.time
          )
          const pT = Math.floor(tMS * timing.kappa.Pyramid.hide)
          img.classList.replace('ktPyramid', 'ktPyramidDrop')
          img.style.transform = 'translateY(' + sH + 'px)'
          gc.hook(img, false, true, pT)
        }

        return $c_Pyramid
      })()

      const $SmallPyramid = (function () {
        function $c_SmallPyramid(kList, sW, sH) {
          const tInit = new Date().getTime()
          if (_iTitanic > tInit) return
          const drawn = []
          let ct = 0
          const lP = pyramidDistribution.length
          const eH = Math.min(
            sW / lP,
            Math.floor(sW * cfg.emote.size.ratio.small),
            Math.floor(sH * cfg.emote.size.ratio.small)
          )
          for (let i = 0; i < lP; i++) {
            drawn.push(0)
            ct += pyramidDistribution[i]
          }
          const tMS = Math.floor(
            cfg.emote.time * 1000 * timing.kappa.SmallPyramid.time
          )
          const sT = tMS * timing.kappa.SmallPyramid.show.total
          const tPerB = Math.max(
            Math.floor(sT / ct),
            timing.kappa.SmallPyramid.show.min
          )
          const eT = tPerB * ct
          const dT = Math.floor(tMS * timing.kappa.SmallPyramid.pause)
          const oX = shared.random(sW - eH * lP)
          let t = 0
          for (let i = 0; i < ct; i++) {
            if (_iTitanic > tInit) return
            let x
            do {
              x = shared.random(lP)
            } while (drawn[x] >= pyramidDistribution[x])
            const oK = kList[shared.random(kList.length)]
            _block(tInit, oK.url, oX, x, t, eH, sH, drawn[x] + 1, eT + dT)
            if (oK.hasOwnProperty('zwe')) {
              for (let j = 0, l = oK.zwe.length; j < l; j++) {
                _eActive++
                _block(
                  tInit,
                  oK.zwe[j].url,
                  oX,
                  x,
                  t,
                  eH,
                  sH,
                  drawn[x] + 1,
                  eT + dT
                )
              }
            }
            drawn[x]++
            t += tPerB
          }
        }

        function _block(tInit, url, oX, x, t, eH, sH, dX, aT) {
          if (_iTitanic > tInit) return
          const img = document.createElement('img')
          img.setAttribute('class', 'emote ktSmallPyramid')
          shared.setImgSrc(img, url)
          const h = oX + eH * x
          const v = -1 * eH
          const vD = sH - eH * dX
          let s = 'top: 0px;'
          s += ' left: ' + h + 'px;'
          s += ' --emote-height: ' + eH + 'px;'
          s += ' --emote-width: ' + eH + 'px;'
          s += ' transform: translateY(' + v + 'px);'
          img.setAttribute('style', s)
          target.appendChild(img)
          setTimeout(_tDrop, Math.floor(t / 10 + aT), tInit, img, sH)
          setTimeout(_tMove, t, tInit, img, vD)
        }

        function _tMove(tInit, img, vD) {
          if (_iTitanic > tInit) return
          img.style.transform = 'translateY(' + vD + 'px)'
        }

        function _tDrop(tInit, img, sH) {
          if (_iTitanic > tInit) return
          const tMS = Math.floor(
            cfg.emote.time * 1000 * timing.kappa.SmallPyramid.time
          )
          const pT = Math.floor(tMS * timing.kappa.SmallPyramid.hide)
          img.classList.replace('ktSmallPyramid', 'ktSmallPyramidDrop')
          img.style.transform = 'translateY(' + sH + 'px)'
          gc.hook(img, false, true, pT)
        }

        return $c_SmallPyramid
      })()

      const $Stampede = (function () {
        async function $c_Stampede(kList, sW, sH, eH, iKC) {
          const tInit = new Date().getTime()
          if (_iTitanic > tInit) return
          const bandHeight = eH * timing.kappa.Stampede.height
          const d = shared.random(2) === 0
          const bandTop =
            shared.random(
              sH -
                bandHeight +
                eH * timing.kappa.Stampede.top.min +
                eH * timing.kappa.Stampede.top.max
            ) +
            eH * (-1 * timing.kappa.Stampede.top.min)
          const b1 = shared.randomFromRange(timing.kappa.Stampede.bunch[1])
          const b2 = shared.random(timing.kappa.Stampede.bunch[2] - b1) + b1
          const b4 = shared.randomFromRange(timing.kappa.Stampede.bunch[4])
          _eActive += b1 + b2 + iKC + b4
          const hasB4 = b4 > 0
          const tMS = Math.floor(
            cfg.emote.time * 1000 * timing.kappa.Stampede.time
          )
          const tSpeed = Math.floor(tMS * timing.kappa.Stampede.speed)
          const t1 = Math.floor(tSpeed * timing.kappa.Stampede.pause['1'])
          let maxW = 0
          for (let i = 0, l = kList.length; i < l; i++) {
            let eW = eH
            if (kList[i].width !== undefined && kList[i].height !== undefined)
              eW = (kList[i].width / kList[i].height) * eH
            if (eW > maxW) maxW = eW
          }
          await _stampede(
            tInit,
            kList,
            b1,
            t1,
            false,
            bandTop,
            bandHeight,
            d,
            sW,
            eH,
            maxW
          )
          if (_iTitanic > tInit) return
          const t2 = Math.floor(tSpeed * timing.kappa.Stampede.pause['2'])
          await _stampede(
            tInit,
            kList,
            b2,
            t2,
            false,
            bandTop,
            bandHeight,
            d,
            sW,
            eH,
            maxW
          )
          if (_iTitanic > tInit) return
          const sA = shared.countEstimatedTime(iKC, tMS)
          if (sA.ct > timing.kappa.Stampede.maxdensity)
            sA.ct = timing.kappa.Stampede.maxdensity
          await _stampede(
            tInit,
            kList,
            iKC,
            hasB4,
            sA,
            bandTop,
            bandHeight,
            d,
            sW,
            eH,
            maxW
          )
          if (_iTitanic > tInit) return
          if (hasB4)
            await _stampede(
              tInit,
              kList,
              b4,
              false,
              false,
              bandTop,
              bandHeight,
              d,
              sW,
              eH,
              maxW
            )
        }

        async function _stampede(
          tInit,
          kList,
          ct,
          pause,
          sA,
          bandTop,
          bandHeight,
          d,
          sW,
          eH,
          maxW
        ) {
          if (_iTitanic > tInit) return
          const imgs = []
          for (let i = 0; i < ct; i++) {
            if (_iTitanic > tInit) return
            const oK = kList[shared.random(kList.length)]
            let eW = eH
            if (oK.width !== undefined && oK.height !== undefined) {
              eW = (oK.width / oK.height) * eH
            }
            const y = bandTop + shared.random(bandHeight)
            _eActive--
            imgs.push(_run(tInit, oK.url, y, d, sW, eW, eH, maxW))
            if (oK.hasOwnProperty('zwe')) {
              for (let j = 0, l = oK.zwe.length; j < l; j++) {
                _run(tInit, oK.zwe[j].url, y, d, sW, eW, eH, maxW)
              }
            }
            if (sA === false)
              await shared.sleep(
                shared.randomFromRange(timing.kappa.Stampede.smallSleep)
              )
            else {
              if (i % sA.ct === sA.ct - 1) {
                let wF = sA.f
                if (wF === 1) wF = shared.random(3)
                else wF *= (shared.random() * 3) / 2
                if (wF !== 0) await shared.framePause(wF)
              }
            }
          }
          if (pause === false) return
          if (pause !== true) {
            await shared.sleep(pause)
            return
          }
          do {
            if (_iTitanic > tInit) return
            await shared.sleep(100)
            for (let i = imgs.length - 1; i >= 0; i--) {
              if (imgs[i] === null || imgs[i].hasAttribute('deleted'))
                imgs.splice(i, 1)
            }
          } while (imgs.length > 0)
        }

        function _run(tInit, url, v, d, sW, eW, eH, maxW) {
          if (_iTitanic > tInit) return
          const h = -2 * maxW
          const tMS = Math.floor(
            cfg.emote.time * 1000 * timing.kappa.Stampede.time
          )
          const tSpeed = Math.floor(tMS * timing.kappa.Stampede.speed)
          let s = '--emote-height: ' + eH + 'px;'
          s += ' --emote-width: ' + eW + 'px;'
          if (d) s += ' transform: translate(' + sW + 'px, ' + v + 'px);'
          else s += ' transform: translate(' + h + 'px, ' + v + 'px);'
          s += shared.styleEmoteString([], [], [], [], [], [])
          let img
          if (d)
            img = addEmoteToDocument(
              tInit,
              url,
              { style: s, classes: ['ktStampede'] },
              true,
              { space: false, time: tSpeed },
              { x: h, y: v }
            )
          else
            img = addEmoteToDocument(
              tInit,
              url,
              { style: s, classes: ['ktStampede'] },
              true,
              { space: false, time: tSpeed },
              { x: sW, y: v }
            )
          setTimeout(_tMark, tSpeed, tInit, img)
          return img
        }

        function _tMark(tInit, img) {
          if (_iTitanic > tInit) return
          if (img === null) return
          if (img.parentNode !== null) target.removeChild(img)
          img.setAttribute('deleted', true)
        }

        return $c_Stampede
      })()

      const $Conga = (function () {
        async function $c_Conga(kList, sW, sH, eH, nM) {
          const tInit = new Date().getTime()
          if (_iTitanic > tInit) return
          let v = 0
          let unique = false
          const bS = Math.ceil(eH * timing.kappa.Conga.size)
          const seg = Math.floor(eH * timing.kappa.Conga.height)
          const sht = Math.floor(sH / seg)
          let lns = sht
          if (nM) lns = timing.kappa.Conga.avoidMiddle
          while (_conga.length >= lns) {
            if (_iTitanic > tInit) return
            await shared.sleep(250)
          }
          while (!unique) {
            v = shared.random(sht) * seg
            if (nM) {
              v = shared.random(timing.kappa.Conga.avoidMiddle)
              const hMid = Math.floor(timing.kappa.Conga.avoidMiddle / 2)
              if (v >= hMid) v = sht - 1 - (v - hMid)
              v *= seg
            }
            let found = false
            for (let i = 0, l = _conga.length; i < l; i++) {
              if (_conga[i].row === v) {
                found = true
                break
              }
            }
            if (!found) unique = true
          }
          _conga.push({ row: v, done: false })
          const urls = []
          const zurls = []
          const ct = Math.floor(sW / bS)
          for (let i = 0; i < ct; i++) {
            const oK = kList[shared.random(kList.length)]
            urls.push(oK.url)
            const oZ = []
            if (oK.hasOwnProperty('zwe')) {
              for (let j = 0, l = oK.zwe.length; j < l; j++) {
                oZ.push(oK.zwe[j].url)
              }
            }
            zurls.push(oZ)
          }
          const d = (v / seg) % 2 === 0
          const xtra = Math.floor((sW - ct * bS) / 2)
          const imgs = []
          const zimgs = []
          for (let i = 0; i < ct; i++) {
            imgs.push(_dance(tInit, urls[i], i, sW, v, eH, bS, ct, d, xtra))
            const oZ = []
            for (let j = 0, l = zurls[i].length; j < l; j++) {
              oZ.push(_dance(tInit, zurls[i][j], i, sW, v, eH, bS, ct, d, xtra))
            }
            zimgs.push(oZ)
          }
          const tMS = Math.floor(
            cfg.emote.time * 1000 * timing.kappa.Conga.time.show
          )
          await shared.sleep(tMS)
          let full = false
          if (_conga.length === sht) full = true
          await shared.sleep(Math.floor(cfg.display.kappa.conga.time * 1000))
          if (cfg.display.kappa.conga.contagious) {
            let ex = false
            let lC = _conga.length
            if (lC > 1) ex = true
            for (let i = 0; i < lC; i++) {
              if (_conga[i].row !== v) continue
              _conga[i].done = true
              break
            }
            let done = false
            while (!done) {
              if (_iTitanic > tInit) return
              lC = _conga.length
              if (!ex && lC > 1) ex = true
              let notDone = false
              for (let i = 0; i < lC; i++) {
                if (_conga[i].done === false) {
                  notDone = true
                  break
                }
              }
              if (notDone === false) done = true
              await shared.sleep(100)
            }
          }
          for (let i = 0, l = imgs.length; i < l; i++) {
            _endDance(tInit, imgs[i], i, sW, v, eH, bS, ct, d, xtra)
            for (let j = 0, m = zimgs[i].length; j < m; j++) {
              _endDance(tInit, zimgs[i][j], i, sW, v, eH, bS, ct, d, xtra)
            }
          }
          await shared.sleep(tMS)
          for (let i = 0, l = _conga.length; i < l; i++) {
            if (_conga[i].row !== v) continue
            _conga.splice(i, 1)
            break
          }
        }

        function _dance(tInit, url, col, sW, v, eH, bS, ct, d, xtra) {
          if (_iTitanic > tInit) return
          const box = document.createElement('div')
          box.setAttribute('class', 'scene ktCongaIn')
          const img = document.createElement('img')
          img.setAttribute('class', 'dancer fit')
          shared.setImgSrc(img, url)
          let s = '--emote-height: ' + eH + 'px;'
          s += ' --emote-width: ' + eH + 'px;'
          img.setAttribute('style', s)
          let sE = bS * col + xtra
          let sB = sE - sW
          if (d) {
            sE = bS * (ct - 1 - col) + xtra
            sB = sE + sW
          }
          s = 'top: ' + v + 'px;'
          s += ' left: 0px;'
          s += ' height: ' + bS + 'px;'
          s += ' width: ' + bS + 'px;'
          s += ' z-index: ' + v + ';'
          s += ' transform: translateX(' + sB + 'px);'
          box.setAttribute('style', s)
          _eActive++
          box.appendChild(img)
          target.appendChild(box)
          shared.doNextFrame(_tMove, tInit, box, sE)
          return box
        }

        function _endDance(tInit, box, col, sW, v, eH, bS, ct, d, xtra) {
          if (_iTitanic > tInit) return
          let sB = bS * col + xtra
          let sE = sB + sW
          if (d) {
            sB = bS * (ct - 1 - col) + xtra
            sE = sB - sW
          }
          const tMS = Math.floor(
            cfg.emote.time * 1000 * timing.kappa.Conga.time.hide
          )
          box.classList.replace('ktCongaIn', 'ktCongaOut')
          gc.hook(box, true, true, Math.ceil(tMS * 1.25))
          shared.doNextFrame(_tMove, tInit, box, sE)
        }

        function _tMove(tInit, box, sE) {
          if (_iTitanic > tInit) return
          box.style.transform = 'translateX(' + sE + 'px)'
        }

        return $c_Conga
      })()

      const $TheCube = (function () {
        function $c_TheCube(kList, sW, sH, eH, bC, iR) {
          const tInit = new Date().getTime()
          if (_iTitanic > tInit) return
          const eHh = Math.ceil(eH / 2)
          const nHh = eHh * -1
          const sWm = Math.ceil(sW / 2)
          const sHm = Math.ceil(sH / 2)
          const scene = document.createElement('div')
          scene.setAttribute('class', 'scene cube kappa')
          const tMS = Math.floor(
            cfg.emote.time * 1000 * timing.kappa.TheCube.time
          )
          const cube = document.createElement('div')
          cube.setAttribute('class', 'cube')
          cube.setAttribute('style', 'transform: translateZ(' + nHh + 'px);')
          const sFaces = [
            'front',
            'back',
            'right',
            'left',
            'top',
            'bottom'
          ]
          const eFaces = []
          for (let i = 0; i < 6; i++) {
            eFaces.push(kList[shared.random(kList.length)])
          }
          for (let i = 0; i < 6; i++) {
            if (
              !eFaces[i].hasOwnProperty('zwe') ||
              eFaces[i].zwe.length === 0
            ) {
              const iFace = document.createElement('img')
              shared.setImgSrc(iFace, eFaces[i].url)
              iFace.dataset.face = sFaces[i]
              cube.appendChild(iFace)
            } else {
              const dFace = document.createElement('div')
              dFace.dataset.face = sFaces[i]
              const pFace = document.createElement('img')
              shared.setImgSrc(pFace, eFaces[i].url)
              dFace.appendChild(pFace)
              for (let j = 0, l = eFaces[i].zwe.length; j < l; j++) {
                const pctZ = document.createElement('img')
                shared.setImgSrc(pctZ, eFaces[i].zwe[j].url)
                dFace.appendChild(pctZ)
              }
              cube.appendChild(dFace)
            }
          }
          scene.appendChild(cube)
          let h = shared.random(sW - eH)
          let v = shared.random(sH - eH)
          if (bC) {
            h = Math.floor(sWm - eHh)
            v = Math.floor(sHm - eHh)
          }
          let s = '--emote-height: ' + eH + 'px;'
          s += ' --emote-width: ' + eH + 'px;'
          s += ' --cube-depth: ' + eHh + 'px;'
          s += ' perspective: ' + eH * 3 + 'px;'
          s += ' transform: translate(' + h + 'px, ' + v + 'px);'
          s += shared.styleEmote(
            [],
            [],
            [],
            [],
            [],
            [],
            cfg.emote.in.fade,
            false,
            cfg.emote.out.fade,
            false,
            tMS
          )
          scene.setAttribute('style', s)
          target.appendChild(scene)
          gc.hook(scene, false, 6, tMS)
          shared.doNextFrame(_tMove, tInit, cube, iR, eH)
        }

        function _tMove(tInit, cube, iR, eH) {
          if (_iTitanic > tInit) return
          const nHh = Math.ceil(eH / 2) * -1
          let rX = 0
          let rY = 0
          while (Math.abs(rX) + Math.abs(rY) < 45) {
            rX = (360 - shared.random() * 720) * iR
            rY = (360 - shared.random() * 720) * iR
          }
          cube.style.transform =
            'translateZ(' +
            nHh +
            'px) rotateX(' +
            rX +
            'deg) rotateY(' +
            rY +
            'deg)'
        }

        return $c_TheCube
      })()

      const $Text = (function () {
        let _mL = 0

        function $c_Text(kList, sW, sH, sMsg, iTime) {
          const tInit = new Date().getTime()
          if (_iTitanic > tInit) return
          const msgDist = _buildMsgArr(sMsg)
          let ct = 0
          let ctT = 0
          const drawn = []
          const lM = msgDist.length
          for (let x = 0; x < lM; x++) {
            const lX = msgDist[x].length
            for (let y = 0; y < lX; y++) {
              if (msgDist[x][y] !== 0) ctT += 1
            }
            ct += lX
            drawn.push(0)
          }
          const eH = Math.min(
            Math.floor(sW / (lM + 2)),
            Math.floor(sW * cfg.emote.size.ratio.small),
            Math.floor(sH * cfg.emote.size.ratio.small)
          )
          const tMS = Math.floor(iTime * 1000 * timing.kappa.Text.time)
          const sT = tMS * timing.kappa.Text.show.total
          const tPerB = Math.max(
            Math.floor(sT / ct),
            timing.kappa.Text.show.min
          )
          const eT = tPerB * ctT
          const lF = msgDist[0].length
          const lFS = eH * lF
          const vH = shared.random(sH - lFS) + lFS
          const oX = shared.random(sW - eH * lM)
          let t = 0
          for (let i = 0; i < ct; i++) {
            if (_iTitanic > tInit) return
            let x
            do {
              x = shared.random(lM)
            } while (drawn[x] >= msgDist[x].length)
            if (msgDist[x][drawn[x]] !== 0) {
              const oK = kList[shared.random(kList.length)]
              _block(
                tInit,
                oK.url,
                vH,
                oX,
                drawn[x] + 1,
                tPerB,
                eT,
                iTime,
                x,
                t,
                sH,
                eH
              )
              if (oK.hasOwnProperty('zwe')) {
                for (let j = 0, l = oK.zwe.length; j < l; j++) {
                  _block(
                    tInit,
                    oK.zwe[j].url,
                    vH,
                    oX,
                    drawn[x] + 1,
                    tPerB,
                    eT,
                    iTime,
                    x,
                    t,
                    sH,
                    eH
                  )
                }
              }
              t += tPerB
            }
            drawn[x]++
          }
        }

        function _buildMsgArr(s) {
          const o = []
          const spc = []
          if (_mL === 0) {
            for (
              let i = 0, k = Object.keys(letters), l = k.length;
              i < l;
              i++
            ) {
              _mL = Math.max(_mL, letters[k[i]][0].length)
            }
          }
          for (let y = 0; y < _mL; y++) {
            spc.push(0)
          }
          for (let i = 0, l = s.length; i < l; i++) {
            if (i > 0) o.push(spc)
            if (s[i] === ' ') {
              o.push(spc)
              o.push(spc)
              continue
            }
            const v = s[i]
            if (!letters.hasOwnProperty(v)) continue
            const c = letters[v]
            for (let x = 0, m = c.length; x < m; x++) {
              o.push(c[x])
            }
          }
          return o
        }

        function _block(
          tInit,
          url,
          vH,
          oX,
          dX,
          tPerB,
          eT,
          iTime,
          x,
          t,
          sH,
          eH
        ) {
          if (_iTitanic > tInit) return
          const img = document.createElement('img')
          img.setAttribute('class', 'emote fit')
          shared.setImgSrc(img, url)
          const h = oX + eH * x
          const v = -1 * eH
          const vD = vH - eH * dX
          let s = 'top: 0px;'
          s += ' left: ' + h + 'px;'
          s += ' --emote-height: ' + eH + 'px;'
          s += ' --emote-width: ' + eH + 'px;'
          s += ' transition: transform ' + tPerB + 'ms ease-in;'
          s += ' transform: translateY(' + v + 'px);'
          img.setAttribute('style', s)
          target.appendChild(img)
          _eActive++
          const tMS = Math.floor(iTime * 1000 * timing.kappa.Text.time)
          setTimeout(_tDrop, Math.floor(eT + tMS + t / 10), tInit, img, sH, tMS)
          setTimeout(_tMove, t, tInit, img, vD)
        }

        function _tMove(tInit, img, vD) {
          if (_iTitanic > tInit) return
          img.style.transform = 'translateY(' + vD + 'px)'
        }

        function _tDrop(tInit, img, sH, tMS) {
          if (_iTitanic > tInit) return
          const pT = Math.floor(tMS * timing.kappa.Text.hide)
          img.style.transform = 'translateY(' + sH + 'px)'
          img.style.transitionDuration = pT + 'ms'
          gc.hook(img, false, true, pT)
        }

        return $c_Text
      })()

      return {
        Fireworks: $Fireworks,
        Spiral: $Spiral,
        Pyramid: $Pyramid,
        SmallPyramid: $SmallPyramid,
        Stampede: $Stampede,
        Conga: $Conga,
        TheCube: $TheCube,
        Text: $Text
      }
    })()

    function canShowKappa(k) {
      if (cfg.emote.max < 1) return true
      if (_eActive < 1) return true
      let tC = cfg.display.kappa.count
      if (k !== false) tC = getKappaCountEstimate(k)
      const cM = Math.max(cfg.emote.max, tC)
      return _eActive + tC < cM
    }

    function getNextKappa(k) {
      const a = []
      a[k.style] = k.prefs
      return getNextKappaEx(a, k.params)
    }

    function getNextKappaEx(kS = false, kP = false) {
      if (typeof kS !== 'object') {
        if (cfg.display.kappa.styles.length < 1) return false
        kS = cfg.display.kappa.styles
      }
      let s, p
      const keys = Object.keys(kS)
      if (cfg.display.kappa.conga.contagious && _conga.length > 0) {
        s = 'Conga'
        p = {}
        if (keys.includes(s)) p = kS[s]
        else {
          const s2 = keys[shared.random(keys.length)]
          if (kS[s2].hasOwnProperty('emotes')) p.emotes = kS[s2].emotes
        }
      } else {
        s = keys[shared.random(keys.length)]
        p = kS[s]
      }
      if (s === undefined) return false
      let iKC = cfg.display.kappa.count
      if (
        cfg.display.kappa.styles.hasOwnProperty(s) &&
        cfg.display.kappa.styles[s].hasOwnProperty('count') &&
        cfg.display.kappa.styles[s].count > 0
      )
        iKC = cfg.display.kappa.styles[s].count
      if (p === undefined) p = {}
      let pMax = cfg.emote.max
      if (p.hasOwnProperty('count')) {
        let tKC = 0
        if (Number.isInteger(p.count)) tKC = p.count
        else {
          if (p.count.hasOwnProperty('maximum')) pMax = p.count.maximum
          if (p.count.hasOwnProperty('default')) tKC = p.count.default
          if (p.count.hasOwnProperty('dynamic') && p.count.dynamic !== false) {
            if (p.hasOwnProperty('params') && p.params !== null) {
              const pC = _getKappaCountParam(p.params)
              if (pC !== false) tKC = pC
            }
          }
        }
        if (
          tKC === -1 &&
          kP !== false &&
          kP.hasOwnProperty('%AMOUNT%') &&
          Math.ceil(kP['%AMOUNT%']) > 0
        )
          tKC = Math.ceil(kP['%AMOUNT%'])
        if (tKC > 0) iKC = tKC
      }
      if (pMax > 0 && iKC > pMax) iKC = pMax
      return { style: s, prefs: p, count: iKC }
    }

    function getKappaCountEstimate(k) {
      switch (k.style) {
        case 'Pyramid':
        case 'SmallPyramid':
          let c = 0
          for (let i = 0, l = pyramidDistribution.length; i < l; i++) {
            c += pyramidDistribution[i]
          }
          return c
        case 'Fireworks':
          const inner = Math.max(
            3,
            Math.floor(k.count * timing.kappa.Fireworks.quantity.small)
          )
          const core = Math.floor(
            k.count * timing.kappa.Fireworks.quantity.medium
          )
          const outer = Math.max(
            3,
            Math.floor(k.count * timing.kappa.Fireworks.quantity.large)
          )
          return 1 + inner + core + outer
        case 'Conga':
          const sW = sizes.width
          const sH = sizes.height
          const eH = Math.max(
            cfg.emote.size.min,
            Math.min(
              cfg.emote.size.max,
              Math.floor(sW * cfg.emote.size.ratio.normal),
              Math.floor(sH * cfg.emote.size.ratio.normal)
            )
          )
          const bS = Math.ceil(eH * timing.kappa.Conga.size)
          return Math.floor(sW / bS)
        case 'TheCube':
          return 6
      }
      return k.count
    }

    async function run(emotes, options) {
      const sW = sizes.width
      const sH = sizes.height
      const eH = Math.max(
        cfg.emote.size.min,
        Math.min(
          cfg.emote.size.max,
          Math.floor(sW * cfg.emote.size.ratio.normal),
          Math.floor(sH * cfg.emote.size.ratio.normal)
        )
      )
      const eHh = Math.max(
        cfg.emote.size.min,
        Math.min(
          Math.floor(cfg.emote.size.max / 2),
          Math.floor(sW * cfg.emote.size.ratio.small),
          Math.floor(sH * cfg.emote.size.ratio.small)
        )
      )
      const sB = sH - eH
      target.style.setProperty('--height', sH + 'px')
      target.style.setProperty('--width', sW + 'px')
      const waitFor = getKappaCountEstimate(options)

      _eActive += waitFor
      const lK = emotes.length
      const tInit = new Date().getTime()
      let estMS = Math.floor(cfg.emote.time * 1000)
      if (
        timing.kappa.hasOwnProperty(options.style) &&
        timing.kappa[options.style].hasOwnProperty('time')
      )
        estMS = Math.floor(
          cfg.emote.time * 1000 * timing.kappa[options.style].time
        )
      else if (
        timing.display.hasOwnProperty(options.style) &&
        timing.display[options.style].hasOwnProperty('time')
      )
        estMS = Math.floor(
          cfg.emote.time * 1000 * timing.display[options.style].time
        )

      switch (options.style) {
        case 'Stampede':
          _eActive -= waitFor
          await list.Stampede(emotes, sW, sH, eH, options.count)
          break
        case 'Fireworks':
          list.Fireworks(emotes, sW, sH, eHh, options.count)
          break
        case 'Spiral':
          list.Spiral(emotes, sW, sH, eHh, options.count)
          break
        case 'Pyramid':
          list.Pyramid(emotes, sW, sH)
          break
        case 'SmallPyramid':
          list.SmallPyramid(emotes, sW, sH)
          break
        case 'Conga':
          _eActive -= waitFor
          let avoidMiddle = false
          if (
            cfg.display.kappa.conga.hasOwnProperty('avoidMiddle') &&
            cfg.display.kappa.conga.avoidMiddle === true
          )
            avoidMiddle = true
          if (
            options.prefs.hasOwnProperty('avoidMiddle') &&
            options.prefs.avoidMiddle === true
          )
            avoidMiddle = true
          list.Conga(emotes, sW, sH, eH, avoidMiddle)
          break
        case 'Text':
          _eActive -= waitFor
          let sTM = 'HYPE!'
          if (
            cfg.display.kappa.styles.hasOwnProperty(options.style) &&
            cfg.display.kappa.styles[options.style].hasOwnProperty('message')
          )
            sTM =
              cfg.display.kappa.styles[options.style].message[
                shared.random(
                  cfg.display.kappa.styles[options.style].message.length
                )
              ]
          if (
            options.prefs.hasOwnProperty('message') &&
            Array.isArray(options.prefs.message) &&
            options.prefs.message.length > 0
          )
            sTM =
              options.prefs.message[shared.random(options.prefs.message.length)]
          let sTT = cfg.emote.time
          if (
            cfg.display.kappa.styles.hasOwnProperty(options.style) &&
            cfg.display.kappa.styles[options.style].hasOwnProperty('time')
          )
            sTT = cfg.display.kappa.styles[options.style].time
          if (options.prefs.hasOwnProperty('time') && options.prefs.time > 0)
            sTT = options.prefs.time
          list.Text(emotes, sW, sH, sTM, sTT)
          break
        case 'TheCube':
          const cS = Math.min(sW, sH)
          let sCS = 8 / 10
          if (
            cfg.display.kappa.styles.hasOwnProperty(options.style) &&
            cfg.display.kappa.styles[options.style].hasOwnProperty('size')
          )
            sCS = cfg.display.kappa.styles[options.style].size
          if (options.prefs.hasOwnProperty('size')) sCS = options.prefs.size
          let sCC = true
          if (
            cfg.display.kappa.styles.hasOwnProperty(options.style) &&
            cfg.display.kappa.styles[options.style].hasOwnProperty('center')
          )
            sCC = cfg.display.kappa.styles[options.style].center
          if (options.prefs.hasOwnProperty('center')) sCC = options.prefs.center
          let sCR = 5
          if (
            cfg.display.kappa.styles.hasOwnProperty(options.style) &&
            cfg.display.kappa.styles[options.style].hasOwnProperty('speed')
          )
            sCR = cfg.display.kappa.styles[options.style].speed
          if (options.prefs.hasOwnProperty('speed'))
            sCR = options.prefs.speed || 1
          let bF = false
          if (
            cfg.display.kappa.styles.hasOwnProperty(options.style) &&
            cfg.display.kappa.styles[options.style].hasOwnProperty('faces')
          )
            bF = cfg.display.kappa.styles[options.style].faces
          if (options.prefs.hasOwnProperty('faces'))
            bF = options.prefs.faces === true
          let kUse = []
          if (bF) kUse = emotes
          else kUse.push(emotes[shared.random(lK)])
          list.TheCube(kUse, sW, sH, Math.floor(cS * sCS), sCC, sCR)
          break
        case 'Burst':
          const oH = shared.randomFromRange(timing.kappa[options.style].left)
          const oV =
            shared.randomFromRange(timing.kappa[options.style].top) * sB
          const bA = shared.countEstimatedTime(options.count, estMS)
          for (let i = 0; i < options.count; i++) {
            if (_iTitanic > tInit) return
            const rB = shared.random(lK)
            _eActive--
            let eWb = eH
            if (
              emotes[rB].width !== undefined &&
              emotes[rB].height !== undefined
            )
              eWb = (emotes[rB].width / emotes[rB].height) * eH
            const sRb = sW - Math.ceil(eWb / 2)
            emote.list.StraightLine(emotes[rB], sW, sH, eH, oH * sRb, oV, tInit)
            if (i % bA.ct === bA.ct - 1) await shared.framePause(bA.f)
          }
          break
        case 'Fountain':
          const fX =
            shared.randomFromRange(timing.kappa[options.style].left) * sW
          const fY = shared.randomFromRange(timing.kappa[options.style].top)
          const fA = shared.countEstimatedTime(options.count, estMS)
          for (let i = 0; i < options.count; i++) {
            if (_iTitanic > tInit) return
            const rF = shared.random(lK)
            _eActive--
            emote.list.Fountain(emotes[rF], sW, sH, eH, fX, fY, tInit)
            if (i % fA.ct === fA.ct - 1) await shared.framePause(fA.f)
          }
          break
        case 'Confetti':
          const cA = shared.countEstimatedTime(options.count, estMS)
          for (let i = 0; i < options.count; i++) {
            if (_iTitanic > tInit) return
            const rN = shared.random(lK)
            _eActive--
            emote.list.Confetti(emotes[rN], sW, sH, eHh, tInit)
            if (i % cA.ct === cA.ct - 1) await shared.framePause(cA.f)
          }
          break
      }
    }

    function stop() {
      if (_tKappa !== false) {
        clearTimeout(_tKappa)
        _tKappa = false
      }
      _toKappa.length = 0
      _conga.length = 0
    }

    return {
      run,
      stop
    }
  })()

  function addEmoteToDocument(
    tInit,
    uri,
    attrs = {},
    r = false,
    oGC = {},
    oT = false
  ) {
    if (_iTitanic > tInit) return
    const img = document.createElement('img')
    const c = []
    c.push('emote')
    if (attrs.hasOwnProperty('classes')) c.push(...attrs.classes)
    img.classList.add(...c)
    shared.setImgSrc(img, uri)
    if (attrs.hasOwnProperty('style')) img.setAttribute('style', attrs.style)
    if (attrs.hasOwnProperty('dataset')) {
      for (
        let i = 0, k = Object.keys(attrs.dataset), l = k.length;
        i < l;
        i++
      ) {
        img.setAttribute('data-' + k[i], attrs.dataset[k[i]])
      }
    }
    _eActive++
    target.appendChild(img)
    let space = true
    let decActive = true
    let t = false
    if (oGC !== false) {
      if (oGC.hasOwnProperty('space')) space = oGC.space
      if (oGC.hasOwnProperty('decrement')) decActive = oGC.decrement
      if (oGC.hasOwnProperty('time')) t = oGC.time
      gc.hook(img, space, decActive, t)
    }

    if (oT !== false) {
      let sTF = null
      if (oT.hasOwnProperty('x') && oT.hasOwnProperty('y'))
        sTF = 'translate(' + oT.x + 'px, ' + oT.y + 'px)'
      else if (oT.hasOwnProperty('x')) sTF = 'translateX(' + oT.x + 'px)'
      else if (oT.hasOwnProperty('y')) sTF = 'translateY(' + oT.y + 'px)'
      if (sTF !== null) shared.doNextFrame(setEmoteTransition, tInit, img, sTF)
    }

    if (r) {
      return img
    }
  }

  function setEmoteTransition(tInit, img, sTF) {
    if (_iTitanic > tInit) return
    img.style.transform = sTF
  }

  function clear() {
    _iTitanic = new Date().getTime()
    kappa.stop()
    const cubes = target.getElementsByClassName('scene')
    while (cubes.length) {
      cubes[0].parentElement.removeChild(cubes[0])
    }
    const imgs = target.getElementsByTagName('img')
    while (imgs.length) {
      imgs[0].parentElement.removeChild(imgs[0])
    }
    _eActive = 0
  }

  return {
    emote,
    kappa,
    clear
  }
}
