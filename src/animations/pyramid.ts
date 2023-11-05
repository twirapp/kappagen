// @ts-nocheck

import { cfg, pyramidDist, timing } from "../constants";
import { gc } from "../gc";
import { shared } from "../shared";
import { setImageSource } from "../utils";

export function pyramidEmote(kList, sW, sH) {
  const tInit = new Date().getTime();
  if (gc.titanic > tInit)
    return;
  const drawn = [];
  let ct = 0;
  const lP = pyramidDist.length;
  const eH = sW / lP;
  for (let i = 0; i < lP; i++) {
    drawn.push(0);
    ct += pyramidDist[i];
  }
  const tMS = Math.floor(cfg.emote.time * 1000 * timing.kappa.Pyramid.time);
  const sT = tMS * timing.kappa.Pyramid.show.total;
  const tPerB = Math.max(Math.floor(sT / ct), timing.kappa.Pyramid.show.min);
  const eT = tPerB * ct;
  const dT = Math.floor(tMS * timing.kappa.Pyramid.pause);
  let t = 0;
  for (let i = 0; i < ct; i++) {
    if (gc.titanic > tInit)
      return;
    let x;
    do {
      x = shared.getRandomNumber(lP);
    } while (drawn[x] >= pyramidDist[x]);
    const oK = kList[shared.getRandomNumber(kList.length)];
    _block(tInit, oK.url, x, t, eH, sH, drawn[x] + 1, eT + dT);
    if (oK.hasOwnProperty('zwe')) {
      for (let j = 0, l = oK.zwe.length; j < l; j++) {
        gc.active++;
        _block(tInit, oK.zwe[j].url, x, t, eH, sH, drawn[x] + 1, eT + dT);
      }
    }
    drawn[x]++;
    t += tPerB;
  }
}

function _block(tInit, url, x, t, eH, sH, dX, aT) {
  if (gc.titanic > tInit)
    return;
  const img = document.createElement('img');
  img.setAttribute('class', 'emote fit ktPyramid');
  setImageSource(img, url);
  const h = Math.floor(eH * x);
  const v = -1 * eH;
  const vD = sH - eH * dX;
  let s = 'top: 0px;';
  s += ' left: ' + h + 'px;';
  s += ' --emote-height: ' + eH + 'px;';
  s += ' --emote-width: ' + eH + 'px;';
  s += ' transform: translateY(' + v + 'px);';
  img.setAttribute('style', s);
  document.body.appendChild(img);
  window.setTimeout(_tDrop, Math.floor(t / 10 + aT), tInit, img, sH);
  window.setTimeout(_tMove, t, tInit, img, vD);
}

function _tMove(tInit, img, vD) {
  if (gc.titanic > tInit)
    return;
  img.style.transform = 'translateY(' + vD + 'px)';
}

function _tDrop(tInit, img, sH) {
  if (gc.titanic > tInit)
    return;
  const tMS = Math.floor(cfg.emote.time * 1000 * timing.kappa.Pyramid.time);
  const pT = Math.floor(tMS * timing.kappa.Pyramid.hide);
  img.classList.replace('ktPyramid', 'ktPyramidDrop');
  img.style.transform = 'translateY(' + sH + 'px)';
  gc.hook(img, false, true, pT);
}
