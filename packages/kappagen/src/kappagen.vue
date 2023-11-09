<script setup>
import { watchEffect, unref } from 'vue';
import { cfg } from './config.js'
import { shared } from './shared.js'
import { kappagen } from './kappagen.js'

const props = defineProps({
  isRave: {
    type: Boolean,
    default: false
  },
  emoteConfig: {
    type: Object,
    required: false
  }
})

watchEffect(() => {
  if (props.isRave) {
    document.body.classList.add('rave')
  } else {
    document.body.classList.remove('rave')
  }

  if (props.emoteConfig) {
    const mergedEmoteConfig = shared.deepMerge(
      cfg.emote,
      unref(props.emoteConfig)
    )
    cfg.emote = mergedEmoteConfig
  }
})

defineExpose({
  init() {
    shared.msPerFrame.init();
  },
  clear() {
    kappagen.eraseAll();
  },
  get kappagen() {
    return kappagen.kappa;
  },
  get emote() {
    return kappagen.emote;
  },
});
</script>

<style global>
@import "./kappagen.css"
</style>
