# Kappagen

## Install

```sh
pnpm add kappagen
```

## Usage

```vue
<script setup lang="ts">
import KappagenOverlay from 'kappagen'
import type { Emote, KappagenEmoteConfig } from 'kappagen'
import { ref, onMounted, reactive } from 'vue'
import 'kappagen/style.css'

const rave = ref(false)
const emoteConfig = reactive<KappagenEmoteConfig>({
  max: 100,
  cube: {
    speed: 10
  }
})
const kappagen = ref<InstanceType<typeof KappagenOverlay>>()

const emotes: Emote[] = [
  {
    url: "https://cdn.7tv.app/emote/6548b7074789656a7be787e1/4x.webp",
    zwe: [
      {
        url: "https://cdn.7tv.app/emote/6128ed55a50c52b1429e09dc/4x.webp",
      },
    ],
  }
];

onMounted(() => {
  kappagen.value!.init()
})

async function spawnKappagen() {
  await kappagen.value!.kappagen.run(
    emotes,
    {
      style: "Fireworks",
      count: 150
    }
  )
}

function spawnEmotes() {
  kappagen.value!.emote.addEmotes(emotes)
  kappagen.value!.emote.showEmotes()
}

function clearEmotes() {
  kappagen!.clear()
}
</script>

<template>
  <kappagen-overlay ref="kappagen" :is-rave="rave" :emote-config="emoteConfig" />
</template>
```
