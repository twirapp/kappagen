import { cfg, timing } from "../constants";
import { gc } from "../gc";
import { shared } from "../shared";
import { EmoteInfo } from "../types";
import { addEmoteToDocument, styleEmote } from "../utils";

export function stillAnimation(
  emoteInfo: EmoteInfo,
  screenWidth: number,
  screenHeight: number,
  emoteHeight: number,
  canVary: boolean = true,
  initialTime: number = 0
) {
  if (initialTime === 0) {
    initialTime = new Date().getTime();
  }
  if (gc.titanic > initialTime) {
    return;
  }

  let variationSize = 1;
  const emoteConfig = cfg.emote;

  if (canVary && emoteConfig.size.variation !== false) {
    if (typeof emoteConfig.size.variation === "number") {
      const chances: number[] = [];
      chances.push(0.5);
      chances.push(2);
      for (let i = 0; i < emoteConfig.size.variation; i++) {
        chances.push(1);
      }
      variationSize = chances[shared.getRandomNumber(chances.length)];
    }
    //  else if (
    //   typeof emoteConfig.size.variation === "object" &&
    //   'chance' in emoteConfig.size.variation &&
    //   'range' in emoteConfig.size.variation &&
    //   Array.isArray(emoteConfig.size.variation.range)
    // ) {
    //   const chances: number[] = [];
    //   chances.push(...emoteConfig.size.variation.range);
    //   for (let i = 0; i < emoteConfig.size.variation.chance; i++) {
    //     chances.push(1);
    //   }
    //   variationSize = chances[shared.getRandomNumber(chances.length)];
    // }
  }

  const modifiedEmoteHeight = Math.ceil(emoteHeight * variationSize);
  let modifiedEmoteWidth = modifiedEmoteHeight;

  if (emoteInfo.hasOwnProperty("width") && emoteInfo.hasOwnProperty("height")) {
    modifiedEmoteWidth =
      (emoteInfo.width / emoteInfo.height) * modifiedEmoteHeight;
  }

  const horizontalPosition = shared.getRandomNumber(
    screenWidth - modifiedEmoteWidth
  );
  const verticalPosition = shared.getRandomNumber(
    screenHeight - modifiedEmoteHeight
  );

  let style = `top: ${verticalPosition}px;`;
  style += ` left: ${horizontalPosition}px;`;
  style += ` --emote-height: ${modifiedEmoteHeight}px;`;
  style += ` --emote-width: ${modifiedEmoteWidth}px;`;

  const displayTiming = timing.display.Still;
  const transitionTime = Math.floor(
    emoteConfig.time * 1000 * displayTiming.time
  );

  style += styleEmote(
    [],
    [],
    [],
    [],
    [],
    [],
    emoteConfig.in.fade,
    emoteConfig.in.zoom,
    emoteConfig.out.fade,
    emoteConfig.out.zoom,
    transitionTime
  );

  addEmoteToDocument(
    initialTime,
    emoteInfo.url,
    variationSize,
    { style },
    false,
    {
      space: false,
      time: transitionTime,
    }
  );
}
