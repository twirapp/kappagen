import { bounceAnimation } from './bounce'
import { stillAnimation } from './still'

export const animations: Record<string, Function> = {
  'Still': stillAnimation,
  'Bounce': bounceAnimation
}
