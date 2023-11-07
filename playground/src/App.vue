<script setup lang="ts">
import KappagenOverlay from 'kappagen'
import type { Emote } from 'kappagen'
import { ref, onMounted } from 'vue'
import { kappagenAnimations } from './animations.js'
import 'kappagen/style.css'

const rave = ref(false)
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

async function spawn() {
  await kappagen.value!.kappagen.run(
    emotes,
    kappagenAnimations[Math.floor(Math.random() * kappagenAnimations.length)]
  )
}
</script>

<template>
  <div class="controls">
    <button @click="spawn">spawn</button>
    <button @click="kappagen?.clear()">clear</button>
    <label>
      Rave
      <input type="checkbox" v-model="rave" />
    </label>
  </div>
  <kappagen-overlay ref="kappagen" :rave="rave" />
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
