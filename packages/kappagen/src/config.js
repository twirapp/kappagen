import { reactive } from "vue";

export const cfg = reactive({
  radius: Math.PI * 2,
  display: {
    styles: [
      "Still", // No movement
      "StraightLine", // Gentle movement in a random straight line
      "Rise", // Slowly rise to top while wobbling back and forth
      "Bounce", // Fall from the top at an angle and bounce along the bottom (Windows Solitaire style)
      "Speed", // Zoom across the screen
      "Drop", // Get stuck at the top and tumble down (no fade/zoom in, only out)
      "Crazy", // Bounce off the walls [Layout Shifts - Requires offset-anchor / offset-position directives]
      "Confetti", // Fall like confetti                   (no zoom, no fade in, only fade out)
      "Throw", // Toss at the middle and tumble down   (no fade/zoom in, only out)
      "TheCube", // Rotate a 3D cube of an emote         (no zoom, only fade)
    ],
    kappa: {
      count: 150,
      styles: {
        Burst: {}, // Expand from a center point
        Fireworks: {}, // Burst out from a single emote (no fade/zoom; small emotes)
        Spiral: {}, // Burst out from a single emote in a spiral (no fade/zoom; small emotes)
        Pyramid: {}, // Build a pyramid        (no fade/zoom; specific-size emotes)
        SmallPyramid: {}, // Build a small pyramid  (no fade/zoom; small emotes)
        Fountain: {}, // Spout from a fountain  (no fade/zoom)
        Stampede: {}, // Stampede of emotes     (no fade/zoom)
        Confetti: {}, // Fall like confetti     (no zoom, no fade in, only fade out; small emotes)
        Conga: {}, // Start a conga line     (no fade/zoom)
        TheCube: {
          // Rotate a 3D cube of an emote (no zoom, only fade)
          size: 8 / 10,
          center: true,
          rotations: 5,
          faces: false,
        },
        // Show a message (no fade/zoom; specific-size emotes)
        Text: {
          message: ["HYPE!"],
          time: 3,
        },
      },
      conga: {
        contagious: false,
        time: 5,
        avoidMiddle: false,
      },
    },
  },
  emote: {
    time: 5,
    max: 0,
    queue: 0,
    size: {
      ratio: {
        normal: 1 / 12,
        small: 1 / 24,
      },
      min: 16,
      max: 256,
      variation: false,
    },
    cube: {
      rotations: 5,
    },
    animation: {
      fade: {
        in: 8,
        out: 8,
      },
      zoom: {
        in: 17,
        out: 8,
      },
    },
    in: {
      fade: true,
      zoom: true /* Layout Shifts - Requires independent scale directive */,
    },
    out: {
      fade: true,
      zoom: true /* Layout Shifts - Requires independent scale directive */,
    },
  },
});

// fractions (or decimal percentages) of the emote time configuration value
export const timing = {
  display: {
    Still: {
      time: 1,
    },
    StraightLine: {
      time: 1,
    },
    Rise: {
      origin: {
        /* percentages of the screen height */ min: 0.8,
        max: 1.1,
      },
      time: 1,
      wiggle: {
        /* percentages of the above time percentage */
        delay: {
          min: 0,
          max: 3 / 25,
        },
        min: 2 / 5,
        max: 1,
      },
    },
    Bounce: {
      origin: {
        /* percentages of the screen height */ min: 0,
        max: 0.2,
      },
      time: 1,
      velocity: {
        /* pixels per 300th of display time */
        h: {
          min: 3,
          max: 9,
        },
        v: {
          min: 4,
          max: 7,
        },
        loss: 0.3 /* velocity percentage lost per bounce */,
      },
      gravity: 1 /* pixels added to vertical velocity per increment */,
    },
    Speed: {
      origin: {
        /* percentages of the screen height */ min: 0.3,
        max: 0.7,
      },
      time: 1,
      delay: 0.1,
    },
    Drop: {
      time: 1,
    },
    Crazy: {
      time: 1,
      distance: 7000 /* max pixels to travel */,
      squash: {
        width: 2 /* squashed wide dimension */,
        height: 0.7 /* squashed tall dimension */,
        time: 1 / 50,
      },
    },
    Confetti: {
      time: 1,
    },
    Throw: {
      time: 1,
      twist: 7 / 50,
      toss: 1 / 5,
      drop: 4 / 5,
      dest: {
        h: {
          /* percentages of the screen width */ min: 0.3,
          max: 0.7,
        },
        v: {
          /* percentages of the screen height */ min: 0.3,
          max: 0.7,
        },
      },
    },
    TheCube: {
      time: 1,
    },
    Fountain: {
      time: 1 / 2,
    },
  },
  kappa: {
    Rise: {
      time: 2,
    },
    Speed: {
      time: 2,
    },
    Crazy: {
      time: 2,
    },
    Burst: {
      time: 1.5,
      top: {
        /* top and bottom margin of the origin point */ min: 1 / 4,
        max: 3 / 4,
      } /* left and right margin of the origin point */,
      left: {
        min: 1 / 4,
        max: 3 / 4,
      },
    },
    Fireworks: {
      time: 1,
      origin: {
        /* origin point(s) of the firework's rocket */ x: [1 / 2],
        y: [1],
      },
      dest: {
        /* destination point(s) of the firework's rocket */
        x: [1 / 4, 1 / 2, 3 / 4],
        y: [1 / 3],
      },
      speed: {
        rocket: 2 / 5 /* speed of rocket */,
        burst: 1 / 50 /* speed of initial burst */,
      },
      quantity: {
        /* number of emotes per burst */ small: 1 / 8,
        medium: 3 / 4,
        large: 1 / 8,
      },
      radius: {
        /* firework burst radii */ base: 2 / 3 /* screen's smaller dimension */,
        small: 1 / 3,
        medium: 2 / 3,
        large: 1,
      },
      spread: 12 /* how much more frequently to pause during medium burst */,
      delays: {
        /* pause between bursts */ small: 2 / 25,
        large: 1 / 10,
      },
    },
    Spiral: {
      time: 1 / 2,
      bulk: 8 /* max number of emotes to send in bulk (>1 can end up looking chunked) */,
      vectors: {
        /* number of emote vectors per circle */ min: 40,
        max: 60,
      },
    },
    Pyramid: {
      time: 1,
      show: {
        total: 0.8 /* percentage of time to spend showing the pyramid */,
        min: 75 /* minimum animation speed per block (in ms) */,
      },
      pause: 0.2,
      hide: 0.01,
    },
    SmallPyramid: {
      time: 1,
      show: {
        total: 0.8 /* percentage of time to spend showing the pyramid */,
        min: 100 /* minimum animation speed per block (in ms) */,
      },
      pause: 0.2,
      hide: 0.01,
    },
    Fountain: {
      time: 1.5,
      top: {
        /* peak of the fountain, as a percent of the screen height */
        min: 3 / 20,
        max: 2 / 5,
      } /* left and right margin of the origin point */,
      left: {
        min: 1 / 3,
        max: 2 / 3,
      },
    },
    Stampede: {
      time: 1,
      speed: 2 / 5 /* travel time across the screen for each emote */,
      maxdensity: 6 /* maximum emotes to show at once */,
      top: {
        min: 0.5 /* top of stampede relative to top of screen, in emote heights */,
        max: 0.5 /* bottom of stampede relative to bottom of screen, in emote heights */,
      },
      height: 3 /* height of stampede in emote heights */,
      bunch: {
        1: {
          min: 1,
          max: 5,
        },
        2: 8 /* this number minus the value of 1 */,
        4: {
          min: 0,
          max: 3,
        },
      },
      pause: {
        1: 4 / 5,
        2: 2 / 5,
      },
      smallSleep: {
        min: 90,
        max: 100,
      },
    },
    Confetti: {
      time: 1,
    },
    Conga: {
      time: {
        show: 2,
        hide: 2,
      },
      size: 5 / 3 /* height of animation space for row in emote heights */,
      height:
        5 / 6 /* height of each row of dancers in emote heights (padding) */,
      avoidMiddle: 6 /* rows to use when avoiding the middle (half top, half bottom; please use even numbers) */,
    },
    TheCube: {
      time: 1,
    },
    Text: {
      time: 1,
      show: {
        total: 0.8 /* percentage of time to spend showing the pyramid */,
        min: 75 /* minimum animation speed per block (in ms) */,
      },
      hide: 0.01,
    },
  },
};

// default image to use if your channel has no emotes
export const twirAppEmote = {
  url: "https://cdn.7tv.app/emote/6548b7074789656a7be787e1/4x.webp",
};

// distribution of emotes for Pyramid and SmallPyramid kappagen
export const pyramidDistribution = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1,
];

// distribution of emotes for letters in message kappagens
export const letters = {
  A: [
    [0, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 1, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 1, 0],
    [0, 0, 0, 0, 1, 0, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 0, 0, 0],
  ],
  a: [
    [0, 0, 1, 1, 1, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0, 1, 0, 0, 0],
    [0, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0],
  ],
  B: [
    [0, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 1, 0, 0, 1, 0],
    [0, 1, 0, 0, 1, 0, 0, 1, 0],
    [0, 1, 0, 0, 1, 0, 0, 1, 0],
    [0, 0, 1, 1, 0, 1, 1, 0, 0],
  ],
  b: [
    [0, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 0, 0, 0, 0],
  ],
  C: [
    [0, 0, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0, 0, 1, 0, 0],
  ],
  c: [
    [0, 0, 1, 1, 1, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0, 1, 0, 0, 0],
  ],
  D: [
    [0, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 1, 1, 1, 1, 1, 0, 0],
  ],
  d: [
    [0, 0, 1, 1, 1, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0, 1, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 0],
  ],
  E: [
    [0, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 1, 0, 0, 1, 0],
    [0, 1, 0, 0, 1, 0, 0, 1, 0],
    [0, 1, 0, 0, 1, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 1, 0],
  ],
  e: [
    [0, 0, 1, 1, 1, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0],
  ],
  F: [
    [0, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 1, 0, 0, 1, 0],
    [0, 0, 0, 0, 1, 0, 0, 1, 0],
    [0, 0, 0, 0, 1, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0],
  ],
  f: [
    [0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 1, 0],
    [0, 0, 0, 0, 1, 0, 1, 0, 0],
  ],
  G: [
    [0, 0, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 0, 1, 1, 0, 0, 1, 0],
    [0, 1, 0, 0, 1, 0, 0, 1, 0],
    [0, 0, 1, 1, 1, 0, 1, 0, 0],
  ],
  g: [
    [1, 0, 0, 1, 1, 0, 0, 0, 0],
    [1, 0, 1, 0, 0, 1, 0, 0, 0],
    [1, 0, 1, 0, 0, 1, 0, 0, 0],
    [0, 1, 1, 1, 1, 0, 0, 0, 0],
  ],
  H: [
    [0, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 0],
  ],
  h: [
    [0, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 1, 1, 1, 0, 0, 0, 0, 0],
  ],
  I: [
    [0, 1, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 1, 0],
  ],
  i: [
    [0, 1, 0, 0, 1, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 0, 1, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0],
  ],
  J: [
    [0, 0, 1, 0, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0],
  ],
  j: [
    [1, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 0, 1, 0, 0],
  ],
  K: [
    [0, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 1, 0],
  ],
  k: [
    [0, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 1, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 1, 0, 0, 0],
  ],
  L: [
    [0, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0],
  ],
  l: [
    [0, 1, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0],
  ],
  M: [
    [0, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 0],
  ],
  m: [
    [0, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 1, 1, 1, 1, 0, 0, 0, 0],
  ],
  N: [
    [0, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 0],
  ],
  n: [
    [0, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 1, 1, 1, 1, 0, 0, 0, 0],
  ],
  O: [
    [0, 0, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 1, 1, 1, 1, 1, 0, 0],
  ],
  o: [
    [0, 0, 1, 1, 1, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 0, 0, 0, 0],
  ],
  P: [
    [0, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 1, 0, 0, 1, 0],
    [0, 0, 0, 0, 1, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 1, 1, 0, 0],
  ],
  p: [
    [1, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0, 0],
  ],
  Q: [
    [0, 0, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0, 0, 0, 1, 0],
    [1, 1, 0, 1, 1, 1, 1, 0, 0],
  ],
  q: [
    [0, 0, 0, 1, 1, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0, 1, 0, 0, 0],
    [1, 1, 1, 1, 1, 0, 0, 0, 0],
  ],
  R: [
    [0, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 1, 0, 0, 1, 0],
    [0, 0, 0, 1, 1, 0, 0, 1, 0],
    [0, 0, 1, 0, 1, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 1, 1, 0, 0],
  ],
  r: [
    [0, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0],
  ],
  S: [
    [0, 0, 1, 0, 0, 1, 1, 0, 0],
    [0, 1, 0, 0, 1, 0, 0, 1, 0],
    [0, 1, 0, 0, 1, 0, 0, 1, 0],
    [0, 1, 0, 0, 1, 0, 0, 1, 0],
    [0, 0, 1, 1, 0, 0, 1, 0, 0],
  ],
  s: [
    [0, 1, 0, 0, 1, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0, 1, 0, 0, 0],
  ],
  T: [
    [0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0],
  ],
  t: [
    [0, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0],
  ],
  U: [
    [0, 0, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 0],
  ],
  u: [
    [0, 0, 1, 1, 1, 1, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 0, 0, 0],
  ],
  V: [
    [0, 0, 0, 0, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 0],
  ],
  v: [
    [0, 0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 0, 0, 0],
  ],
  W: [
    [0, 0, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 0],
  ],
  w: [
    [0, 0, 1, 1, 1, 1, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 0, 0, 0],
  ],
  X: [
    [0, 1, 1, 0, 0, 0, 1, 1, 0],
    [0, 0, 0, 1, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 1, 0, 0, 0],
    [0, 1, 1, 0, 0, 0, 1, 1, 0],
  ],
  x: [
    [0, 1, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 1, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 1, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 1, 0, 0, 0],
  ],
  Y: [
    [0, 0, 0, 0, 0, 0, 1, 1, 0],
    [0, 0, 0, 0, 1, 1, 0, 0, 0],
    [0, 1, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 1, 0],
  ],
  y: [
    [1, 0, 0, 1, 1, 1, 0, 0, 0],
    [1, 0, 1, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 0, 0, 0],
  ],
  Z: [
    [0, 1, 1, 0, 0, 0, 0, 1, 0],
    [0, 1, 0, 1, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 1, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 1, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 1, 1, 0],
  ],
  z: [
    [0, 1, 0, 0, 0, 1, 0, 0, 0],
    [0, 1, 1, 0, 0, 1, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 0, 0],
    [0, 1, 0, 0, 1, 1, 0, 0, 0],
    [0, 1, 0, 0, 0, 1, 0, 0, 0],
  ],
  1: [
    [0, 1, 0, 0, 0, 0, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0],
  ],
  2: [
    [0, 1, 1, 0, 0, 0, 1, 0, 0],
    [0, 1, 0, 1, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 1, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 1, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 1, 0, 0],
  ],
  3: [
    [0, 0, 1, 0, 0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 1, 0, 0, 1, 0],
    [0, 1, 0, 0, 1, 0, 0, 1, 0],
    [0, 0, 1, 1, 0, 1, 1, 0, 0],
  ],
  4: [
    [0, 0, 0, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 1, 1, 1, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0],
  ],
  5: [
    [0, 0, 1, 0, 0, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 1, 0, 1, 0],
    [0, 1, 0, 0, 0, 1, 0, 1, 0],
    [0, 0, 1, 1, 1, 0, 0, 1, 0],
  ],
  6: [
    [0, 0, 1, 1, 1, 1, 0, 0, 0],
    [0, 1, 0, 0, 1, 0, 1, 0, 0],
    [0, 1, 0, 0, 1, 0, 0, 1, 0],
    [0, 1, 0, 0, 1, 0, 0, 1, 0],
    [0, 0, 1, 1, 0, 0, 0, 0, 0],
  ],
  7: [
    [0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 1, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 1, 1, 0],
  ],
  8: [
    [0, 0, 1, 1, 0, 1, 1, 0, 0],
    [0, 1, 0, 0, 1, 0, 0, 1, 0],
    [0, 1, 0, 0, 1, 0, 0, 1, 0],
    [0, 0, 1, 1, 0, 1, 1, 0, 0],
  ],
  9: [
    [0, 0, 0, 0, 0, 1, 1, 0, 0],
    [0, 1, 0, 0, 1, 0, 0, 1, 0],
    [0, 1, 0, 0, 1, 0, 0, 1, 0],
    [0, 0, 1, 0, 1, 0, 0, 1, 0],
    [0, 0, 0, 1, 1, 1, 1, 0, 0],
  ],
  0: [
    [0, 0, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 0, 0, 0, 0, 1, 0],
    [0, 1, 0, 1, 1, 1, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 1, 0, 0],
  ],
  ">": [
    [0, 1, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 1, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0],
  ],
  "<": [
    [0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 1, 0],
  ],
  ":": [[0, 0, 1, 0, 0, 1, 0, 0, 0]],
  ".": [[0, 1, 0, 0, 0, 0, 0, 0, 0]],
  ",": [
    [1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0],
  ],
  "'": [
    [0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1],
  ],
  "-": [
    [0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0],
  ],
  _: [
    [0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0],
  ],
  "+": [
    [0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0],
  ],
  "=": [
    [0, 0, 0, 1, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 1, 0, 0, 0],
  ],
  "!": [
    [0, 0, 0, 0, 0, 1, 1, 0, 0],
    [0, 1, 0, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 1, 1, 0, 0],
  ],
  "@": [
    [0, 0, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 0, 0, 1, 0, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 0, 1, 1, 1, 0, 0],
  ],
  "#": [
    [0, 0, 0, 0, 1, 0, 1, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 1, 0, 1, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 1, 0, 1, 0, 0],
  ],
  $: [
    [0, 0, 1, 0, 0, 1, 1, 0, 0],
    [0, 1, 0, 0, 1, 0, 0, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 0, 0, 1, 0, 0, 1, 0],
    [0, 0, 1, 1, 0, 0, 1, 0, 0],
  ],
  "\u00a2": [
    [0, 0, 1, 1, 1, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 1, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 0, 0, 0, 1, 0, 0, 0],
  ],
  "\u20ac": [
    [0, 0, 0, 1, 0, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 1, 0],
  ],
  "\u00a3": [
    [0, 1, 0, 0, 1, 0, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 0, 1, 0],
    [0, 1, 0, 0, 1, 0, 0, 1, 0],
    [0, 1, 0, 0, 1, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 1, 0, 0],
  ],
  "\u00a5": [
    [0, 0, 0, 0, 1, 0, 1, 1, 0],
    [0, 0, 1, 0, 1, 1, 0, 0, 0],
    [0, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 1, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 1, 1, 0],
  ],
  "%": [
    [0, 1, 0, 0, 0, 0, 1, 1, 0],
    [0, 0, 1, 1, 0, 0, 1, 1, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 1, 1, 0, 0, 1, 1, 0, 0],
    [0, 1, 1, 0, 0, 0, 0, 1, 0],
  ],
  "?": [
    [0, 0, 0, 0, 0, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 0, 1, 1, 0, 0, 1, 0],
    [0, 0, 0, 0, 1, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 1, 1, 0, 0],
  ],
};
