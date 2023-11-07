# Kappagen

## Install

```sh
pnpm add kappagen
```

## Usage

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

import KappagenOverlay from 'kappagen'
import 'kappagen/style.css'

import type { Emote } from 'kappagen'

const kappagen = ref<InstanceType<typeof KappagenOverlay>>()

const emote: Emote = {
  url: "https://cdn.7tv.app/emote/6548b7074789656a7be787e1/4x.webp",
  zwe: [
    {
      url: "https://cdn.7tv.app/emote/6128ed55a50c52b1429e09dc/4x.webp",
    },
  ],
};

onMounted(() => {
  kappagen.value!.init()
})

async function fireworks() {
  await kappagen.value.kappagen!.run(
    [emote],
    {
      style: 'Fireworks',
      count: 100
    }
  )
}
</script>

<template>
  <button @click="fireworks">fireworks</button>
  <kappagen-overlay ref="kappagen" />
</template>
```
