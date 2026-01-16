<template>
  <!-- Modal Liste des Sourates -->
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" @click.self="$emit('update:show', false)">
      <div class="relative w-full max-w-6xl h-[85vh] bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl border-2 border-primary/20 overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-primary to-primary/80 p-6 border-b border-border/50">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <img src="/logo.png" alt="القرآن" class="h-10 w-10" />
              <h2 class="font-arabic-bold text-3xl text-white">القرآن الكريم</h2>
            </div>
            <button @click="$emit('update:show', false)" class="p-2 rounded-full hover:bg-white/20 text-white transition-colors">
              <X :size="24" />
            </button>
          </div>
        </div>

        <!-- Search Bar -->
        <div class="px-6 py-4 border-b border-border/50">
          <div class="relative">
            <Search class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" :size="20" />
            <input
              v-model="store.searchQuery"
              type="text"
              placeholder="ابحث عن سورة..."
              class="w-full pr-11 pl-4 py-3 rounded-xl border-2 border-input bg-background text-right font-arabic focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              dir="rtl"
            />
          </div>
        </div>

        <!-- Filters -->
        <div class="px-6 py-4 border-b border-border/50 bg-muted/20">
          <div class="flex items-center gap-2 flex-wrap">
            <button 
              v-for="filter in filters" 
              :key="filter.value"
              @click="store.revelationFilter = filter.value"
              class="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all border font-arabic"
              :class="store.revelationFilter === filter.value 
                ? 'bg-primary text-primary-foreground border-primary shadow-md scale-105' 
                : 'bg-background text-muted-foreground border-input hover:bg-accent hover:scale-105'"
            >
              {{ filter.label }}
              <span class="opacity-60 text-xs">{{ filter.count }}</span>
            </button>
          </div>
        </div>

        <!-- Body: Grid Sourates -->
        <div class="p-6 h-[calc(85vh-100px)] overflow-y-auto">
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <button
              v-for="surah in store.filteredSurahs"
              :key="surah.id"
              @click="selectSurah(surah)"
              class="group text-right p-4 rounded-xl border-2 transition-all hover:scale-105 hover:shadow-lg"
              :class="selectedSurah?.id === surah.id 
                ? 'border-primary bg-primary/10' 
                : 'border-border bg-card hover:border-primary/50'"
            >
              <div class="flex items-start justify-between mb-2">
                <span class="text-sm font-bold text-primary">{{ surah.number }}</span>
                <span 
                  class="text-[10px] px-2 py-0.5 rounded-full font-arabic"
                  :class="surah.type === 'Meccan' 
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'"
                >
                  {{ surah.type === 'Meccan' ? 'مكية' : 'مدنية' }}
                </span>
              </div>
              <h3 class="font-arabic-bold text-lg mb-1">
                {{ store.surahNamesTashkeel[surah.number] || surah.name_ar }}
              </h3>
              <p class="text-xs text-muted-foreground font-arabic">
                {{ surah.total_verses || surah.verses_count || 0 }} آية
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed, watch } from 'vue'
import { X, Search } from 'lucide-vue-next'
import { useQuranStore } from '../stores/quran'

const props = defineProps({
  show: Boolean,
  selectedSurah: Object
})

const emit = defineEmits(['update:show', 'select'])

const store = useQuranStore()

const filters = computed(() => [
  { value: 'all', label: 'الكل', count: store.surahs.length },
  { value: 'Meccan', label: 'مكيّة', count: store.surahs.filter(s => s.type === 'Meccan').length },
  { value: 'Medinan', label: 'مدنيّة', count: store.surahs.filter(s => s.type === 'Medinan').length }
])

const selectSurah = (surah) => {
  emit('select', surah)
  emit('update:show', false)
  // Réinitialiser la recherche après sélection
  store.searchQuery = ''
  store.revelationFilter = 'all'
}

// Réinitialiser la recherche quand le modal se ferme
watch(() => props.show, (newVal) => {
  if (!newVal) {
    store.searchQuery = ''
    store.revelationFilter = 'all'
  }
})

</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
