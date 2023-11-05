import { cfg } from "./constants";

export interface GarbageCollectItem {
  img: HTMLElement;
  space: boolean;
  dec: boolean | number;
  end: number;
}

export const gc = (function () {
  const items: Record<number, GarbageCollectItem> = {};

  let active = 0
  let titanic = 0
  let toEmote: any = false;
  const toShow: any[] = [];
  let timeoutId: number | null = null;

  function performGarbageCollection() {
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
      timeoutId = null;
    }

    let done = true;
    const currentTime = new Date().getTime();

    for (const idx in items) {
      if (!items.hasOwnProperty(idx)) continue;
      done = false;

      const item = items[idx];
      const { img, end, dec, space } = item;

      if (space) {
        const rect = img.getBoundingClientRect();
        if (
          end > currentTime &&
          rect.bottom > 0 &&
          rect.right > 0 &&
          rect.top < window.innerHeight &&
          rect.left < window.innerWidth
        ) {
          continue;
        }
      } else {
        if (end > currentTime) {
          continue;
        }
      }

      delete items[idx];
      if (img.parentNode !== null) {
        document.body.removeChild(img);
      }
      if (dec === true) {
        active--;
      } else if (dec !== false && !isNaN(dec)) {
        active -= dec;
      }
    }

    if (!done) {
      timeoutId = window.setTimeout(performGarbageCollection, 500);
    }
  }

  function hook(
    img: HTMLElement,
    space = true,
    decActive = true,
    time: number | boolean = false
  ) {
    if (time === false) {
      time = Math.floor(cfg.emote.time * 1000);
    }

    let x = 0;
    do {
      x++;
    } while (items.hasOwnProperty(x));

    items[x] = {
      img: img,
      space: space,
      dec: decActive,
      end: new Date().getTime() + (time as number),
    };

    if (timeoutId === null) {
      timeoutId = window.setTimeout(performGarbageCollection, 500);
    }
  }

  return {
    hook,
    active,
    titanic,
    toEmote,
    toShow
  };
})();
