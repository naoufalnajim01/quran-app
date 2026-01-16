<template>
  <div class="min-h-screen bg-[#f5f5dc] dark:bg-zinc-900 py-8 px-4">
    <div class="max-w-5xl mx-auto">
      <!-- Header du Mode Mushaf -->
      <div class="mb-8 text-center">
        <div class="inline-flex items-center gap-3 mb-4">
          <button
            @click="toggleReadingMode"
            class="p-2 rounded-lg hover:bg-primary/10 transition-colors"
            title="العودة للوضع العادي"
          >
            <BookOpen :size="24" class="text-primary" />
          </button>
          <h2 class="font-arabic-bold text-3xl text-primary">وضع المصحف الشريف</h2>
        </div>
        
        <!-- Navigation entre sourates -->
        <div class="flex items-center justify-center gap-4 mt-4">
          <button
            @click="previousSurah"
            :disabled="currentSurahIndex === 0"
            class="px-4 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-border hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-arabic flex items-center gap-2"
          >
            <ChevronRight :size="18" />
            السورة السابقة
          </button>
          
          <!-- Dropdown sélection sourate -->
          <select
            v-model="currentSurahId"
            @change="scrollToSurah(currentSurahId)"
            class="px-6 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-border font-arabic-bold text-lg focus:ring-2 focus:ring-primary"
            dir="rtl"
          >
            <option v-for="surah in surahs" :key="surah.id" :value="surah.number">
              {{ surah.number }}. {{ store.surahNamesTashkeel[surah.number] || surah.name_ar }}
            </option>
          </select>
          
          <button
            @click="nextSurah"
            :disabled="currentSurahIndex === surahs.length - 1"
            class="px-4 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-border hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-arabic flex items-center gap-2"
          >
            السورة التالية
            <ChevronLeft :size="18" />
          </button>
        </div>
      </div>

      <!-- Page du Mushaf -->
      <div class="bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl border-4 border-primary/20 overflow-hidden">
        <!-- Pattern décoratif -->
        <div class="h-3 bg-gradient-to-r from-primary/20 via-primary to-primary/20"></div>
        
        <div class="p-8 md:p-12 relative">
          <!-- Background pattern -->
          <div class="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
          
          <!-- Contenu -->
          <div class="relative z-10 space-y-12">
            <div
              v-for="surah in visibleSurahs"
              :key="surah.id"
              :id="`surah-${surah.number}`"
              class="scroll-mt-32"
            >
              <!-- En-tête de la Sourate -->
              <div class="text-center mb-8 space-y-4">
                <!-- Nom de la sourate avec décoration -->
                <div class="relative py-6">
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t-2 border-primary/20"></div>
                  </div>
                  <div class="relative flex justify-center">
                    <div class="px-8 py-4 bg-white dark:bg-zinc-800 rounded-full border-2 border-primary shadow-lg">
                      <h3 class="font-arabic-bold text-3xl text-primary">
                        {{ store.surahNamesTashkeel[surah.number] || surah.name_ar }}
                      </h3>
                    </div>
                  </div>
                </div>

                <!-- Info sourate -->
                <div class="flex items-center justify-center gap-4 text-sm font-arabic">
                  <span
                    :class="[
                      'px-3 py-1 rounded-full',
                      surah.type === 'Meccan'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                    ]"
                  >
                    {{ surah.type === 'Meccan' ? 'مكية' : 'مدنية' }}
                  </span>
                  <span class="text-muted-foreground">{{ surah.verses_count || surahAyahs.get(surah.number)?.length || 0 }} آية</span>
                </div>

                <!-- Bismillah (sauf sourate 9 et sourate 1) -->
                <div v-if="surah.number !== 9 && surah.number !== 1" class="mt-6">
                  <p class="font-arabic-bold text-3xl md:text-4xl text-foreground leading-loose" dir="rtl">
                    بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                  </p>
                </div>
              </div>

              <!-- Versets en continu -->
              <div 
                class="font-arabic text-justify leading-[2.5] md:leading-[3] text-foreground"
                :style="{ fontSize: fontSize + 'px' }"
                dir="rtl"
              >
                <span
                  v-for="ayah in surahAyahs.get(surah.number)"
                  :key="ayah.id"
                  class="hover:text-primary transition-colors cursor-pointer group inline relative"
                  :class="{ 
                    'text-primary bg-primary/5 rounded px-1 box-decoration-clone': store.currentPlayingAyahId === ayah.id,
                    'bg-amber-50 dark:bg-amber-900/20': hasNote(ayah)
                  }"
                  @click="handleAyahClick(ayah)"
                  :title="`الآية ${ayah.number_in_surah}`"
                >
                  {{ ayah.text }}
                  <span class="inline-flex items-center justify-center h-[1.2em] w-[1.2em] mx-1 border-2 border-current rounded-full text-[0.45em] font-arabic-bold opacity-70 align-middle select-none group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary group-hover:opacity-100 transition-all">
                    {{ ayah.number_in_surah }}
                  </span>
                  
                  <!-- Indicateur de note -->
                  <span v-if="hasNote(ayah)" class="inline-block w-2 h-2 bg-amber-500 rounded-full ml-1 align-middle"></span>
                </span>
              </div>

              <!-- Séparateur entre sourates -->
              <div v-if="surah.number !== surahs[surahs.length - 1].number" class="mt-12 mb-8">
                <div class="flex items-center">
                  <div class="flex-1 border-t-2 border-primary/30"></div>
                  <div class="px-8">
                    <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Star :size="20" class="text-primary fill-current" />
                    </div>
                  </div>
                  <div class="flex-1 border-t-2 border-primary/30"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pattern décoratif bas -->
        <div class="h-3 bg-gradient-to-r from-primary/20 via-primary to-primary/20"></div>
      </div>

      <!-- Contrôles flottants -->
      <div class="fixed bottom-8 right-8 flex flex-col gap-3 z-40">
        <!-- Scroll to top -->
        <button
          @click="scrollToTop"
          class="p-4 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-110"
          title="العودة للأعلى"
        >
          <ArrowUp :size="24"  />
        </button>

        <!-- Font size controls -->
        <div class="flex flex-col gap-2 bg-white dark:bg-zinc-800 rounded-full p-2 shadow-lg">
          <button
            @click="store.increaseFontSize()"
            class="p-3 rounded-full hover:bg-accent transition-colors"
            title="تكبير الخط"
          >
            <Plus :size="20" />
          </button>
          <span class="text-center text-sm font-bold">{{ fontSize }}</span>
          <button
            @click="store.decreaseFontSize()"
            class="p-3 rounded-full hover:bg-accent transition-colors"
            title="تصغير الخط"
          >
            <Minus :size="20" />
          </button>
        </div>
      </div>

      <!-- Contexte Menu (sur clic verset) -->
      <Transition name="fade">
        <div
          v-if="contextMenu.show"
          :style="{ top: contextMenu.y + 'px', left: contextMenu.x + 'px' }"
          class="fixed z-50 bg-white dark:bg-zinc-800 rounded-xl shadow-2xl border border-border p-2 min-w-[200px]"
        >
          <button
            @click="playSelectedAyah"
            class="w-full px-4 py-2 rounded-lg hover:bg-accent text-right font-arabic flex items-center justify-end gap-2"
          >
            <span>تشغيل</span>
            <Play :size="16" />
          </button>
          <button
            @click="openNoteForSelectedAyah"
            class="w-full px-4 py-2 rounded-lg hover:bg-accent text-right font-arabic flex items-center justify-end gap-2"
          >
            <span>إضافة ملاحظة</span>
            <StickyNote :size="16" />
          </button>
          <button
            @click="copySelectedAyah"
            class="w-full px-4 py-2 rounded-lg hover:bg-accent text-right font-arabic flex items-center justify-end gap-2"
          >
            <span>نسخ</span>
            <Copy :size="16" />
          </button>
        </div>
      </Transition>

      <!-- Overlay pour fermer le menu -->
      <div
        v-if="contextMenu.show"
        @click="contextMenu.show = false"
        class="fixed inset-0 z-40"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { 
  BookOpen, ChevronLeft, ChevronRight, 
  ArrowUp, Plus, Minus, Star, Play, Copy, StickyNote 
} from 'lucide-vue-next'
import { useQuranStore } from '../stores/quran'

const props = defineProps({
  surahs: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['toggle-mode', 'open-note'])

const store = useQuranStore()
const currentSurahId = ref(1)
const fontSize = computed(() => store.fontSize)
const surahAyahs = ref(new Map())
const visibleSurahs = computed(() => {
  // Afficher 3 sourates à la fois pour une navigation fluide
  const index = surahs.value.findIndex(s => s.number === currentSurahId.value)
  return surahs.value.slice(Math.max(0, index), Math.min(surahs.value.length, index + 3))
})

const surahs = computed(() => props.surahs)
const currentSurahIndex = computed(() => 
  surahs.value.findIndex(s => s.number === currentSurahId.value)
)

// Context menu
const contextMenu = ref({
  show: false,
  x: 0,
  y: 0,
  ayah: null
})

onMounted(async () => {
  // Charger les ayahs pour les sourates visibles
  await loadVisibleSurahs()
})

watch(currentSurahId, async () => {
  await loadVisibleSurahs()
})

const loadVisibleSurahs = async () => {
  for (const surah of visibleSurahs.value) {
    if (!surahAyahs.value.has(surah.number)) {
      await store.fetchAyahs(surah.number)
      // Créer une copie des ayahs immédiatement
      const ayahsCopy = [...store.ayahs]
      surahAyahs.value.set(surah.number, ayahsCopy)
    }
  }
}


const scrollToSurah = (surahNumber) => {
  const element = document.getElementById(`surah-${surahNumber}`)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const previousSurah = () => {
  if (currentSurahIndex.value > 0) {
    currentSurahId.value = surahs.value[currentSurahIndex.value - 1].number
    scrollToSurah(currentSurahId.value)
  }
}

const nextSurah = () => {
  if (currentSurahIndex.value < surahs.value.length - 1) {
    currentSurahId.value = surahs.value[currentSurahIndex.value + 1].number
    scrollToSurah(currentSurahId.value)
  }
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const toggleReadingMode = () => {
  emit('toggle-mode')
}

const hasNote = (ayah) => {
  return !!store.getNoteForAyah(ayah.surah_id, ayah.number_in_surah)
}

const handleAyahClick = (ayah, event) => {
  contextMenu.value = {
    show: true,
    x: event?.clientX || window.innerWidth / 2,
    y: event?.clientY || window.innerHeight / 2,
    ayah: ayah
  }
}

const playSelectedAyah = () => {
  if (contextMenu.value.ayah) {
    store.playAyah(contextMenu.value.ayah)
  }
  contextMenu.value.show = false
}

const openNoteForSelectedAyah = () => {
  if (contextMenu.value.ayah) {
    emit('open-note', contextMenu.value.ayah)
  }
  contextMenu.value.show = false
}

const copySelectedAyah = () => {
  if (contextMenu.value.ayah) {
    const text = `${contextMenu.value.ayah.text}\n[الآية ${contextMenu.value.ayah.number_in_surah}]`
    navigator.clipboard.writeText(text)
  }
  contextMenu.value.show = false
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Scroll smooth */
html {
  scroll-behavior: smooth;
}
</style>
