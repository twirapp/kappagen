import { showEmotes } from "./show";
import { shared } from "./shared";
import "./style.css";

window.show = () => {
  showEmotes(
    [
      {
        url: "https://cdn.7tv.app/emote/648634581d7be7346709d1bb/4x.webp",
        str: "vahui",
        pos: 10,
        width: 128,
        height: 128,
      },
      {
        url: "https://cdn.7tv.app/emote/648634581d7be7346709d1bb/4x.webp",
        str: "vahui",
        pos: 10,
        width: 128,
        height: 128,
      },
      {
        url: "https://cdn.7tv.app/emote/62c5c34724fb1819d9f08b4d/4x.webp",
        str: "vahui",
        pos: 10,
        width: 128,
        height: 128,
      },
      {
        url: "https://cdn.7tv.app/emote/62c5c34724fb1819d9f08b4d/4x.webp",
        str: "vahui",
        pos: 10,
        width: 128,
        height: 128,
      },
    ],
    {
      style: "Bounce",
      prefs: {},
      count: 150,
    }
  );
};

const startup = () => {
  shared.msPerFrame.initialize();
};

window.addEventListener("load", startup);
