export interface Emote {
  url: string
  width?: number
  height?: number
  zwe?: Omit<Emote, 'zwe'>[]
}

export type KappagenAnimations =
  | {
      style: 'TheCube'
      prefs: {
        /**
         * @default 0.2
         */
        size: number
        /**
         * @default false
         */
        center: boolean
        /**
         * @default 6
         */
        speed: number
        /**
         * @default false
         */
        faces: boolean
      }
    }
  | {
      style: 'Text'
      prefs: {
        message: string[]
        time: number
      }
    }
  | { style: 'Confetti'; count: number }
  | { style: 'Spiral'; count: number }
  | { style: 'Stampede'; count: number }
  | { style: 'Burst'; count: number }
  | { style: 'Fountain'; count: number }
  | { style: 'Fireworks'; count: number }
  | { style: 'Conga'; prefs: { avoidMiddle: boolean } }
  | { style: 'Pyramid' }
  | { style: 'SmallPyramid' }

export interface KappagenConfig {
  /**
   * The time an emote stays on screen, in seconds.
   * @default 5
   **/
  time?: number
  /**
   * Set a limit on the number of visible emotes.
   * Does not apply Kappagen animations.
   * Set to 0 to disable max limit.
   *
   * @default 0 - disabled max limit
   **/
  max?: number
  /**
   * If the number of emotes to display is greater than the maximum above,
   * the remaining emotes are stored in queue.
   * If you limit the size of this queue, it will prioritize the most recent emotes.
   * Set to 0 to disable queue limit.
   *
   * @default 0
   */
  queue?: number
  size?: {
    ratio?: {
      /** @default 1/12 */
      normal?: number
      /** @default 1/24 */
      small?: number
    }
    /** @default 1 */
    min?: number
    /** @default 256 */
    max?: number
  }
  cube?: {
    /**
     * Cube rotation speed.
     * @default 5
     **/
    speed?: number
  }
  animation?: {
    fade?: {
      /** @default 8 */
      in?: number
      /** @default 8 */
      out?: number
    }
    zoom?: {
      /** @default 17 */
      in?: number
      /** @default 8 */
      out?: number
    }
  }
  /**
   * Animation when showing an emote.
   */
  in?: {
    /** @default true */
    fade?: boolean
    /**
     * @default true
     */
    zoom?: boolean
  }
  /**
   * Animation when hiding an emote.
   */
  out?: {
    /** @default true */
    fade?: boolean
    /**
     * @default true
     */
    zoom?: boolean
  }
}

export type KappagenMethods = {
  clear: () => void
  showEmotes: (emote: Emote[]) => void
  playAnimation: (
    emotes: Emote[],
    animation: KappagenAnimations
  ) => Promise<void>
}
