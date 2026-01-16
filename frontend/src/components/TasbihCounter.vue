<template>
  <div class="rounded-2xl border bg-card text-card-foreground shadow-sm h-full flex flex-col p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Hash :size="20" class="text-primary" />
        </div>
        <div>
          <h3 class="font-arabic-bold text-lg">المسبحة</h3>
          <p class="text-[10px] text-muted-foreground">Compteur</p>
        </div>
      </div>
      
      <!-- Target Selector -->
      <div class="flex gap-1 bg-muted/50 p-1 rounded-md">
        <button 
          v-for="t in [33, 99, Infinity]" 
          :key="t"
          @click="setTarget(t)"
          class="px-2 py-1 text-[10px] font-bold rounded transition-all"
          :class="target === t ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'"
        >
          <span v-if="t === Infinity">∞</span>
          <span v-else>{{ t }}</span>
        </button>
      </div>
    </div>

    <div class="flex flex-col items-center justify-between flex-1 gap-4">
      <!-- Interactive Counter Area -->
      <div class="relative group mt-2">
        <!-- Main Circular Button -->
        <button 
          @click="increment"
          class="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-b from-primary to-primary/90 shadow-xl shadow-primary/20 flex flex-col items-center justify-center text-white transition-all active:scale-95 active:shadow-inner hover:brightness-110 relative overflow-hidden ring-4 ring-background"
        >
          <!-- Ripple Effect Container -->
          <div class="absolute inset-0 bg-white/20 opacity-0 active:opacity-100 transition-opacity"></div>
          
          <span class="text-4xl md:text-5xl font-bold font-mono tracking-wider tabular-nums">
            {{ count }}
          </span>
          <span class="text-[9px] md:text-[10px] mt-1 opacity-90 font-arabic">اضغط</span>
        </button>

        <!-- Progress Ring -->
        <div v-if="target !== Infinity" class="absolute -inset-3 rounded-full border-2 border-muted -z-10"></div>
        <svg v-if="target !== Infinity" class="absolute -inset-3 w-[calc(100%+24px)] h-[calc(100%+24px)] -rotate-90 pointer-events-none -z-10">
          <circle
            cx="50%"
            cy="50%"
            r="calc(50% - 1px)"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            class="text-primary transition-all duration-300"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="strokeDashoffset"
          />
        </svg>
      </div>

      <!-- Controls & History -->
      <div class="grid grid-cols-2 gap-3 w-full mt-auto pt-4 border-t border-border/50">
        <!-- Current Session Info -->
        <div class="flex flex-col items-center justify-center p-2 rounded-lg bg-muted/30">
          <p class="text-[10px] text-muted-foreground mb-1 font-arabic">المجموع</p>
          <p class="text-lg font-bold font-mono text-primary">{{ totalCount }}</p>
        </div>

        <button 
          @click="reset" 
          class="flex flex-col items-center justify-center gap-1 p-2 rounded-lg bg-destructive/5 text-destructive hover:bg-destructive/10 transition-colors"
        >
          <RotateCcw :size="14" />
          <span class="font-bold text-[10px]">تصفير</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { Hash, RotateCcw } from 'lucide-vue-next'

const count = ref(0)
const totalCount = ref(0)
const target = ref(33)
const radius = 100 // Approximate radius for SVG circle calculation
const circumference = 2 * Math.PI * radius

const strokeDashoffset = computed(() => {
  if (target.value === Infinity) return 0
  const progress = count.value / target.value
  return circumference * (1 - progress)
})

const increment = () => {
  count.value++
  totalCount.value++
  
  // Vibration logic for mobile (10ms light tap)
  if (navigator?.vibrate) {
    navigator.vibrate(10)
  }

  // Auto-reset when target reached
  if (target.value !== Infinity && count.value >= target.value) {
    // Longer vibration to indicate completion
    if (navigator?.vibrate) {
      navigator.vibrate([50, 50, 50])
    }
    setTimeout(() => {
      count.value = 0
    }, 300)
  }
}

const reset = () => {
  count.value = 0
}

const setTarget = (val) => {
  target.value = val
  count.value = 0
}

// Persistance basique
onMounted(() => {
  const savedTotal = localStorage.getItem('tasbih_total')
  if (savedTotal) totalCount.value = parseInt(savedTotal)
})

watch(totalCount, (newVal) => {
  localStorage.setItem('tasbih_total', newVal)
})
</script>
