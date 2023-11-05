import { bounceAnimation } from "./animations/bounce";
import { pyramidEmote } from "./animations/pyramid";
import { cfg, pyramidDist, timing } from "./constants";
import { gc } from "./gc";
import { shared } from "./shared";
import { EmoteInfo } from "./types";
import { framePause, kAcTime, rndFromRange } from "./utils";

export async function showEmotes(kList: EmoteInfo[], kStyle: any) {
  console.log({ kList, kStyle })

  const sW = window.innerWidth;
  const sH = window.innerHeight;
  const eH = Math.max(cfg.emote.size.min, Math.min(cfg.emote.size.max, Math.floor(sW * cfg.emote.size.ratio.normal), Math.floor(sH * cfg.emote.size.ratio.normal)));
  const eHh = Math.max(cfg.emote.size.min, Math.min(Math.floor(cfg.emote.size.max / 2), Math.floor(sW * cfg.emote.size.ratio.small), Math.floor(sH * cfg.emote.size.ratio.small)));
  const sB = sH - eH;
  document.documentElement.style.setProperty('--height', sH + 'px');
  document.documentElement.style.setProperty('--width', sW + 'px');
  const waitFor = _getKappaCountEstimate(kStyle);

  gc.active += waitFor;
  const lK = kList.length;
  const tInit = new Date().getTime();
  let estMS = Math.floor(cfg.emote.time * 1000);
  if (timing.kappa.hasOwnProperty(kStyle.style) && timing.kappa[kStyle.style].hasOwnProperty('time'))
    estMS = Math.floor(cfg.emote.time * 1000 * timing.kappa[kStyle.style].time);
  else if (timing.display.hasOwnProperty(kStyle.style) && timing.display[kStyle.style].hasOwnProperty('time'))
    estMS = Math.floor(cfg.emote.time * 1000 * timing.display[kStyle.style].time);

  switch (kStyle.style) {
    // case 'Stampede':
    //   gc.active -= waitFor;
    //   // await _list.Stampede(kList, sW, sH, eH, kStyle.count);
    //   break;
    // case 'Fireworks':
    //   // _list.Fireworks(kList, sW, sH, eHh, kStyle.count);
    //   break;
    // case 'Spiral':
    //   // _list.Spiral(kList, sW, sH, eHh, kStyle.count);
    //   break;
    case 'Bounce':
      if (Array.isArray(kList)) {
        for (let i = 0; i < kList.length; i++) {
          bounceAnimation(kList[i], sW, sH, eH, kStyle.count);
        }
      } else {
        bounceAnimation(kList[0], sW, sH, eH, kStyle.count);
      }
      break;
    case 'Pyramid':
      pyramidEmote(kList, sW, sH);
      break;
    // case 'SmallPyramid':
    //   // _list.SmallPyramid(kList, sW, sH);
    //   break;
    // case 'Conga':
    //   gc.active -= waitFor;
    //   let avoidMiddle = false;
    //   if (cfg.display.kappa.conga.hasOwnProperty('avoidMiddle') && cfg.display.kappa.conga.avoidMiddle === true)
    //     avoidMiddle = true;
    //   if (kStyle.prefs.hasOwnProperty('avoidMiddle') && kStyle.prefs.avoidMiddle === true)
    //     avoidMiddle = true;
    //   // _list.Conga(kList, sW, sH, eH, avoidMiddle);
    //   break;
    // case 'Text':
    //   gc.active -= waitFor;
    //   let sTM = 'HYPE!';
    //   if (cfg.display.kappa.styles.hasOwnProperty(kStyle.style) && cfg.display.kappa.styles[kStyle.style].hasOwnProperty('message'))
    //     sTM = cfg.display.kappa.styles[kStyle.style].message[shared.rnd(cfg.display.kappa.styles[kStyle.style].message.length)];
    //   if (kStyle.prefs.hasOwnProperty('message') && Array.isArray(kStyle.prefs.message) && kStyle.prefs.message.length > 0)
    //     sTM = kStyle.prefs.message[shared.rnd(kStyle.prefs.message.length)];
    //   let sTT = cfg.emote.time;
    //   if (cfg.display.kappa.styles.hasOwnProperty(kStyle.style) && cfg.display.kappa.styles[kStyle.style].hasOwnProperty('time'))
    //     sTT = cfg.display.kappa.styles[kStyle.style].time;
    //   if (kStyle.prefs.hasOwnProperty('time') && kStyle.prefs.time > 0)
    //     sTT = kStyle.prefs.time;
    //   // _list.Text(kList, sW, sH, sTM, sTT);
    //   break;
    // case 'TheCube':
    //   const cS = Math.min(sW, sH);
    //   let sCS = 8 / 10;
    //   if (cfg.display.kappa.styles.hasOwnProperty(kStyle.style) && cfg.display.kappa.styles[kStyle.style].hasOwnProperty('size'))
    //     sCS = cfg.display.kappa.styles[kStyle.style].size;
    //   if (kStyle.prefs.hasOwnProperty('size'))
    //     sCS = kStyle.prefs.size;
    //   let sCC = true;
    //   if (cfg.display.kappa.styles.hasOwnProperty(kStyle.style) && cfg.display.kappa.styles[kStyle.style].hasOwnProperty('center'))
    //     sCC = cfg.display.kappa.styles[kStyle.style].center;
    //   if (kStyle.prefs.hasOwnProperty('center'))
    //     sCC = kStyle.prefs.center;
    //   let sCR = 5;
    //   if (cfg.display.kappa.styles.hasOwnProperty(kStyle.style) && cfg.display.kappa.styles[kStyle.style].hasOwnProperty('rotations'))
    //     sCR = cfg.display.kappa.styles[kStyle.style].rotations;
    //   if (kStyle.prefs.hasOwnProperty('rotations'))
    //     sCR = kStyle.prefs.rotations;
    //   let bF = false;
    //   if (cfg.display.kappa.styles.hasOwnProperty(kStyle.style) && cfg.display.kappa.styles[kStyle.style].hasOwnProperty('faces'))
    //     bF = cfg.display.kappa.styles[kStyle.style].faces;
    //   if (kStyle.prefs.hasOwnProperty('faces'))
    //     bF = kStyle.prefs.faces === true;
    //   let kUse = [];
    //   if (bF)
    //     kUse = kList;
    //   else
    //     kUse.push(kList[shared.getRandomNumber(lK)]);
    //   // _list.TheCube(kUse, sW, sH, Math.floor(cS * sCS), sCC, sCR);
    //   break;
    // case 'Burst':
    //   const oH = rndFromRange(timing.kappa[kStyle.style].left);
    //   const oV = rndFromRange(timing.kappa[kStyle.style].top) * sB;
    //   const bA = kAcTime(kStyle.count, estMS);
    //   for (let i = 0; i < kStyle.count; i++) {
    //     if (gc.titanic > tInit)
    //       return;
    //     const rB = shared.getRandomNumber(lK);
    //     gc.active--;
    //     let eWb = eH;
    //     if (kList[rB].hasOwnProperty('width') && kList[rB].hasOwnProperty('height'))
    //       eWb = kList[rB].width / kList[rB].height * eH;
    //     const sRb = sW - Math.ceil(eWb / 2);
    //     // display.emote.list.StraightLine(kList[rB], sW, sH, eH, oH * sRb, oV, false, tInit);
    //     if (i % bA.ct === bA.ct - 1)
    //       await framePause(bA.f);
    //   }
    //   break;
    // case 'Fountain':
    //   const fX = rndFromRange(timing.kappa[kStyle.style].left) * sW;
    //   const fY = rndFromRange(timing.kappa[kStyle.style].top);
    //   const fA = kAcTime(kStyle.count, estMS);
    //   for (let i = 0; i < kStyle.count; i++) {
    //     if (gc.titanic > tInit)
    //       return;
    //     const rF = shared.getRandomNumber(lK);
    //     gc.active--;
    //     // display.emote.list.Fountain(kList[rF], sW, sH, eH, fX, fY, false, tInit);
    //     if (i % fA.ct === fA.ct - 1)
    //       await framePause(fA.f);
    //   }
    //   break;
    // case 'Confetti':
    //   const cA = _kAcTime(kStyle.count, estMS);
    //   for (let i = 0; i < kStyle.count; i++) {
    //     if (_iTitanic > tInit)
    //       return;
    //     const rN = shared.rnd(lK);
    //     _eActive--;
    //     display.emote.list.Confetti(kList[rN], sW, sH, eHh, false, tInit);
    //     if (i % cA.ct === cA.ct - 1)
    //       await _fPause(cA.f);
    //   }
    //   break;
    // case 'StraightLine':
    //   const r = shared.rnd(lK);
    //   display.emote.list.StraightLine(kList[r], sW, sH, eH, false, false, false, tInit);
    //   break
  }
}

function _getKappaCountEstimate(k: any) {
  switch (k.style) {
    case 'Pyramid':
    case 'SmallPyramid':
      let c = 0;
      for (let i = 0, l = pyramidDist.length; i < l; i++) {
        c += pyramidDist[i];
      }
      return c;
    case 'Fireworks':
      const inner = Math.max(3, Math.floor(k.count * timing.kappa.Fireworks.quantity.small));
      const core = Math.floor(k.count * timing.kappa.Fireworks.quantity.medium);
      const outer = Math.max(3, Math.floor(k.count * timing.kappa.Fireworks.quantity.large));
      return 1 + inner + core + outer;
    case 'Conga':
      const sW = window.innerWidth;
      const sH = window.innerHeight;
      const eH = Math.max(cfg.emote.size.min, Math.min(cfg.emote.size.max, Math.floor(sW * cfg.emote.size.ratio.normal), Math.floor(sH * cfg.emote.size.ratio.normal)));
      const bS = Math.ceil(eH * timing.kappa.Conga.size);
      return Math.floor(sW / bS);
    case 'TheCube':
      return 6;
  }
  return k.count;
}
