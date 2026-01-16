<template>
  <div class="fixed bottom-0 left-0 right-0 z-[100] bg-white dark:bg-zinc-950 border-t-2 border-primary/20 shadow-[0_-4px_30px_rgba(0,0,0,0.2)] p-4 transition-transform duration-300" :class="{ 'translate-y-full': !store.showKeyboard }">
    <div class="container mx-auto max-w-4xl">
      <!-- Header du clavier -->
      <div class="flex items-center justify-between mb-2 px-2">
        <span class="text-xs text-muted-foreground font-arabic">لوحة المفاتيح العربية</span>
        <button @click="store.showKeyboard = false" class="text-muted-foreground hover:text-foreground">
          <X :size="16" />
        </button>
      </div>

      <!-- Lignes de touches -->
      <div class="grid gap-2">
        <!-- Ligne 1 -->
        <div class="flex justify-center gap-1.5 md:gap-2 flex-wrap">
          <button 
            v-for="key in row1" 
            :key="key" 
            @click="typeKey(key)" 
            class="h-10 min-w-[32px] md:min-w-[44px] md:h-12 flex items-center justify-center rounded bg-white dark:bg-zinc-800 border border-border/50 text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground active:translate-y-0.5 active:shadow-none transition-all select-none text-lg md:text-xl font-arabic"
          >
            {{ key }}
          </button>
        </div>
        <!-- Ligne 2 -->
        <div class="flex justify-center gap-1.5 md:gap-2 flex-wrap">
          <button 
            v-for="key in row2" 
            :key="key" 
            @click="typeKey(key)" 
            class="h-10 min-w-[32px] md:min-w-[44px] md:h-12 flex items-center justify-center rounded bg-white dark:bg-zinc-800 border border-border/50 text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground active:translate-y-0.5 active:shadow-none transition-all select-none text-lg md:text-xl font-arabic"
          >
            {{ key }}
          </button>
        </div>
        <!-- Ligne 3 -->
        <div class="flex justify-center gap-1.5 md:gap-2 flex-wrap">
          <button 
            v-for="key in row3" 
            :key="key" 
            @click="typeKey(key)" 
            class="h-10 min-w-[32px] md:min-w-[44px] md:h-12 flex items-center justify-center rounded bg-white dark:bg-zinc-800 border border-border/50 text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground active:translate-y-0.5 active:shadow-none transition-all select-none text-lg md:text-xl font-arabic"
          >
            {{ key }}
          </button>
          <button 
            @click="backspace" 
            class="h-10 min-w-[32px] md:min-w-[44px] md:h-12 flex items-center justify-center rounded bg-muted/80 border border-border/50 text-foreground shadow-sm hover:bg-muted hover:text-foreground active:translate-y-0.5 active:shadow-none transition-all select-none px-4"
          >
            <Delete :size="18" />
          </button>
        </div>
        <!-- Espace -->
        <div class="flex justify-center mt-1">
          <button 
            @click="typeKey(' ')" 
            class="h-10 w-1/3 flex items-center justify-center rounded bg-white dark:bg-zinc-800 border border-border/50 text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground active:translate-y-0.5 active:shadow-none transition-all select-none text-xs"
          >
            مسافة
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { X, Delete } from 'lucide-vue-next'
import { useQuranStore } from '../stores/quran'

const store = useQuranStore()

const row1 = ['ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج', 'د']
const row2 = ['ش', 'س', 'ي', 'ب', 'ل', 'ا', 'ت', 'ن', 'm', 'ك', 'ط']
const row3 = ['ذ', 'ء', 'ؤ', 'ر', 'ى', 'ة', 'و', 'ز', 'ظ']

const typeKey = (char) => {
  store.searchQuery += char
}

const backspace = () => {
  store.searchQuery = store.searchQuery.slice(0, -1)
}
</script>
