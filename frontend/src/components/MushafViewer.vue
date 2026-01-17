<template>
  <div class="fixed inset-0 z-50 bg-background flex flex-col">
    <!-- Header avec navigation -->
    <div class="flex-shrink-0 border-b border-border bg-background/95 backdrop-blur">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between gap-4">
          <!-- Bouton retour -->
          <button
            @click="$emit('close')"
            class="p-2 rounded-lg hover:bg-accent transition-colors"
            title="العودة"
          >
            <X :size="20" />
          </button>

          <!-- Titre -->
          <div class="flex items-center gap-2">
            <img src="/logo.png" alt="المصحف" class="h-8 w-8" />
            <h2 class="font-arabic-bold text-lg hidden sm:block">المصحف الشريف</h2>
          </div>

          <!-- Navigation -->
          <div class="flex items-center gap-2">
            <!-- Page précédente -->
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              class="p-2 rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="الصفحة السابقة"
            >
              <ChevronRight :size="20" />
            </button>

            <!-- Numéro de page -->
            <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/30 border border-border">
              <input
                v-model.number="pageInput"
                @keyup.enter="goToPage"
                @blur="goToPage"
                type="number"
                min="1"
                max="604"
                class="w-12 text-center bg-transparent border-none outline-none font-arabic-bold text-sm"
              />
              <span class="text-xs text-muted-foreground font-arabic">/ 604</span>
            </div>

            <!-- Page suivante -->
            <button
              @click="nextPage"
              :disabled="currentPage === 604"
              class="p-2 rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="الصفحة التالية"
            >
              <ChevronLeft :size="20" />
            </button>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <!-- Index Button -->
            <button
              @click="showIndex = true"
              class="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors border border-primary/20"
              title="فهرس السور"
            >
              <img src="/logo.png" alt="الفهرس" class="w-[18px] h-[18px] rounded-sm" />
              <span class="font-arabic-bold text-sm text-primary hidden md:inline">الفهرس</span>
            </button>

            <div class="w-px h-6 bg-border"></div>

            <!-- Zoom out -->
            <button
              @click="zoomOut"
              :disabled="zoom <= 50"
              class="p-2 rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
              title="تصغير"
            >
              <ZoomOut :size="18" />
            </button>

            <!-- Zoom reset -->
            <button
              @click="resetZoom"
              class="px-2 py-1 rounded-lg hover:bg-accent transition-colors text-xs font-medium"
            >
              {{ zoom }}%
            </button>

            <!-- Zoom in -->
            <button
              @click="zoomIn"
              :disabled="zoom >= 200"
              class="p-2 rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
              title="تكبير"
            >
              <ZoomIn :size="18" />
            </button>

            <!-- Plein écran -->
            <button
              @click="toggleFullscreen"
              class="p-2 rounded-lg hover:bg-accent transition-colors hidden sm:block"
              title="ملء الشاشة"
            >
              <Maximize2 v-if="!isFullscreen" :size="18" />
              <Minimize2 v-else :size="18" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Viewer -->
    <div 
      ref="viewerContainer"
      class="flex-1 overflow-hidden bg-muted/20 flex items-center justify-center p-4 relative perspective-1000"
      @wheel.prevent="handleWheel"
    >
      <div 
        class="relative transition-transform duration-200"
        :style="{ transform: `scale(${zoom / 100})` }"
      >
        <!-- Image de la page (Sans animation) -->
        <div 
          class="relative bg-white shadow-2xl rounded-lg overflow-hidden inline-block"
        >
          <img
            :src="currentPageUrl"
            :alt="`صفحة ${currentPage}`"
            class="block max-h-[80vh] w-auto object-contain mx-auto"
            :class="{ 'opacity-0': isLoading }"
            @load="isLoading = false"
            @error="handleImageError"
          />
          
          <!-- Loader -->
          <div 
            v-if="isLoading"
            class="absolute inset-0 flex items-center justify-center bg-white"
          >
            <div class="flex flex-col items-center gap-3">
              <div class="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <p class="font-arabic text-sm text-muted-foreground">جاري التحميل...</p>
            </div>
          </div>
          
          <!-- Ombre centrale pour effet reliure (optionnel, on garde pour le look) -->
          <div class="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/5 to-transparent pointer-events-none"></div>
        </div>

        <!-- Numéro de page en overlay -->
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 text-white rounded-full text-sm font-arabic-bold backdrop-blur">
          صفحة {{ currentPage }}
        </div>
      </div>
    </div>

    <!-- Footer avec info (mobile) -->
    <div class="sm:hidden flex-shrink-0 border-t border-border bg-background p-3 text-center">
      <p class="font-arabic text-xs text-muted-foreground">
        استخدم الأسهم ← → للتنقل بين الصفحات
      </p>
    </div>

    <!-- Mushaf Index Modal -->
    <MushafIndex 
      v-if="showIndex"
      @close="showIndex = false"
      @select-surah="handleSurahSelect"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2
} from 'lucide-vue-next'
import MushafIndex from './MushafIndex.vue'

defineEmits(['close'])

// État
const currentPage = ref(1)
const pageInput = ref(1)
const zoom = ref(100)
const isLoading = ref(true)
const isFullscreen = ref(false)
const viewerContainer = ref(null)
const showIndex = ref(false)

// URL de l'image de la page courante
const currentPageUrl = computed(() => {
  // Utiliser une URL stable pour les pages du Mushaf avec padding (001, 002...)
  const pageStr = String(currentPage.value).padStart(3, '0')
  return `https://android.quran.com/data/width_1024/page${pageStr}.png`
})

// Navigation
const nextPage = () => {
  if (currentPage.value < 604) {
    currentPage.value++
    isLoading.value = true
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    isLoading.value = true
  }
}

const goToPage = () => {
  const page = parseInt(pageInput.value)
  if (page >= 1 && page <= 604) {
    currentPage.value = page
    isLoading.value = true
  } else {
    pageInput.value = currentPage.value
  }
}

// Zoom
const zoomIn = () => {
  if (zoom.value < 200) {
    zoom.value = Math.min(200, zoom.value + 25)
  }
}

const zoomOut = () => {
  if (zoom.value > 50) {
    zoom.value = Math.max(50, zoom.value - 25)
  }
}

const resetZoom = () => {
  zoom.value = 100
}

const handleWheel = (e) => {
  if (e.ctrlKey || e.metaKey) {
    // Zoom avec Ctrl + molette
    if (e.deltaY < 0) {
      zoomIn()
    } else {
      zoomOut()
    }
  }
}

// Plein écran
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    viewerContainer.value?.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

// Gestion des erreurs d'image
const handleImageError = () => {
  console.error(`Erreur de chargement de la page ${currentPage.value}`)
  isLoading.value = false
}

// Gestion de la sélection d'une sourate depuis l'index
const handleSurahSelect = ({ surah, page }) => {
  currentPage.value = page
  isLoading.value = true
}

// Raccourcis clavier
const handleKeydown = (e) => {
  switch (e.key) {
    case 'ArrowLeft':
      nextPage()
      break
    case 'ArrowRight':
      previousPage()
      break
    case '+':
    case '=':
      zoomIn()
      break
    case '-':
      zoomOut()
      break
    case '0':
      resetZoom()
      break
    case 'f':
    case 'F':
      toggleFullscreen()
      break
  }
}

// Synchroniser pageInput avec currentPage
watch(currentPage, (newPage) => {
  pageInput.value = newPage
})

// Lifecycle
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement
  })
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  if (document.fullscreenElement) {
    document.exitFullscreen()
  }
})
</script>

<style scoped>
/* Masquer les spinners des inputs number */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
}

/* On garde juste perspective pour le conteneur si besoin, sinon on peut enlever */
.perspective-1000 {
  perspective: 1000px;
}
</style>
