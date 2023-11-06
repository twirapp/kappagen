import { kappagenAnimations } from "./constants";
import "./style.css";

interface Emote {
  url: string;
  str: string;
  pos: number;
  width: number;
  height: number;
}

interface AnimationParams {
  style: string;
  prefs: any;
  count: number;
}

declare global {
  interface Window {
    startup: () => void;
    emote: {
      addToShowList: (emote: Emote[]) => void;
      showEmotes: () => void;
    };
    kappagen: {
      show: (emotes: Emote[], params: AnimationParams) => Promise<void>;
    };
    rnd: (num: number) => number;
  }
}

const emote = {
  url: "https://cdn.7tv.app/emote/6548b7074789656a7be787e1/4x.webp",
  str: "twir",
  pos: 10,
  width: 112,
  height: 112,
};

const buttonKappagen = document.createElement("button");
buttonKappagen.textContent = "Kappagen";
buttonKappagen.addEventListener("click", () => {
  window.emote.showEmotes();
  window.kappagen.show(
    [emote],
    kappagenAnimations[window.rnd(kappagenAnimations.length)]
  );
});

const buttonSpawn = document.createElement("button");
buttonSpawn.textContent = "Spawn";
buttonSpawn.addEventListener("click", () => {
  const randomCountEmotes = window.rnd(15) + 1;
  const emotes = new Array(randomCountEmotes).fill(emote);
  window.emote.addToShowList(emotes);
  window.emote.showEmotes();
});

document.body.append(buttonKappagen, buttonSpawn);

window.addEventListener("load", window.startup);
