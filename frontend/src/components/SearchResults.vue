<template>
  <div class="space-y-4 pb-32">
    <h2 class="font-arabic-bold text-2xl mb-6 text-primary flex items-center gap-2">
      <Search :size="24" />
      نتائج البحث ({{ store.searchResults.length }})
    </h2>

    <div v-if="store.isSearching" class="text-center py-10">
      <Loader2 :size="40" class="animate-spin mx-auto text-primary" />
      <p class="mt-4 font-arabic text-muted-foreground">جاري البحث...</p>
    </div>

    <div v-else-if="store.searchResults.length === 0" class="text-center py-10 bg-card rounded-xl border border-dashed">
      <SearchX :size="48" class="mx-auto text-muted-foreground/50 mb-4" />
      <p class="font-arabic text-lg text-muted-foreground">لم يتم العثور على نتائج لـ "{{ store.searchQuery }}"</p>
    </div>

    <div 
      v-for="item in store.searchResults" 
      :key="`${item.surah_id}:${item.number_in_surah}`"
      class="group relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50"
    >
      <!-- Header -->
      <div class="flex items-center justify-between mb-4 border-b pb-3 border-border/50">
        <div class="flex items-center gap-3">
          <span class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-arabic-bold">
            {{ item.surah_id }}
          </span>
          <div class="text-right">
            <h3 class="font-arabic-bold text-lg leading-none cursor-pointer hover:text-primary transition-colors" @click="goToSurah(item)">
              سورة {{ item.surah.name_arabic }}
            </h3>
            <span class="text-xs text-muted-foreground font-arabic">آية {{ item.number_in_surah }}</span>
          </div>
        </div>
        
        <button 
          @click="playAyah(item)"
          class="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
          title="استمع"
        >
          <Play :size="18" :class="{ 'ml-0.5': true }" />
        </button>
      </div>

      <!-- نص الآية -->
      <p class="font-arabic text-2xl leading-[2.5] text-center text-foreground w-full mb-4 px-4 py-2" dir="rtl">
        <span 
          v-html="highlightText(item.text)"
        ></span>
      </p>

      <!-- Actions Footer -->
      <div class="flex items-center justify-end pt-3 gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
            @click="goToSurah(item)" 
            class="text-xs flex items-center gap-1 text-primary hover:underline font-arabic"
        >
          الذهاب للسورة <ArrowLeft :size="12" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useQuranStore } from '../stores/quran'
import { Search, Play, Pause, SearchX, Loader2, ArrowLeft } from 'lucide-vue-next'

const store = useQuranStore()
const emit = defineEmits(['select-surah'])

const removeTashkeel = (text) => {
    return text.replace(/[\u064B-\u065F\u0670]/g, "")
}

const highlightText = (text) => {
    if (!store.searchQuery) return text
    // Simple highlight logic - complex exact match with tashkeel is hard purely in standard Regex without advanced normalization
    // Ici on affiche le texte complet. Le highlight serait un bonus.
    return text
}

const playAyah = (item) => {
  store.playAyah({
    id: item.number_in_surah, // Attention: playAyah attend l'ID relatif ou absolu ?
    // store.playAyah utilise audioUrl logic qui a besoin de surahPad et ayahPad
    // Mais playAyah met aussi à jour currentAyah et currentSurah.
    // Il vaut mieux charger la sourate et jouer.
    ...item
  })
}

const goToSurah = (item) => {
  // On doit charger la sourate complete
  // On emet un event ou on manipule le store directement
  const surah = store.surahs.find(s => s.id === item.surah_id)
  if (surah) {
    store.currentSurah = surah
    emit('select-surah', surah)
    // Optionnel: scroller vers le verset
  }
}
</script>

<style scoped>
.font-arabic {
    font-family: 'Amiri', serif;
}
</style>
