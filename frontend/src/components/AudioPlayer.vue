<template>
  <div 
    class="fixed bottom-0 left-0 right-0 z-[90] bg-white dark:bg-zinc-950 border-t-2 border-primary/20 shadow-[0_-4px_30px_rgba(0,0,0,0.15)]"
  >
    <div class="container mx-auto px-4 py-3">
      <!-- Lecteur principal -->
      <div class="flex flex-col gap-3">
        <!-- Barre de progression -->
        <div class="flex items-center gap-3">
          <span class="text-xs text-muted-foreground w-12 text-right font-mono">{{ formatTime(currentTime) }}</span>
          <div 
            class="flex-1 h-2 bg-muted rounded-full cursor-pointer relative"
            @click="seek"
            ref="progressBar"
          >
            <div 
              class="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-100"
              :style="{ width: progress + '%' }"
            ></div>
            <!-- Thumb/Circle indicator -->
            <div 
              class="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white dark:bg-zinc-200 rounded-full shadow-lg border-2 border-primary transition-all duration-100 hover:scale-125"
              :style="{ left: `calc(${progress}% - 8px)` }"
            ></div>
          </div>
          <span class="text-xs text-muted-foreground w-12 font-mono">{{ formatTime(duration) }}</span>
        </div>

        <!-- Contrôles -->
        <div class="flex items-center justify-between gap-2 md:gap-4">
          <!-- Sélecteur de Surah -->
          <div class="flex-1 min-w-0 surah-selector">
            <button 
              @click.stop.prevent="toggleSurahMenu"
              class="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              type="button"
            >
              <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <img src="/logo.png" alt="القرآن" class="h-6 w-6 object-contain" />
              </div>
              <div class="min-w-0 text-right flex-1">
                <p class="font-arabic-bold text-sm truncate text-foreground">
                  {{ store.currentSurah?.name_ar || 'اختر سورة' }}
                </p>
                <p v-if="store.currentPlayingAyahId" class="text-xs text-muted-foreground">
                  الآية {{ store.currentPlayingAyahId }}
                </p>
              </div>
              <ChevronUp :size="14" :class="{ 'rotate-180': !showSurahMenu }" class="transition-transform text-muted-foreground" />
            </button>
          </div>

          <!-- Boutons de contrôle -->
          <div class="flex items-center gap-1">
            <button 
              @click.stop="previousAyah"
              class="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              title="السابقة"
              type="button"
            >
              <SkipBack :size="18" />
            </button>
            
            <button 
              @click.stop="togglePlay"
              class="p-3 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-lg"
              type="button"
            >
              <Pause v-if="store.isPlaying" :size="22" />
              <Play v-else :size="22" class="ml-0.5" />
            </button>
            
            <button 
              @click.stop="nextAyah"
              class="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              title="التالية"
              type="button"
            >
              <SkipForward :size="18" />
            </button>
          </div>

          <!-- Contrôle de volume -->
          <div class="hidden md:flex items-center gap-2 px-3">
            <button 
              @click="toggleMute"
              class="p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              type="button"
              title="Muet"
            >
              <Volume2 v-if="volume > 50" :size="18" />
              <Volume1 v-else-if="volume > 0" :size="18" />
              <VolumeX v-else :size="18" />
            </button>
            <div 
              class="w-20 h-2 bg-muted rounded-full cursor-pointer relative group"
              @click="setVolume"
              ref="volumeBar"
            >
              <div 
                class="h-full bg-gradient-to-r from-primary/60 to-primary rounded-full transition-all duration-100"
                :style="{ width: volume + '%' }"
              ></div>
              <!-- Volume thumb -->
              <div 
                class="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white dark:bg-zinc-200 rounded-full shadow-md border-2 border-primary transition-all duration-100 opacity-0 group-hover:opacity-100"
                :style="{ left: `calc(${volume}% - 6px)` }"
              ></div>
            </div>
          </div>

          <!-- Sélecteur de récitateur -->
          <div class="flex-1 flex justify-end items-center gap-2 reciter-selector">
            <button 
              @click.stop.prevent="toggleReciterMenu"
              class="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-sm cursor-pointer"
              type="button"
            >
              <Mic :size="14" class="text-primary" />
              <span class="font-arabic hidden sm:inline truncate max-w-[100px] text-xs">{{ currentReciter?.name || 'القارئ' }}</span>
              <ChevronUp :size="12" :class="{ 'rotate-180': !showReciterMenu }" class="transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Menu des sourates -->
    <div 
      v-if="showSurahMenu" 
      class="absolute bottom-full left-0 right-0 bg-white dark:bg-zinc-950 border-t border-border/50 shadow-lg max-h-72 overflow-y-auto z-[100]"
      @click.stop
    >
      <div class="container mx-auto p-2">
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1">
          <button
            v-for="surah in store.surahs"
            :key="surah.number"
            @click.stop="selectSurah(surah)"
            class="flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition-colors cursor-pointer"
            :class="store.currentSurah?.number === surah.number 
              ? 'bg-primary text-primary-foreground' 
              : 'hover:bg-muted'"
            type="button"
          >
            <span class="w-6 h-6 flex items-center justify-center rounded bg-black/5 dark:bg-white/5 text-xs font-bold">{{ surah.number }}</span>
            <span class="font-arabic truncate text-xs">{{ surah.name_ar }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Menu des récitateurs -->
    <div 
      v-if="showReciterMenu" 
      class="absolute bottom-full left-0 right-0 bg-white dark:bg-zinc-950 border-t border-border/50 shadow-lg max-h-64 overflow-y-auto z-[100]"
      @click.stop
    >
      <div class="container mx-auto p-2">
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1">
          <button
            v-for="reciter in store.reciters"
            :key="reciter.id"
            @click.stop="selectReciter(reciter.id)"
            class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-right cursor-pointer"
            :class="store.selectedReciterId === reciter.id 
              ? 'bg-primary text-primary-foreground' 
              : 'hover:bg-muted'"
            type="button"
          >
            <Mic :size="14" class="shrink-0" />
            <span class="font-arabic truncate">{{ reciter.name }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { BookOpen, Play, Pause, SkipBack, SkipForward, ChevronUp, Mic, Volume2, Volume1, VolumeX } from 'lucide-vue-next'
import { useQuranStore } from '../stores/quran'

const store = useQuranStore()

const showReciterMenu = ref(false)
const showSurahMenu = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const progress = ref(0)
const progressBar = ref(null)
const volume = ref(parseInt(localStorage.getItem('audioVolume')) || 100)
const previousVolume = ref(100)
const volumeBar = ref(null)

const currentReciter = computed(() => {
  return store.reciters.find(r => r.id === store.selectedReciterId)
})

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const toggleReciterMenu = () => {
  showReciterMenu.value = !showReciterMenu.value
  showSurahMenu.value = false
}

const toggleSurahMenu = () => {
  showSurahMenu.value = !showSurahMenu.value
  showReciterMenu.value = false
}

const togglePlay = () => {
  if (store.currentAudio) {
    if (store.isPlaying) {
      store.currentAudio.pause()
      store.isPlaying = false
    } else {
      store.currentAudio.play()
      store.isPlaying = true
    }
  } else if (store.ayahs.length > 0) {
    store.playAyah(store.ayahs[0])
  } else if (store.currentSurah) {
    // Charger les ayahs puis jouer
    store.fetchAyahs(store.currentSurah.number).then(() => {
      if (store.ayahs.length > 0) {
        store.playAyah(store.ayahs[0])
      }
    })
  }
}

const previousAyah = () => {
  if (store.currentPlayingAyahId && store.ayahs.length > 0) {
    const currentIndex = store.ayahs.findIndex(a => a.id === store.currentPlayingAyahId)
    if (currentIndex > 0) {
      store.playAyah(store.ayahs[currentIndex - 1])
    }
  } else if (store.ayahs.length > 0) {
    store.playAyah(store.ayahs[0])
  }
}

const nextAyah = () => {
  if (store.currentPlayingAyahId && store.ayahs.length > 0) {
    const currentIndex = store.ayahs.findIndex(a => a.id === store.currentPlayingAyahId)
    if (currentIndex < store.ayahs.length - 1) {
      store.playAyah(store.ayahs[currentIndex + 1])
    }
  } else if (store.ayahs.length > 0) {
    store.playAyah(store.ayahs[0])
  }
}

const selectReciter = (reciterId) => {
  store.selectedReciterId = reciterId
  showReciterMenu.value = false
  if (store.currentPlayingAyahId && store.ayahs.length > 0) {
    const currentAyah = store.ayahs.find(a => a.id === store.currentPlayingAyahId)
    if (currentAyah) {
      store.playAyah(currentAyah)
    }
  }
}

const selectSurah = async (surah) => {
  showSurahMenu.value = false
  store.currentSurah = surah
  
  // Charger les ayahs de cette sourate
  await store.fetchAyahs(surah.number)
  
  // Jouer automatiquement le premier verset
  if (store.ayahs.length > 0) {
    store.autoPlayEnabled = true
    store.playAyah(store.ayahs[0])
  }
}

const seek = (event) => {
  if (progressBar.value && store.currentAudio && duration.value) {
    const rect = progressBar.value.getBoundingClientRect()
    const percent = (event.clientX - rect.left) / rect.width
    store.currentAudio.currentTime = percent * duration.value
  }
}

const setVolume = (event) => {
  if (volumeBar.value) {
    const rect = volumeBar.value.getBoundingClientRect()
    // Calcul correct : gauche = 0%, droite = 100%
    const percent = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100))
    volume.value = Math.round(percent)
    
    // Appliquer le volume à l'audio en cours
    if (store.currentAudio) {
      store.currentAudio.volume = volume.value / 100
    }
    
    // Sauvegarder dans localStorage
    localStorage.setItem('audioVolume', volume.value)
  }
}

const toggleMute = () => {
  if (volume.value > 0) {
    previousVolume.value = volume.value
    volume.value = 0
  } else {
    volume.value = previousVolume.value || 100
  }
  
  if (store.currentAudio) {
    store.currentAudio.volume = volume.value / 100
  }
  
  localStorage.setItem('audioVolume', volume.value)
}

const updateProgress = () => {
  if (store.currentAudio) {
    currentTime.value = store.currentAudio.currentTime
    duration.value = store.currentAudio.duration || 0
    progress.value = duration.value ? (currentTime.value / duration.value) * 100 : 0
  }
}

watch(() => store.currentAudio, (newAudio) => {
  if (newAudio) {
    // Appliquer le volume sauvegardé
    newAudio.volume = volume.value / 100
    
    newAudio.addEventListener('timeupdate', updateProgress)
    newAudio.addEventListener('loadedmetadata', () => {
      duration.value = newAudio.duration
    })
  }
}, { immediate: true })

const handleClickOutside = (event) => {
  if (showReciterMenu.value) {
    const isInsideSelector = event.target.closest('.reciter-selector')
    if (!isInsideSelector) {
      showReciterMenu.value = false
    }
  }
  if (showSurahMenu.value) {
    const isInsideSurah = event.target.closest('.surah-selector')
    if (!isInsideSurah) {
      showSurahMenu.value = false
    }
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
