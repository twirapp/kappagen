import { kappagenAnimations } from "./constants";
import "./style.css";

interface Emote {
  url: string;
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
    random: (num: number) => number;
  }
}

const emote = {
  url: "https://cdn.7tv.app/emote/6548b7074789656a7be787e1/4x.webp",
};

const buttonKappagen = document.createElement("button");
buttonKappagen.textContent = "Kappagen";
buttonKappagen.addEventListener("click", () => {
  window.kappagen.show(
    [emote],
    kappagenAnimations[window.random(kappagenAnimations.length)]
  );
});

const buttonSpawn = document.createElement("button");
buttonSpawn.textContent = "Spawn";
buttonSpawn.addEventListener("click", () => {
  const randomCountEmotes = window.random(15) + 1;
  const emotes = new Array(randomCountEmotes).fill(emote);
  window.emote.addToShowList(emotes);
  window.emote.showEmotes();
});

document.body.append(buttonKappagen, buttonSpawn);

window.addEventListener("load", window.startup);
