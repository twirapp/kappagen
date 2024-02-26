<script setup lang="ts">
import { onMounted, onUnmounted, unref, watch } from 'vue'
import { cfg } from './config.js'
import { shared } from './shared.js'
import { kappagen } from './kappagen.js'
import type { KappagenMethods, KappagenConfig } from './types.js'

const props = withDefaults(defineProps<{
  isRave?: boolean,
  config?: KappagenConfig
}>(), {
  isRave: false
})

watch(() => props.isRave, (isRave) => {
  if (isRave) {
    document.body.classList.add('rave')
  } else {
    document.body.classList.remove('rave')
  }
}, { immediate: true })

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
    kappagen.clear()
  },
  showEmotes(emotes) {
    kappagen.emote.showEmotes(emotes)
  },
  playAnimation(emotes, animation) {
    return kappagen.kappa.run(emotes, animation)
  }
})
</script>

<style global>
@import "./kappagen.css"
</style>
