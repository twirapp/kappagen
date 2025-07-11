<template>
  <div
    class="kappagen"
    :class="{ rave: isRave }"
    ref="kappagenEl"
  />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, unref, watch, shallowRef, computed, nextTick } from 'vue'
import { cfg } from './config.js'
import { shared } from './shared.js'
import { createKappagen } from './kappagen.js'
import type { KappagenMethods, KappagenConfig } from './types.js'

const props = withDefaults(defineProps<{
  isRave?: boolean,
  config?: KappagenConfig
}>(), {
  isRave: false
})

const kappagenEl = shallowRef<HTMLElement>()
const kappagen = computed(() => {
  return createKappagen(kappagenEl.value)
})

watch(() => props.config, (config) => {
  if (!config) return
  cfg.emote = shared.deepMerge(cfg.emote, unref(props.config))
}, { deep: true, immediate: true })

onMounted(() => {
  shared.msPerFrame.start()
})

onUnmounted(() => {
  shared.msPerFrame.stop()
})

defineExpose<KappagenMethods>({
  clear() {
    kappagen.value.clear()
  },
  showEmotes(emotes) {
    kappagen.value.emote.showEmotes(emotes)
  },
  playAnimation(emotes, animation) {
    return kappagen.value.kappa.run(emotes, animation)
  }
})
</script>
