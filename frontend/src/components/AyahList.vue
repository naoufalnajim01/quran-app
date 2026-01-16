<template>
  <div class="space-y-6 pb-24">
    <!-- Header de la Surah -->
    <div class="mb-8 rounded-lg border bg-card p-6 shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <button
          @click="$emit('back')"
          class="group inline-flex items-center gap-2 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground px-5 py-2.5 font-medium transition-all duration-200 hover:shadow-soft border border-primary/20 hover:border-primary"
        >
          <ArrowRight :size="18" class="rotate-180 group-hover:-translate-x-1 transition-transform" />
          <span class="font-arabic text-sm">العودة للرئيسية</span>
        </button>

        <div class="flex items-center gap-2">
          <!-- Sélecteur Tafsir Simple & Intuitif -->
          <div v-if="surah.id !== 0" class="relative hidden sm:block">
              <button 
                @click="toggleTafsirMenu"
                class="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border bg-background hover:bg-accent transition-colors font-arabic min-w-[120px] justify-between"
                title="تغيير التفسير"
              >
                  <ChevronDown :size="14" class="text-muted-foreground opacity-50" />
                  <span>{{ store.availableTafsirs.find(t => t.id === store.selectedTafsirId)?.name }}</span>
                  <Book :size="14" class="text-muted-foreground" />
              </button>

              <!-- Overlay invisible pour fermer au clic dehors -->
              <div v-if="isTafsirMenuOpen" @click="isTafsirMenuOpen = false" class="fixed inset-0 z-40"></div>

              <!-- Menu Liste Simple Stylisée -->
              <div v-if="isTafsirMenuOpen" class="absolute top-full left-0 mt-2 w-56 bg-white border rounded-xl shadow-xl z-50 py-2 font-arabic animate-in fade-in zoom-in-95 duration-100 ring-1 ring-black/5">
                  <button 
                      v-for="(tafsir, index) in store.availableTafsirs" :key="tafsir.id"
                      @click="selectTafsir(tafsir.id)"
                      class="block w-full text-right px-5 py-3 text-base hover:bg-gray-50 transition-colors text-gray-800"
                      :class="[
                        { 'font-bold text-primary bg-primary/5': store.selectedTafsirId === tafsir.id },
                        index !== store.availableTafsirs.length - 1 ? 'border-b border-gray-100' : ''
                      ]"
                  >
                      {{ tafsir.name }}
                  </button>
              </div>
          </div>

          <!-- Toggle Lecture continue -->
          <button
            @click="store.toggleAutoPlay()"
            class="group flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300 border hover:shadow-sm"
            :class="store.autoPlayEnabled 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900' 
              : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900'"
          >
            <div class="relative flex h-2 w-2">
              <span v-if="store.autoPlayEnabled" class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2" :class="store.autoPlayEnabled ? 'bg-emerald-500' : 'bg-rose-500'"></span>
            </div>
            <span class="font-arabic group-hover:scale-105 transition-transform">
              قراءة متواصلة
            </span>
          </button>
        </div>
      </div>

      <div class="flex items-center justify-center gap-2 mb-4">
        <span
          :class="[
            'inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold font-arabic',
            surah.type === 'Meccan'
              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
          ]"
        >
          <MapPin :size="14" />
          {{ surah.type === 'Meccan' ? 'مكية' : 'مدنية' }}
        </span>
        <span class="text-muted-foreground font-arabic text-sm">
          {{ ayahs.length }} آية
        </span>
      </div>

      <div class="text-center">
        <!-- Nom arabe avec tashkeel -->
        <h1 class="font-arabic-bold text-4xl md:text-5xl text-primary" dir="rtl">
          {{ store.surahNamesTashkeel[surah.number] || surah.name_ar }}
        </h1>
      </div>
    </div>

    <!-- Mode Lecture (Mushaf) -->
    <div v-if="store.readingMode" class="bg-card rounded-xl shadow-sm border p-6 md:p-10 relative overflow-hidden">
      <!-- Bismillah (sauf pour Surah 9) -->
      <div v-if="surah.number !== 9" class="text-center mb-10 relative z-10">
        <p class="font-arabic-bold text-3xl md:text-4xl leading-loose" dir="rtl">
          بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </p>
      </div>

      <!-- Pattern de fond décoratif -->
      <div class="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>

      <!-- Texte continu -->
      <div class="font-arabic text-justify text-foreground leading-[2.5] md:leading-[3] relative z-10" :style="{ fontSize: fontSize + 'px' }" dir="rtl">
          <span 
            v-for="ayah in ayahs" 
            :key="ayah.id"
            class="hover:text-primary transition-colors cursor-pointer group inline"
            :class="{ 'text-primary bg-primary/5 rounded px-1 box-decoration-clone': store.currentPlayingAyahId === ayah.id }"
            @click="store.playAyah(ayah)"
            :title="'Au verset ' + ayah.number_in_surah"
          >
            {{ ayah.text }}
            <span class="inline-flex items-center justify-center h-[1em] w-[1em] mx-1 border border-current rounded-full text-[0.4em] font-arabic-bold opacity-70 align-middle select-none group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all">
                {{ ayah.number_in_surah }}
            </span>
          </span>
      </div>
    </div>

    <!-- Mode Liste (Classique) -->
    <div v-else class="space-y-8">
      <!-- Bismillah (sauf pour Surah 9) -->
      <div v-if="surah.number !== 9" class="text-center py-4">
        <p class="font-arabic-bold text-3xl md:text-4xl leading-loose" dir="rtl">
          بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </p>
      </div>

      <div class="space-y-6">
        <div
          v-for="ayah in ayahs"
          :key="ayah.id"
          :data-ayah-id="ayah.id"
          class="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-all duration-300"
          :class="{
            'bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 shadow-lg shadow-amber-500/10': store.currentPlayingAyahId === ayah.id && store.isPlaying,
            'animate-pulse-slow': store.currentPlayingAyahId === ayah.id && store.isPlaying
          }"
        >
          <!-- Header de l'Ayah -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
              {{ ayah.number_in_surah }}
            </div>

            <div class="flex items-center gap-2">
              <button
                @click="store.playAyah(ayah)"
                class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9"
                :class="{ 'text-primary bg-accent': store.currentPlayingAyahId === ayah.id && store.isPlaying }"
                title="تشغيل التلاوة"
              >
                <Pause v-if="store.currentPlayingAyahId === ayah.id && store.isPlaying" :size="18" />
                <Play v-else :size="18" />
              </button>
              <button
                @click="copyAyah(ayah)"
                class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9"
                title="نسخ الآية"
              >
                <Copy :size="16" />
              </button>
              <button
                @click="toggleBookmark(ayah)"
                class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9"
                :title="isBookmarked(ayah) ? 'إزالة من المحفوظات' : 'حفظ الآية'"
              >
                <Bookmark :size="16" :class="{ 'fill-current text-primary': isBookmarked(ayah) }" />
              </button>
              <button
                v-if="surah.id !== 0"
                @click="toggleTafsir(ayah)"
                class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9"
                :class="{ 'text-primary bg-accent': isTafsirActive(ayah) }"
                title="تفسير الآية"
              >
                <BookOpen :size="16" />
              </button>
              <button
                @click="openNoteModal(ayah)"
                class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9 relative"
                :class="{ 'text-amber-600 bg-amber-50 dark:bg-amber-950/20': hasNote(ayah) }"
                :title="hasNote(ayah) ? 'تعديل الملاحظة' : 'إضافة ملاحظة'"
              >
                <StickyNote :size="16" />
                <span v-if="hasNote(ayah)" class="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full"></span>
              </button>
            </div>
          </div>

          <!-- Texte arabe -->
          <div class="mb-4">
            <p
              class="font-arabic text-right leading-loose"
              :style="{ fontSize: fontSize + 'px' }"
              dir="rtl"
            >
              {{ ayah.text }}
            </p>
          </div>

          <!-- Tafsir Panel -->
          <div v-if="isTafsirActive(ayah)" class="mb-4 mt-2 p-4 bg-primary/5 rounded-lg border border-primary/10 animate-in slide-in-from-top-2 fade-in duration-300">
            <div class="flex items-center justify-between mb-3 border-b border-primary/10 pb-2">
               <span class="text-xs font-bold text-primary font-arabic">
                 {{ store.availableTafsirs.find(t => t.id === store.selectedTafsirId)?.name }}
               </span>
            </div>
            <p class="font-arabic text-right leading-loose text-foreground/90 text-sm md:text-base" dir="rtl">
               {{ getAyahTafsirContent(ayah) }}
            </p>
          </div>



          <!-- Note Panel (si existe) -->
          <div v-if="hasNote(ayah)" class="mb-4 mt-2 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900 animate-in slide-in-from-top-2 fade-in duration-300">
            <div class="flex items-center justify-between mb-3 border-b border-amber-200 dark:border-amber-900 pb-2">
              <span class="text-xs font-bold text-amber-700 dark:text-amber-400 font-arabic flex items-center gap-2">
                <StickyNote :size="14" />
                ملاحظتي
              </span>
              <button
                @click="openNoteModal(ayah)"
                class="text-xs text-muted-foreground hover:text-foreground font-arabic"
              >
                تعديل
              </button>
            </div>
            <p class="font-arabic text-right leading-relaxed text-foreground/90 text-sm" dir="rtl">
              {{ store.getNoteForAyah(ayah.surah_id, ayah.number_in_surah)?.text }}
            </p>
            <div v-if="store.getNoteForAyah(ayah.surah_id, ayah.number_in_surah)?.tags?.length" class="flex flex-wrap gap-2 mt-3">
              <span
                v-for="tag in store.getNoteForAyah(ayah.surah_id, ayah.number_in_surah).tags"
                :key="tag"
                class="text-xs px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-arabic"
              >
                {{ tag }}
              </span>
            </div>
          </div>


        </div>
      </div>
    </div>

    <!-- Note Modal -->
    <NoteModal
      v-if="selectedAyahForNote"  
      :show="showNoteModal"
      :ayah="selectedAyahForNote"
      :existingNote="selectedAyahForNote ? store.getNoteForAyah(selectedAyahForNote.surah_id, selectedAyahForNote.number_in_surah) : null"
      @close="showNoteModal = false"
      @save="handleNoteSave"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { ArrowRight, BookOpen, MapPin, Copy, Bookmark, Play, Pause, ListOrdered, Book, Check, ChevronDown, StickyNote } from 'lucide-vue-next'
import { useQuranStore } from '../stores/quran'
import NoteModal from './NoteModal.vue'

const props = defineProps({
  ayahs: {
    type: Array,
    required: true
  },
  surah: {
    type: Object,
    required: true
  },
  fontSize: {
    type: Number,
    default: 32
  }
})

defineEmits(['back'])

const store = useQuranStore()

// Gestion du Tafsir
const activeTafsirs = ref({})
const isTafsirMenuOpen = ref(false)

const toggleTafsirMenu = () => {
  isTafsirMenuOpen.value = !isTafsirMenuOpen.value
}

const selectTafsir = (id) => {
  store.selectedTafsirId = id
  isTafsirMenuOpen.value = false
}

// Watch sur la sourate pour charger le tafsir
watch(() => props.surah, (newSurah) => {
  if (newSurah && newSurah.number && newSurah.id !== 0) {
    store.fetchTafsir(newSurah.number)
    activeTafsirs.value = {}
  }
}, { immediate: true })

watch(() => store.selectedTafsirId, () => {
    if (props.surah && props.surah.number && props.surah.id !== 0) {
        store.fetchTafsir(props.surah.number)
    }
})

const toggleTafsir = (ayah) => {
    activeTafsirs.value[ayah.id] = !activeTafsirs.value[ayah.id]
}

const isTafsirActive = (ayah) => !!activeTafsirs.value[ayah.id]

const getAyahTafsirContent = (ayah) => {
    return store.getAyahTafsir(props.surah.number, ayah.number_in_surah) || 'جاري تحميل التفسير...'
}

const currentLanguageName = computed(() => {
  const lang = store.availableLanguages.find(l => l.code === store.selectedLanguage)
  return lang ? lang.nativeName : 'Translation'
})

const getTranslation = (ayah) => {
  if (store.selectedLanguage === 'ar') return null
  const surahTranslations = store.translations[props.surah.number]
  if (!surahTranslations) return null
  return surahTranslations[ayah.number_in_surah]
}

const copyAyah = (ayah) => {
  const translation = getTranslation(ayah)
  const text = translation 
    ? `${ayah.text}\n\n${translation}\n[${props.surah.name_arabic} - ${ayah.number_in_surah}]`
    : `${ayah.text}\n[${props.surah.name_arabic} - ${ayah.number_in_surah}]`
  navigator.clipboard.writeText(text)
  // Toast notification could be added here
}

const toggleBookmark = (ayah) => {
  store.toggleBookmark(ayah)
}

const isBookmarked = (ayah) => {
  return store.checkBookmarked(ayah.id)
}

// Notes Management
const showNoteModal = ref(false)
const selectedAyahForNote = ref(null)

const hasNote = (ayah) => {
  return !!store.getNoteForAyah(ayah.surah_id, ayah.number_in_surah)
}

const openNoteModal = (ayah) => {
  // Enrichir les données du verset pour le modal
  selectedAyahForNote.value = {
    ...ayah,
    surah_name_ar: props.surah.name_ar || props.surah.name_arabic
  }
  showNoteModal.value = true
}

const handleNoteSave = (note) => {
  store.saveNote(note)
  showNoteModal.value = false
}

// Reading Progress Tracking with Intersection Observer
let observer = null
const visibleAyahs = new Map() // Track visibility time for each ayah

onMounted(() => {
  // Create Intersection Observer
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const ayahId = entry.target.dataset.ayahId
        
        if (entry.isIntersecting) {
          // Ayah is visible - start timer
          if (!visibleAyahs.has(ayahId)) {
            const timer = setTimeout(() => {
              // Mark as read after 2 seconds of visibility
              const ayah = props.ayahs.find(a => a.id === ayahId)
              if (ayah) {
                store.markAyahAsRead(ayah.surah_id, ayah.number_in_surah)
              }
            }, 2000) // 2 seconds
            
            visibleAyahs.set(ayahId, timer)
          }
        } else {
          // Ayah is no longer visible - cancel timer
          const timer = visibleAyahs.get(ayahId)
          if (timer) {
            clearTimeout(timer)
            visibleAyahs.delete(ayahId)
          }
        }
      })
    },
    {
      threshold: 0.5, // 50% of the ayah must be visible
      rootMargin: '0px'
    }
  )
  
  // Observe all ayah elements
  setTimeout(() => {
    const ayahElements = document.querySelectorAll('[data-ayah-id]')
    ayahElements.forEach((el) => observer.observe(el))
  }, 500) // Wait for DOM to be ready
})

onUnmounted(() => {
  // Clean up
  if (observer) {
    observer.disconnect()
  }
  visibleAyahs.forEach((timer) => clearTimeout(timer))
  visibleAyahs.clear()
})

</script>
