<script setup lang="ts">
import { VTweakpane } from 'v-tweakpane'
import KappagenOverlay from '@twirapp/kappagen'
import type { Emote, KappagenConfig } from '@twirapp/kappagen/types'
import { ref, reactive } from 'vue'
import { kappagenAnimations, type KappagenAnimationStyle } from './animations.js'
import type { Pane } from 'tweakpane'

const playgroundParams = reactive({
  isRave: false,
  emoteUrl: 'https://cdn.7tv.app/emote/6548b7074789656a7be787e1/4x.webp',
  emoteZWEUrl: 'https://cdn.7tv.app/emote/6128ed55a50c52b1429e09dc/4x.webp'
})

const config = reactive<KappagenConfig>({
  max: 10,
  time: 10,
  queue: 100,
  cube: {
    speed: 10
  },
  size: {
    min: 1,
    max: 256,
    ratio: {
      normal: 1 / 12,
      small: 1 / 24
    }
  }
})

const kappagen = ref<InstanceType<typeof KappagenOverlay>>()

function getEmote(): Emote[] {
  return [
    {
      url: playgroundParams.emoteUrl,
      zwe: [
        {
          url: playgroundParams.emoteZWEUrl
        }
      ]
    }
  ]
}

async function runKappagenWithAnimation(style: KappagenAnimationStyle) {
  if (!kappagen.value) return
  const animation = kappagenAnimations.find(animation => animation.style === style)
  if (!animation) return
  await kappagen.value.playAnimation(getEmote(), animation)
}

function showEmotes() {
  if (!kappagen.value) return
  const countEmotes = Math.floor(Math.random() * 20)
  const randomEmotes = Array.from({ length: countEmotes }).map(() => ({
    url: playgroundParams.emoteUrl
  }))
  console.log(randomEmotes)
  kappagen.value.showEmotes(randomEmotes)
}

function clearEmotes() {
  if (!kappagen.value) return
  kappagen.value.clear()
}

function onPaneCreated(pane: Pane) {
  const emoteConfigFolder = pane.addFolder({ title: 'Emotes' })
  emoteConfigFolder.addBinding(playgroundParams, 'isRave', {
    label: 'Rave',
  })
  emoteConfigFolder.addBinding(config, 'max', {
    label: 'Max',
    min: 1,
    max: 100,
    step: 1
  })
  emoteConfigFolder.addBinding(config, 'time', {
    label: 'Time',
    min: 1,
    max: 1000,
    step: 1
  })
  emoteConfigFolder.addBinding(config, 'queue', {
    label: 'Queue',
    min: 1,
    max: 1000,
    step: 1
  })
  emoteConfigFolder.addBinding(playgroundParams, 'emoteUrl', {
    label: 'Emote'
  })
  emoteConfigFolder.addBinding(playgroundParams, 'emoteZWEUrl', {
    label: 'Emote Zero Width'
  })

  const sizesFolder = pane.addFolder({ title: 'Size' })
  sizesFolder.addBinding(config.size!, 'min', {
    label: 'Min',
    min: 1,
    max: 256,
    step: 1
  })
  sizesFolder.addBinding(config.size!, 'max', {
    label: 'Max',
    min: 1,
    max: 256,
    step: 1
  })
  sizesFolder.addBinding(config.size!.ratio!, 'normal', {
    label: 'Ratio (normal)',
    min: 0.01,
    max: 1,
    step: 0.01
  })
  sizesFolder.addBinding(config.size!.ratio!, 'small', {
    label: 'Ratio (small)',
    min: 0.01,
    max: 1,
    step: 0.01
  })

  const animationsFolder = pane.addFolder({ title: 'Animations' })
  for (const animation of kappagenAnimations) {
    animationsFolder.addButton({ title: animation.style }).on('click', () => {
      runKappagenWithAnimation(animation.style)
    })
  }

  pane.addBlade({ view: 'separator' })

  pane.addButton({ title: 'Show random emotes' }).on('click', showEmotes)
  pane.addButton({ title: 'Clear' }).on('click', clearEmotes)
}
</script>

<template>
  <v-tweakpane
    :pane="{ title: 'Kappagen Playground' }"
    @on-pane-created="onPaneCreated"
  />
  <kappagen-overlay
    ref="kappagen"
    :is-rave="playgroundParams.isRave"
    :config="config"
  />
</template>
