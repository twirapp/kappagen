export interface Emote {
  url: string;
  zwe?: Omit<Emote, "zwe">[];
}

export type KappagenAnimations =
  | {
      style: "TheCube";
      prefs: {
        /**
         * @default 0.2
         */
        size: number;
        /**
         * @default false
         */
        center: boolean;
        /**
         * @default 6
         */
        rotations: number;
        /**
         * @default false
         */
        faces: boolean;
      };
    }
  | {
      style: "Text";
      prefs: {
        message: string[];
        time: number;
      };
    }
  | { style: "Confetti"; count: number }
  | { style: "Spiral"; count: number }
  | { style: "Stampede"; count: number }
  | { style: "Burst"; count: number }
  | { style: "Fountain"; count: number }
  | { style: "Fireworks"; count: number }
  | { style: "Conga"; prefs: { avoidMiddle: boolean } }
  | { style: "Pyramid" }
  | { style: "SmallPyramid" };

export type KappagenProps = {};

export type KappagenMethods = {
  init: () => void;
  clear: () => void;
  kappagen: {
    run: (emotes: Emote[], animation: KappagenAnimations) => Promise<void>;
    stop: () => void;
  };
  emote: {
    addEmotes: (emote: Emote[]) => void;
    showEmotes: () => void;
  };
};

declare const _default: import("vue").DefineComponent<
  KappagenProps,
  {},
  {},
  {},
  KappagenMethods
>;

export default _default;
