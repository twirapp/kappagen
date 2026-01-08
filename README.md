# Kappagen

## Install

```sh
pnpm add @twirapp/kappagen
```

## Usage

```vue
<script setup lang="ts">
import { ref, reactive } from 'vue'
import KappagenOverlay from '@twirapp/kappagen'
import type { Emote, KappagenConfig, KappagenMethods } from '@twirapp/kappagen/types'
import '@twirapp/kappagen/styles'

const isRave = ref(false)

const config = reactive<KappagenConfig>({
  max: 100,
  cube: {
    speed: 10
  }
})

const kappagen = ref<KappagenMethods>()

const emotes: Emote[] = [
  {
    url: 'https://cdn.7tv.app/emote/6548b7074789656a7be787e1/4x.webp',
    zwe: [
      {
        url: 'https://cdn.7tv.app/emote/6128ed55a50c52b1429e09dc/4x.webp',
      }
    ]
  }
]

async function playAnimation() {
  if (!kappagen.value) return
  await kappagen.value.playAnimation(
    emotes,
    {
      style: 'Fireworks',
      count: 150
    }
  )
}

function showEmotes() {
  if (!kappagen.value) return
  kappagen.value.showEmotes(emotes)
}

function clearEmotes() {
  if (!kappagen.value) return
  kappagen.value.clear()
}
</script>

<template>
  <kappagen-overlay
    ref="kappagen"
    :is-rave="isRave"
    :config="config"
  />
</template>
```
