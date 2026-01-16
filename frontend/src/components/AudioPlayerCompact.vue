<template>
  <div :class="mobile ? 'w-full' : 'min-w-[500px] max-w-2xl'">
    <!-- Lecteur Audio Complet -->
    <div class="flex flex-col gap-2 p-3 rounded-xl bg-gradient-to-r from-muted/50 to-muted/30 border border-border/50 shadow-sm">
      <!-- Row 1: Info + Controls + Récitateur -->
      <div class="flex items-center gap-3">
        <!-- Sélecteur de Surah -->
        <div class="flex-1 min-w-0 relative surah-selector">
          <button 
            @click="showSurahMenu = !showSurahMenu"
            class="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg hover:bg-background/50 transition-colors group"
          >
            <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <img src="/logo.png" alt="القرآن" class="h-5 w-5 object-contain" />
            </div>
            <div class="min-w-0 flex-1 text-right">
              <p class="font-arabic-bold text-sm text-foreground whitespace-nowrap overflow-hidden">
                {{ store.currentSurah?.name_ar || 'اختر سورة' }}
              </p>
              <p v-if="store.currentPlayingAyahId" class="text-[10px] text-muted-foreground">
                آية {{ store.currentPlayingAyahId }}
              </p>
            </div>
            <ChevronDown :size="14" :class="{ 'rotate-180': showSurahMenu }" class="transition-transform text-muted-foreground" />
          </button>
          
          <Transition name="dropdown">
            <div v-if="showSurahMenu" class="absolute top-full left-0 mt-2 w-64 max-h-80 overflow-y-auto bg-background border border-border rounded-xl shadow-xl z-50 custom-scrollbar">
              <div class="p-2 space-y-1">
                <button
                  v-for="surah in store.surahs"
                  :key="surah.number"
                  @click="selectSurah(surah)"
                  class="w-full text-right px-3 py-2 rounded-lg hover:bg-accent transition-colors flex items-center justify-between"
                  :class="store.currentSurah?.number === surah.number ? 'bg-primary/10 text-primary' : ''"
                >
                  <span class="font-arabic-bold text-sm">{{ surah.name_ar }}</span>
                  <span class="text-xs text-muted-foreground">{{ surah.number }}</span>
                </button>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Controls -->
        <div class="flex items-center gap-1">
          <button 
            @click="previousAyah"
            class="p-2 rounded-full hover:bg-background/70 transition-colors text-muted-foreground hover:text-foreground"
            title="السابقة"
          >
            <SkipBack :size="16" />
          </button>
          
          <button 
            @click="togglePlay"
            class="p-2.5 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-md"
          >
            <Pause v-if="store.isPlaying" :size="18" />
            <Play v-else :size="18" class="ml-0.5" />
          </button>
          
          <button 
            @click="nextAyah"
            class="p-2 rounded-full hover:bg-background/70 transition-colors text-muted-foreground hover:text-foreground"
            title="التالية"
          >
            <SkipForward :size="16" />
          </button>
        </div>

        <!-- Sélecteur de Récitateur -->
        <div class="flex-1 min-w-0 hidden md:block relative reciter-selector">
          <button 
            @click="showReciterMenu = !showReciterMenu"
            class="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg hover:bg-background/50 transition-colors"
          >
            <Volume2 :size="14" class="text-primary shrink-0" />
            <span class="font-arabic text-xs truncate text-foreground">
              {{ store.selectedReciter?.name_ar || 'مشاري العفاسي' }}
            </span>
            <ChevronDown :size="14" :class="{ 'rotate-180': showReciterMenu }" class="transition-transform text-muted-foreground shrink-0" />
          </button>
          
          <Transition name="dropdown">
            <div v-if="showReciterMenu" class="absolute top-full right-0 mt-2 w-64 max-h-80 overflow-y-auto bg-background border border-border rounded-xl shadow-xl z-50 custom-scrollbar">
              <div class="p-2 space-y-1">
                <button
                  v-for="reciter in reciters"
                  :key="reciter.slug"
                  @click="selectReciter(reciter)"
                  class="w-full text-right px-3 py-2 rounded-lg hover:bg-accent transition-colors"
                  :class="store.selectedReciter?.slug === reciter.slug ? 'bg-primary/10 text-primary' : ''"
                >
                  <p class="font-arabic-bold text-sm">{{ reciter.name_ar }}</p>
                </button>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Volume Control -->
        <div class="hidden lg:flex items-center gap-2">
          <button 
            @click="toggleMute"
            class="p-2 rounded-full hover:bg-background/70 transition-colors text-muted-foreground hover:text-foreground"
          >
            <Volume2 v-if="!isMuted && volume > 0" :size="16" />
            <VolumeX v-else :size="16" />
          </button>
          <div 
            class="w-20 h-1.5 bg-muted rounded-full cursor-pointer relative group"
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

        <!-- Minimize/Maximize Button -->
        <button 
          @click="isMinimized = !isMinimized"
          class="p-2 rounded-full hover:bg-background/70 transition-colors text-muted-foreground hover:text-foreground"
          :title="isMinimized ? 'Agrandir' : 'Réduire'"
        >
          <ChevronDown :size="16" :class="{ 'rotate-180': isMinimized }" class="transition-transform" />
        </button>
      </div>

      <!-- Row 2: Progress Bar (only if not minimized) -->
      <div v-if="!isMinimized" class="flex items-center gap-2">
        <span class="text-[10px] text-muted-foreground font-mono w-10 text-right">
          {{ formatTime(currentTime) }}
        </span>
        <div 
          class="flex-1 h-1.5 bg-background/50 rounded-full cursor-pointer"
          @click="seek"
          ref="progressBar"
        >
          <div 
            class="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all"
            :style="{ width: progress + '%' }"
          ></div>
        </div>
        <span class="text-[10px] text-muted-foreground font-mono w-10">
          {{ formatTime(duration) }}
        </span>
      </div>
    </div>



    <!-- Audio Element (Hidden) -->
    <audio ref="audioPlayer" @timeupdate="updateProgress" @loadedmetadata="updateDuration" @ended="onAudioEnded"></audio>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted, onMounted } from 'vue'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, ChevronDown } from 'lucide-vue-next'
import { useQuranStore } from '../stores/quran'

const props = defineProps({
  mobile: Boolean
})

const store = useQuranStore()
const audioPlayer = ref(null)
const progressBar = ref(null)
const volumeBar = ref(null)
const currentTime = ref(0)
const duration = ref(0)
const isMuted = ref(false)
const volume = ref(parseInt(localStorage.getItem('audioVolume')) || 100)
const isMinimized = ref(false) // État minimisé/maximisé
const showSurahMenu = ref(false)
const showReciterMenu = ref(false)

// Utiliser les récitateurs du store au lieu d'une liste codée en dur
const reciters = computed(() => {
  return store.availableReciters.map(reciter => ({
    name_ar: reciter.name,
    slug: reciter.id,
    id: reciter.id
  }))
})

const progress = computed(() => {
  if (!duration.value) return 0
  return (currentTime.value / duration.value) * 100
})

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const togglePlay = async () => {
  if (!audioPlayer.value || !store.currentSurah) return
  
  if (store.isPlaying) {
    audioPlayer.value.pause()
    store.isPlaying = false
  } else {
    try {
      // Load first if no source
      if (!audioPlayer.value.src || audioPlayer.value.src === window.location.href) {
        loadAudio()
      }
      await audioPlayer.value.play()
      store.isPlaying = true
    } catch (error) {
      console.error('Erreur lecture:', error)
      store.isPlaying = false
    }
  }
}

const previousAyah = () => {
  if (store.currentPlayingAyahId > 1) {
    store.currentPlayingAyahId--
    loadAndPlay()
  }
}

const nextAyah = () => {
  if (!store.currentSurah) return
  
  const totalVerses = store.currentSurah.total_verses || store.currentSurah.verses_count || store.ayahs.length
  
  if (store.currentPlayingAyahId < totalVerses) {
    store.currentPlayingAyahId++
    loadAndPlay()
  } else {
    // Fin de la sourate
    store.isPlaying = false
    store.currentPlayingAyahId = 1
  }
}

const selectSurah = async (surah) => {
  store.currentSurah = surah
  store.currentPlayingAyahId = 1
  showSurahMenu.value = false
  await store.fetchAyahs(surah.number)
  // Don't auto-play, just load
  loadAudio()
}

const selectReciter = (reciter) => {
  store.selectedReciter = reciter
  showReciterMenu.value = false
  if (store.currentSurah && store.currentPlayingAyahId) {
    loadAudio() // Just load, don't auto-play
  }
}

const loadAudio = () => {
  if (!audioPlayer.value || !store.currentSurah || !store.currentPlayingAyahId) return
  
  // Trouver le récitateur et utiliser son dossier
  const reciter = store.availableReciters.find(r => r.id === store.selectedReciter)
  const reciterFolder = reciter?.folder || 'Alafasy_128kbps'
  const surahNum = String(store.currentSurah.number).padStart(3, '0')
  const ayahNum = String(store.currentPlayingAyahId).padStart(3, '0')
  
  // Format: https://everyayah.com/data/[reciter]/[surah][ayah].mp3
  audioPlayer.value.src = `https://everyayah.com/data/${reciterFolder}/${surahNum}${ayahNum}.mp3`
  
  console.log('Loading audio:', audioPlayer.value.src)
}

const loadAndPlay = async () => {
  if (!audioPlayer.value || !store.currentSurah) return
  
  loadAudio()
  try {
    await audioPlayer.value.play()
    store.isPlaying = true
  } catch (error) {
    console.error('Erreur lecture:', error)
    store.isPlaying = false
  }
}

const seek = (event) => {
  if (!progressBar.value || !audioPlayer.value || !duration.value) return
  const rect = progressBar.value.getBoundingClientRect()
  const clickX = event.clientX - rect.left
  const percentage = clickX / rect.width
  audioPlayer.value.currentTime = duration.value * percentage
}

const updateProgress = () => {
  if (audioPlayer.value) {
    currentTime.value = audioPlayer.value.currentTime
  }
}

const updateDuration = () => {
  if (audioPlayer.value) {
    duration.value = audioPlayer.value.duration
  }
}

const onAudioEnded = () => {
  // Passer automatiquement à l'ayah suivante
  if (!store.currentSurah) return
  
  const totalVerses = store.currentSurah.total_verses || store.currentSurah.verses_count || store.ayahs.length
  
  if (store.currentPlayingAyahId < totalVerses) {
    // Il y a encore des ayahs à lire
    store.currentPlayingAyahId++
    loadAndPlay()
  } else {
    // Fin de la sourate
    store.isPlaying = false
    store.currentPlayingAyahId = 1
    console.log('Fin de la sourate')
  }
}

const toggleMute = () => {
  if (audioPlayer.value) {
    audioPlayer.value.muted = !audioPlayer.value.muted
    isMuted.value = audioPlayer.value.muted
  }
}

const setVolume = (event) => {
  if (volumeBar.value) {
    const rect = volumeBar.value.getBoundingClientRect()
    // Calcul correct : gauche = 0%, droite = 100%
    const percent = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100))
    volume.value = Math.round(percent)
    
    // Appliquer le volume à l'audio en cours
    if (audioPlayer.value) {
      audioPlayer.value.volume = volume.value / 100
    }
    
    // Mettre à jour l'état muet
    if (volume.value === 0) {
      isMuted.value = true
    } else {
      isMuted.value = false
    }
    
    // Sauvegarder dans localStorage
    localStorage.setItem('audioVolume', volume.value)
  }
}

const updateVolume = () => {
  if (audioPlayer.value) {
    audioPlayer.value.volume = volume.value / 100
    if (volume.value === 0) {
      isMuted.value = true
    } else {
      isMuted.value = false
    }
    // Sauvegarder dans localStorage
    localStorage.setItem('audioVolume', volume.value)
  }
}

// Close menus on click outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.surah-selector') && !event.target.closest('.reciter-selector')) {
    showSurahMenu.value = false
    showReciterMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  // Initialize reciter if not set
  if (!store.selectedReciter) {
    store.selectedReciter = reciters.value[0]
  }
  // Initialize volume
  if (audioPlayer.value) {
    audioPlayer.value.volume = volume.value / 100
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  if (audioPlayer.value) {
    audioPlayer.value.pause()
    store.isPlaying = false
  }
})
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Scrollbar personnalisée verte */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(16, 185, 129, 0.1);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #10b981, #059669);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #059669, #047857);
}
</style>
