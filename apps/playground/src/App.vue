<script setup lang="ts">
import { VTweakpane } from 'v-tweakpane'
import KappagenOverlay from '@twirapp/kappagen'
import type { Emote, KappagenConfig } from '@twirapp/kappagen/types'
import { ref, reactive } from 'vue'
import { kappagenAnimations, kappagenAnimationStyles, type KappagenAnimationStyle } from './animations.js'
import type { Pane } from 'tweakpane'

const playgroundParams = reactive({
  isFrame: false,
  isRave: false,
  isZWE: true,
  text: 'Twir',
  emoteUrl: 'https://cdn.7tv.app/emote/01HEJ0NWTR0004F2B5D9XYF1Z1/4x.avif',
  emoteZWEUrl: 'https://cdn.7tv.app/emote/01FE3XY508000AA32JP519W2EW/4x.avif'
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
      zwe: playgroundParams.isZWE ? [
        {
          url: playgroundParams.emoteZWEUrl
        }
      ] : []
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
  kappagen.value.showEmotes(randomEmotes)
}

function clearEmotes() {
  if (!kappagen.value) return
  kappagen.value.clear()
}

function onPaneCreated(pane: Pane) {
  pane.addBinding(playgroundParams, 'isFrame', {
    label: 'Enable frame'
  })

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

  emoteConfigFolder.addBinding(playgroundParams, 'isZWE', {
    label: 'Enable Zero Width',
  }).on('change', ({ value }) => {
    emoteZWEUrl.disabled = !value
  })

  const emoteZWEUrl = emoteConfigFolder.addBinding(playgroundParams, 'emoteZWEUrl', {
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
  const textAnimation = kappagenAnimations
    .find((animation) => animation.style === kappagenAnimationStyles.Text)!
  animationsFolder.addButton({ title: textAnimation.style }).on('click', () => {
    textAnimation.prefs.message = [playgroundParams.text]
    runKappagenWithAnimation(textAnimation.style)
  })
  animationsFolder.addBinding(playgroundParams, 'text', {
    label: 'Text',
  })

  for (const animation of kappagenAnimations.slice(1)) {
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

  <div v-if="playgroundParams.isFrame" class="kappagen-frame">
    <kappagen-overlay
      ref="kappagen"
      :is-rave="playgroundParams.isRave"
      :config="config"
    />
  </div>
  <kappagen-overlay
    v-else
    ref="kappagen"
    :is-rave="playgroundParams.isRave"
    :config="config"
  />
</template>

<style scoped>
.kappagen-frame {
  width: 800px;
  height: 600px;
  overflow: hidden;
  background-color: #333;
}
</style>
