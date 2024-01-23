import type { KappagenAnimations } from "@twirapp/kappagen";

export const kappagenAnimationStyles = {
  TheCube: 'TheCube',
  Text: 'Text',
  Confetti: 'Confetti',
  Spiral: 'Spiral',
  Stampede: 'Stampede',
  Burst: 'Burst',
  Fountain: 'Fountain',
  SmallPyramid: 'SmallPyramid',
  Pyramid: 'Pyramid',
  Fireworks: 'Fireworks',
  Conga: 'Conga',
} as const

export type KappagenAnimationStyle = typeof kappagenAnimationStyles[keyof typeof kappagenAnimationStyles];

export const kappagenAnimations: KappagenAnimations[] = [
  {
    style: kappagenAnimationStyles.TheCube,
    prefs: {
      size: 0.1,
      center: false,
      speed: 6,
      faces: false,
    },
  },
  {
    style: kappagenAnimationStyles.Text,
    prefs: {
      message: ["Twir"],
      time: 3,
    },
  },
  {
    style: kappagenAnimationStyles.Confetti,
    count: 150,
  },
  {
    style: kappagenAnimationStyles.Spiral,
    count: 150,
  },
  {
    style: kappagenAnimationStyles.Stampede,
    count: 150,
  },
  {
    style: kappagenAnimationStyles.Burst,
    count: 150,
  },
  {
    style: kappagenAnimationStyles.Fountain,
    count: 150,
  },
  {
    style: kappagenAnimationStyles.SmallPyramid,
  },
  {
    style: kappagenAnimationStyles.Pyramid,
  },
  {
    style: kappagenAnimationStyles.Fireworks,
    count: 150,
  },
  {
    style: kappagenAnimationStyles.Conga,
    prefs: {
      avoidMiddle: false,
    },
  },
];
