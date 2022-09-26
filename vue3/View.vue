<template>
  <div>
    <span>{{ result?.name }}</span>
  </div>
</template>
<script setup lang="tsx">
import { useSlots, useAttrs } from 'vue';
const { result, loading } = defineProps(['result', 'loading']);

const slots = useSlots();
const attrs = useAttrs();
defineExpose({
  slots,
  attrs,
});
</script>
