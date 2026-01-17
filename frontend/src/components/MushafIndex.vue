<template>
  <div class="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" @click.self="$emit('close')">
    <div class="bg-background rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col border border-border">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-border bg-gradient-to-l from-primary/5 to-transparent">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-primary/10 rounded-lg">
            <img src="/logo.png" alt="المصحف" class="w-6 h-6 rounded-md" />
          </div>
          <div>
            <h2 class="font-arabic-bold text-2xl text-foreground">فهرس المصحف الشريف</h2>
            <p class="font-arabic text-sm text-muted-foreground mt-0.5">اختر السورة للانتقال إليها مباشرة</p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="p-2 rounded-lg hover:bg-accent transition-colors"
          title="إغلاق"
        >
          <X :size="20" />
        </button>
      </div>

      <!-- Search Bar -->
      <div class="p-4 border-b border-border bg-muted/20">
        <div class="relative">
          <Search :size="18" class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="ابحث عن سورة..."
            class="w-full pr-10 pl-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 font-arabic text-sm"
          />
        </div>
        
        <!-- Filters -->
        <div class="flex gap-2 mt-3">
          <button
            @click="filterType = 'all'"
            :class="[
              'px-4 py-1.5 rounded-lg text-sm font-arabic transition-all',
              filterType === 'all' 
                ? 'bg-primary text-white shadow-md' 
                : 'bg-muted/50 hover:bg-muted text-muted-foreground'
            ]"
          >
            الكل (114)
          </button>
          <button
            @click="filterType = 'Meccan'"
            :class="[
              'px-4 py-1.5 rounded-lg text-sm font-arabic transition-all',
              filterType === 'Meccan' 
                ? 'bg-amber-500 text-white shadow-md' 
                : 'bg-muted/50 hover:bg-muted text-muted-foreground'
            ]"
          >
            مكية ({{ meccanCount }})
          </button>
          <button
            @click="filterType = 'Medinan'"
            :class="[
              'px-4 py-1.5 rounded-lg text-sm font-arabic transition-all',
              filterType === 'Medinan' 
                ? 'bg-emerald-500 text-white shadow-md' 
                : 'bg-muted/50 hover:bg-muted text-muted-foreground'
            ]"
          >
            مدنية ({{ medinanCount }})
          </button>
        </div>
      </div>

      <!-- Surah List -->
      <div class="flex-1 overflow-y-auto p-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            v-for="surah in filteredSurahs"
            :key="surah.number"
            @click="selectSurah(surah)"
            class="group relative p-4 rounded-xl border border-border hover:border-primary/50 bg-card hover:bg-accent/50 transition-all duration-200 text-right hover:shadow-lg hover:scale-[1.02]"
          >
            <!-- Surah Number Badge -->
            <div class="absolute left-4 top-4 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <span class="font-arabic-bold text-primary text-sm">{{ surah.number }}</span>
            </div>

            <!-- Content -->
            <div class="pr-0">
              <!-- Arabic Name with Tashkeel -->
              <h3 class="font-arabic-bold text-xl text-foreground mb-1 group-hover:text-primary transition-colors">
                {{ getSurahNameWithTashkeel(surah.number) || surah.name_ar }}
              </h3>
              
              <!-- English Name -->
              <p class="text-sm text-muted-foreground mb-2">{{ surah.name_en }}</p>
              
              <!-- Info Row -->
              <div class="flex items-center gap-3 flex-wrap">
                <!-- Type Badge -->
                <span 
                  :class="[
                    'px-2.5 py-1 rounded-md text-xs font-arabic-bold',
                    surah.type === 'Meccan' 
                      ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20' 
                      : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                  ]"
                >
                  {{ surah.type === 'Meccan' ? 'مكية' : 'مدنية' }}
                </span>
                
                <!-- Verses Count -->
                <span class="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <FileText :size="14" />
                  <span class="font-arabic">{{ surah.verses_count }} آية</span>
                </span>

                <!-- Page Number -->
                <span class="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <BookMarked :size="14" />
                  <span class="font-arabic">صفحة {{ getStartPage(surah.number) }}</span>
                </span>
              </div>
            </div>

            <!-- Hover Arrow -->
            <div class="absolute left-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronLeft :size="16" class="text-primary" />
            </div>
          </button>
        </div>

        <!-- No Results -->
        <div v-if="filteredSurahs.length === 0" class="text-center py-12">
          <div class="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search :size="24" class="text-muted-foreground" />
          </div>
          <p class="font-arabic text-muted-foreground">لا توجد نتائج</p>
        </div>
      </div>

      <!-- Footer Stats -->
      <div class="border-t border-border p-4 bg-muted/10">
        <div class="flex items-center justify-center gap-6 text-sm font-arabic text-muted-foreground">
          <span>عدد السور: {{ filteredSurahs.length }}</span>
          <span class="w-1 h-1 rounded-full bg-muted-foreground/30"></span>
          <span>عدد الصفحات: 604</span>
          <span class="w-1 h-1 rounded-full bg-muted-foreground/30"></span>
          <span>عدد الآيات: 6236</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { X, Search, BookOpen, FileText, BookMarked, ChevronLeft } from 'lucide-vue-next'
import { useQuranStore } from '../stores/quran'
import axios from 'axios'

const emit = defineEmits(['close', 'select-surah'])

const quranStore = useQuranStore()
const searchQuery = ref('')
const filterType = ref('all') // 'all', 'Meccan', 'Medinan'
const surahNamesTashkeel = ref({})

// Mapping des sourates aux pages (approximatif basé sur les données du Mushaf standard)
const surahToPage = {
  1: 1, 2: 2, 3: 50, 4: 77, 5: 106, 6: 128, 7: 151, 8: 177, 9: 187, 10: 208,
  11: 221, 12: 235, 13: 249, 14: 255, 15: 262, 16: 267, 17: 282, 18: 293, 19: 305, 20: 312,
  21: 322, 22: 332, 23: 342, 24: 350, 25: 359, 26: 367, 27: 377, 28: 385, 29: 396, 30: 404,
  31: 411, 32: 415, 33: 418, 34: 428, 35: 434, 36: 440, 37: 446, 38: 453, 39: 458, 40: 467,
  41: 477, 42: 483, 43: 489, 44: 496, 45: 499, 46: 502, 47: 507, 48: 511, 49: 515, 50: 518,
  51: 520, 52: 523, 53: 526, 54: 528, 55: 531, 56: 534, 57: 537, 58: 542, 59: 545, 60: 549,
  61: 551, 62: 553, 63: 554, 64: 556, 65: 558, 66: 560, 67: 562, 68: 564, 69: 566, 70: 568,
  71: 570, 72: 572, 73: 574, 74: 575, 75: 577, 76: 578, 77: 580, 78: 582, 79: 583, 80: 585,
  81: 586, 82: 587, 83: 587, 84: 589, 85: 590, 86: 591, 87: 591, 88: 592, 89: 593, 90: 595,
  91: 595, 92: 595, 93: 596, 94: 596, 95: 597, 96: 597, 97: 598, 98: 598, 99: 599, 100: 599,
  101: 600, 102: 600, 103: 601, 104: 601, 105: 601, 106: 602, 107: 602, 108: 602, 109: 603, 110: 603,
  111: 603, 112: 604, 113: 604, 114: 604
}

const getStartPage = (surahNumber) => {
  return surahToPage[surahNumber] || 1
}

// Filtered surahs
const filteredSurahs = computed(() => {
  let surahs = quranStore.surahs

  // Filter by type
  if (filterType.value !== 'all') {
    surahs = surahs.filter(s => s.type === filterType.value)
  }

  // Filter by search
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    surahs = surahs.filter(s => 
      s.name_ar?.includes(searchQuery.value) ||
      s.name_en?.toLowerCase().includes(query) ||
      s.number?.toString() === query
    )
  }

  return surahs
})

// Counts
const meccanCount = computed(() => quranStore.surahs.filter(s => s.type === 'Meccan').length)
const medinanCount = computed(() => quranStore.surahs.filter(s => s.type === 'Medinan').length)

const selectSurah = (surah) => {
  const page = getStartPage(surah.number)
  emit('select-surah', { surah, page })
  emit('close')
}

const getSurahNameWithTashkeel = (surahNumber) => {
  return surahNamesTashkeel.value[surahNumber] || null
}

onMounted(async () => {
  if (quranStore.surahs.length === 0) {
    await quranStore.fetchSurahs()
  }
  
  // Charger les noms avec tashkeel
  try {
    const response = await axios.get('/surah-names-tashkeel.json')
    surahNamesTashkeel.value = response.data
  } catch (error) {
    console.error('Failed to load surah names with tashkeel:', error)
  }
})
</script>

<style scoped>
/* Smooth scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground) / 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground) / 0.5);
}
</style>
