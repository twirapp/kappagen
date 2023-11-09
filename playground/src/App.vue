<script setup lang="ts">
import KappagenOverlay from 'kappagen'
import type { Emote, KappagenEmoteConfig } from 'kappagen'
import { ref, onMounted, reactive } from 'vue'
import { kappagenAnimations } from './animations.js'
import 'kappagen/style.css'

const rave = ref(false)
const emoteConfig = reactive<KappagenEmoteConfig>({
  max: 10,
  time: 10,
  queue: 100,
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

async function runKappagen() {
  await kappagen.value!.kappagen.run(
    emotes,
    kappagenAnimations[Math.floor(Math.random() * kappagenAnimations.length)]
  )
}

function spawnEmotes() {
  const countEmotes = Math.floor(Math.random() * 20)
  const randomEmotes = Array.from({ length: countEmotes }).map(() => {
    return { url: emotes[0].url }
  })
  kappagen.value!.emote.addEmotes(randomEmotes)
  kappagen.value!.emote.showEmotes()
}
</script>

<template>
  <div class="controls">
    <button @click="runKappagen">kappagen</button>
    <button @click="spawnEmotes">spawn</button>
    <button @click="kappagen?.clear()">clear</button>
    <label>
      Rave
      <input type="checkbox" v-model="rave" />
    </label>
  </div>
  <kappagen-overlay ref="kappagen" :is-rave="rave" :emote-config="emoteConfig" />
</template>

<style global>
body {
  background-color: #000;
  user-select: none;
}

.controls {
  color: #fff;
  position: absolute;
  z-index: 999999;
}
</style>
