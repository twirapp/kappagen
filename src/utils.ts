import { animations } from "./animations";
import { timeAnimation, cfg } from "./constants";
import { gc } from "./gc";
import { shared } from "./shared";
import { EmoteInfo } from "./types";

export function styleEmote(
  animationNames: string[],
  animationDelays: string[],
  animationDurations: string[],
  animationTimings: string[],
  animationFills: string[],
  animationCounts: string[],
  fadeIn: boolean = true,
  zoomIn: boolean = true,
  fadeOut: boolean = true,
  zoomOut: boolean = true,
  ms: number = 0
): string {
  if (ms === 0) {
    ms = Math.floor(cfg.emote.time * 1000);
  }

  const msFadeIn = timeAnimation.fade.in / 100;
  const msFadeOut = timeAnimation.fade.out / 100;
  const msZoomIn = timeAnimation.zoom.in / 100;
  const msZoomOut = timeAnimation.zoom.out / 100;

  if (fadeIn) {
    animationNames.push("fadeIn");
    animationDelays.push("0s");
    animationDurations.push(Math.floor(ms * msFadeIn) + "ms");
    animationTimings.push("ease-in");
    animationFills.push("forwards");
    animationCounts.push("1");
  }

  if (zoomIn) {
    animationNames.push("zoomIn");
    animationDelays.push("0s");
    animationDurations.push(Math.floor(ms * msZoomIn) + "ms");
    animationTimings.push("linear");
    animationFills.push("forwards");
    animationCounts.push("1");
  }

  if (fadeOut) {
    animationNames.push("fadeOut");
    animationDelays.push(Math.floor(ms - ms * msFadeOut) + "ms");
    animationDurations.push(Math.floor(ms * msFadeOut) + "ms");
    animationTimings.push("ease-out");
    animationFills.push("forwards");
    animationCounts.push("1");
  } else {
    animationNames.push("noFadeOut");
    animationDelays.push(ms - 50 + "ms");
    animationDurations.push("50ms");
    animationTimings.push("ease-out");
    animationFills.push("forwards");
    animationCounts.push("1");
  }

  if (zoomOut) {
    animationNames.push("zoomOut");
    animationDelays.push(Math.floor(ms - ms * msZoomOut) + "ms");
    animationDurations.push(Math.floor(ms * msZoomOut) + "ms");
    animationTimings.push("linear");
    animationFills.push("forwards");
    animationCounts.push("1");
  }

  return styleEmoteString(
    animationNames,
    animationDelays,
    animationDurations,
    animationTimings,
    animationFills,
    animationCounts
  );
}

export function styleEmoteString(
  animationNames: string[],
  animationDelays: string[],
  animationDurations: string[],
  animationTimings: string[],
  animationFills: string[],
  animationCounts: string[]
) {
  let style = "";

  if (animationNames.length > 0) {
    style += " animation-name: " + animationNames.join() + ";";
    style += " animation-delay: " + animationDelays.join() + ";";
    style += " animation-duration: " + animationDurations.join() + ";";
    style += " animation-timing-function: " + animationTimings.join() + ";";
    style += " animation-fill-mode: " + animationFills.join() + ";";
    style += " animation-iteration-count: " + animationCounts.join() + ";";
  }

  if (animationNames.includes("fadeIn")) {
    style += " opacity: 0;";
  }

  return style;
}

export function addEmoteToDocument(
  timeInit: number,
  uri: string,
  variationSize: number,
  attributes: any = {},
  returnElement: boolean = false,
  optionsGC: any = {},
  optionsTransform: any = false
) {
  if (gc.titanic > timeInit) {
    return;
  }

  const imgElement = document.createElement("img");
  const classes = ["emote"];
  if ("classes" in attributes) {
    classes.push(...attributes.classes);
  }
  const roundedVariationSize = variationSize.toFixed(3).replace(".", "_");
  classes.push("eSize-" + roundedVariationSize);
  imgElement.classList.add(...classes);

  setImageSource(imgElement, uri);

  if ("style" in attributes) {
    imgElement.setAttribute("style", attributes.style);
  }

  if ("dataset" in attributes) {
    for (
      let i = 0, keys = Object.keys(attributes.dataset), length = keys.length;
      i < length;
      i++
    ) {
      imgElement.setAttribute("data-" + keys[i], attributes.dataset[keys[i]]);
    }
  }

  gc.active++;
  document.body.appendChild(imgElement);

  let includeSpace = true;
  let decrementActive = true;
  let transform = false;

  if (optionsGC !== false) {
    if ("space" in optionsGC) {
      includeSpace = optionsGC.space;
    }
    if ("decrement" in optionsGC) {
      decrementActive = optionsGC.decrement;
    }
    if ("time" in optionsGC) {
      transform = optionsGC.time;
    }
    gc.hook(imgElement, includeSpace, decrementActive, transform);
  }

  if (optionsTransform !== false) {
    let translateFunction = null;
    if ("x" in optionsTransform && "y" in optionsTransform) {
      translateFunction =
        "translate(" + optionsTransform.x + "px, " + optionsTransform.y + "px)";
    } else if ("x" in optionsTransform) {
      translateFunction = "translateX(" + optionsTransform.x + "px)";
    } else if ("y" in optionsTransform) {
      translateFunction = "translateY(" + optionsTransform.y + "px)";
    }

    if (translateFunction !== null) {
      shared.doNextFrame(
        transformMoveOnDock,
        timeInit,
        imgElement,
        translateFunction
      );
    }
  }

  if (returnElement) {
    return imgElement;
  }
}

export function setImageSource(image: HTMLImageElement, url: string) {
  image.alt = "";
  image.src = url;
}

export function transformMoveOnDock(
  timeInit: number,
  image: HTMLImageElement,
  transformFunction: string
) {
  if (gc.titanic > timeInit) return;
  image.style.transform = transformFunction;
}

export function queueEmote(emote: EmoteInfo) {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const emoteHeight = Math.max(
    cfg.emote.size.min,
    Math.min(
      cfg.emote.size.max,
      Math.floor(screenWidth * cfg.emote.size.ratio.normal),
      Math.floor(screenHeight * cfg.emote.size.ratio.normal)
    )
  );

  document.documentElement.style.setProperty("--height", screenHeight + "px");
  document.documentElement.style.setProperty("--width", screenWidth + "px");

  const randomStyleIndex = shared.getRandomNumber(cfg.display.styles.length);
  const style = cfg.display.styles[randomStyleIndex];
  if (style) {
    animations[style](emote, screenWidth, screenHeight, emoteHeight);
  }
}

export function showEmotes() {
  if (gc.toEmote !== false) {
    window.clearTimeout(gc.toEmote);
    gc.toEmote = false;
  }

  if (cfg.emote.max > 0 && gc.active >= cfg.emote.max) {
    gc.toEmote = window.setTimeout(showEmotes, 500);
    return;
  }

  let emote = null;
  while ((emote = gc.toShow.shift()) !== undefined) {
    queueEmote(emote);
    if (cfg.emote.max > 0 && gc.active > cfg.emote.max) {
      if (cfg.emote.queue > 0 && gc.toShow.length > cfg.emote.queue)
        gc.toShow.splice(0, gc.toShow.length - cfg.emote.queue);
      gc.toEmote = window.setTimeout(showEmotes, 500);
      return;
    }
  }
}

export function rndFromRange(range: { min: number; max: number }) {
  return shared.getRandomNumber(range.max - range.min) + range.min;
}

export function addToShowList(p: any) {
  gc.toShow.push(...p);
}

export function kAcTime(ct: any, time: any = false) {
  if (time === false) {
    time = Math.floor(cfg.emote.time * 1000);
  }

  const f = Math.floor(time / shared.msPerFrame.value);
  const r = f / ct;
  if (r > 1)
    return { f: Math.ceil(r), ct: 1 };
  return { f: 1, ct: Math.ceil(1 / r) };
}

export function framePause(frames = 1) {
  return new Promise(
    function (resolve) {
      if (frames < 1) {
        resolve(false);
        return;
      }
      let n = 0;
      function _next() {
        n++;
        if (n < frames) {
          window.requestAnimationFrame(_next);
          return;
        }
        resolve(true);
      }
      window.requestAnimationFrame(_next);
    }
  );
}
