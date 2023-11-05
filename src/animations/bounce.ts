import { cfg, timing } from "../constants";
import { gc } from "../gc";
import { shared } from "../shared";
import { addEmoteToDocument, rndFromRange, styleEmote } from "../utils";

export function bounceAnimation(eInf, sW, sH, eH, canV = true, tInit = 0) {
  if (tInit === 0) tInit = new Date().getTime();
  if (gc.titanic > tInit) return;
  let variationSize = 1;
  if (canV && cfg.emote.size.variation !== false) {
    if (typeof cfg.emote.size.variation === "number") {
      const chances = [];
      chances.push(0.5);
      chances.push(2);
      for (let i = 0; i < cfg.emote.size.variation; i++) {
        chances.push(1);
      }
      variationSize = chances[shared.getRandomNumber(chances.length)];
    }
    //  else if (
    //   typeof cfg.emote.size.variation === "object" &&
    //   'chance' in cfg.emote.size.variation &&
    //   'range' in cfg.emote.size.variation &&
    //   Array.isArray(cfg.emote.size.variation.range)
    // ) {
    //   const chances = [];
    //   chances.push(...cfg.emote.size.variation.range);
    //   for (let i = 0; i < cfg.emote.size.variation.chance; i++) {
    //     chances.push(1);
    //   }
    //   variationSize = chances[shared.getRandomNumber(chances.length)];
    // }
  }
  eH = Math.ceil(eH * variationSize);
  let eW = eH;
  if (eInf.hasOwnProperty("width") && eInf.hasOwnProperty("height"))
    eW = (eInf.width / eInf.height) * eH;
  const eWh = Math.ceil(eW / 2);
  const sWm = Math.ceil(sW / 2);
  const h = Math.floor(shared.getRandomNumber(sW) - eWh);
  const v = Math.floor(sH * rndFromRange(timing.display.Bounce.origin));
  const tMS = Math.floor(cfg.emote.time * 1000 * timing.display.Bounce.time);
  const vMS = tMS / 300 / (16 + 2 / 3);
  let velH = rndFromRange(timing.display.Bounce.velocity.h);
  const velV = rndFromRange(timing.display.Bounce.velocity.v);
  if (h + eWh > sWm) velH = -1 * velH;
  let s = "--emote-height: " + eH + "px;";
  s += " --emote-width: " + eW + "px;";
  s += styleEmote(
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
  );
  s += " transform: translate(" + h + "px, " + v + "px);";
  const bX = h;
  const bY = v;
  const iArr = [];
  iArr.push(
    addEmoteToDocument(tInit, eInf.url, variationSize, { style: s }, true, {
      time: tMS,
    })
  );

  window.requestAnimationFrame(function (ts) {
    _tLoop(tInit, iArr, bX, bY, velH, velV, vMS, sH, eH, ts, ts);
  });
}

function _tLoop(tInit, iArr, bX, bY, velH, velV, vMS, sH, eH, myT, ts) {
  if (gc.titanic > tInit) return;
  if (iArr[0].parentElement === null) return;
  let steps = 1;
  if (myT === 0) myT = ts;
  else {
    steps = Math.max(1, Math.floor((ts - myT) / 16));
    myT = ts;
  }
  for (let i = 0; i < steps; i++) {
    bX += velH / vMS;
    bY += velV / vMS;
    velV += timing.display.Bounce.gravity / vMS;
    const sB = sH - eH;
    if (bY >= sB) {
      bY = sB;
      velV *= -1 * (1 - timing.display.Bounce.velocity.loss);
      velV = Math.floor(velV);
    }
  }
  for (let i = 0, l = iArr.length; i < l; i++) {
    iArr[i].style.transform = "translate(" + bX + "px, " + bY + "px)";
  }
  window.requestAnimationFrame(function (fTS) {
    _tLoop(tInit, iArr, bX, bY, velH, velV, vMS, sH, eH, myT, fTS);
  });
}
