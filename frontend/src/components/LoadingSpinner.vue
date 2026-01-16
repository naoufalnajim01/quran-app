<template>
  <div class="flex flex-col items-center justify-center py-12">
    <Loader2 :size="48" class="animate-spin text-primary mb-4" />
    <p class="text-muted-foreground font-arabic">{{ message }}</p>
  </div>
</template>

<script setup>
import { Loader2 } from 'lucide-vue-next'

defineProps({
  message: {
    type: String,
    default: 'جاري التحميل...'
  }
})
</script>
