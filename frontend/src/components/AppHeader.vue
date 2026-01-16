<template>
  <header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div class="container mx-auto px-4">
      <!-- Desktop Header -->
      <div class="hidden md:flex items-center justify-between gap-4 py-3">
        <!-- Logo + Titre -->
        <div class="flex items-center gap-3 flex-shrink-0">
          <img src="/logo.png" alt="القرآن الكريم" class="h-12 w-12 object-contain" />
          <div class="text-right">
            <h1 class="font-arabic-bold text-xl font-bold leading-none tracking-tight text-primary">القرآن الكريم</h1>
            <p class="font-arabic text-[10px] text-muted-foreground/70 mt-0.5">تلاوة، استماع وبحث</p>
          </div>
        </div>

        <!-- Search Bar -->
        <div class="flex-1 max-w-md">
          <div class="relative">
            <Search class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              v-model="store.searchQuery"
              type="text"
              placeholder="ابحث في القرآن..."
              dir="rtl"
              class="h-9 w-full rounded-lg border border-input bg-background px-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring font-arabic"
            />
            <button 
              @click="store.showKeyboard = !store.showKeyboard"
              class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
              :class="{ 'text-primary': store.showKeyboard }"
            >
              <Keyboard :size="16" />
            </button>
          </div>
        </div>

        <!-- Audio Player (Desktop) -->
        <div class="relative flex-shrink-0">
          <AudioPlayerCompact />
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2 flex-shrink-0">
          <button
            @click="store.toggleDarkMode()"
            class="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            <Moon v-if="store.darkMode" :size="18" />
            <Sun v-else :size="18" />
          </button>
          <button
            @click="$emit('toggle-about')"
            class="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            <Info :size="18" />
          </button>
        </div>
      </div>

      <!-- Mobile Header -->
      <div class="md:hidden py-3 space-y-3">
        <!-- Row 1: Logo + Actions -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <img src="/logo.png" alt="القرآن" class="h-10 w-10" />
            <h1 class="font-arabic-bold text-lg text-primary">القرآن الكريم</h1>
          </div>
          <div class="flex items-center gap-1">
            <button
              @click="store.toggleDarkMode()"
              class="p-2 rounded-lg hover:bg-accent text-muted-foreground"
            >
              <Moon v-if="store.darkMode" :size="18" />
              <Sun v-else :size="18" />
            </button>
            <button
              @click="$emit('toggle-about')"
              class="p-2 rounded-lg hover:bg-accent text-muted-foreground"
            >
              <Info :size="18" />
            </button>
          </div>
        </div>

        <!-- Row 2: Search -->
        <div class="relative">
          <Search class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            v-model="store.searchQuery"
            type="text"
            placeholder="ابحث..."
            dir="rtl"
            class="h-9 w-full rounded-lg border border-input bg-background px-10 py-2 text-sm font-arabic"
          />
          <button 
            @click="store.showKeyboard = !store.showKeyboard"
            class="absolute left-3 top-1/2 -translate-y-1/2"
            :class="store.showKeyboard ? 'text-primary' :  'text-muted-foreground'"
          >
            <Keyboard :size="16" />
          </button>
        </div>

        <!-- Row 3: Audio Player Mobile -->
        <div class="relative">
          <AudioPlayerCompact mobile />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { Search, Keyboard, Moon, Sun, Info } from 'lucide-vue-next'
import { useQuranStore } from '../stores/quran'
import AudioPlayerCompact from './AudioPlayerCompact.vue'

const store = useQuranStore()

defineEmits(['toggle-about'])
</script>
