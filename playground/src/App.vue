<script setup lang="ts">
import KappagenOverlay from 'kappagen'
import type { Emote } from 'kappagen'
import { ref, onMounted } from 'vue'
import 'kappagen/style.css'

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
    {
      style: 'TheCube',
      prefs: {
        center: false,
        faces: true,
        rotations: 2,
        size: 0.1
      }
    }
  )
}
</script>

<template>
  <button @click="spawn">spawn</button>
  <button @click="kappagen?.clear()">clear</button>
  <kappagen-overlay ref="kappagen" />
</template>

<style global>
body {
  background-color: #000;
}
</style>
