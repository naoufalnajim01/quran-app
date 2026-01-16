<template>
  <div class="mb-8">
    <!-- Titre -->
    <div class="mb-6" dir="rtl">
      <h2 class="text-xl md:text-2xl font-bold text-foreground" style="font-family: 'Amiri', 'Scheherazade New', 'Traditional Arabic', serif;">
        لوحة المتابعة
      </h2>
      <p class="text-xs text-muted-foreground font-arabic mt-1">تابع تقدمك في قراءة القرآن الكريم</p>
    </div>

    <!-- Statistiques en une ligne -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3" dir="rtl">
      <!-- الآيات المقروءة -->
      <div class="rounded-xl border bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/20 dark:to-emerald-900/20 p-4">
        <div class="flex items-center justify-between mb-1">
          <span class="text-xs font-arabic text-emerald-700 dark:text-emerald-400">الآيات المقروءة</span>
          <BookOpen :size="16" class="text-emerald-600" />
        </div>
        <p class="text-2xl font-bold text-emerald-900 dark:text-emerald-100">{{ stats.ayatsRead }}</p>
        <p class="text-[10px] text-emerald-600 dark:text-emerald-400 font-arabic">من أصل {{ stats.totalAyats }} آية</p>
        <div class="mt-2 h-1.5 bg-emerald-200 dark:bg-emerald-900 rounded-full overflow-hidden">
          <div class="h-full bg-emerald-600 dark:bg-emerald-400" :style="{ width: ayatsProgress + '%' }"></div>
        </div>
      </div>

      <!-- السور المكتملة -->
      <div class="rounded-xl border bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/20 dark:to-amber-900/20 p-4">
        <div class="flex items-center justify-between mb-1">
          <span class="text-xs font-arabic text-amber-700 dark:text-amber-400">السور المكتملة</span>
          <CheckCircle :size="16" class="text-amber-600" />
        </div>
        <p class="text-2xl font-bold text-amber-900 dark:text-amber-100">{{ stats.surahsCompleted }}</p>
        <p class="text-[10px] text-amber-600 dark:text-amber-400 font-arabic">من أصل 114 سورة</p>
        <div class="mt-2 h-1.5 bg-amber-200 dark:bg-amber-900 rounded-full overflow-hidden">
          <div class="h-full bg-amber-600 dark:bg-amber-400" :style="{ width: surahsProgress + '%' }"></div>
        </div>
      </div>

      <!-- الملاحظات -->
      <div class="rounded-xl border bg-card p-4">
        <div class="flex items-center justify-between mb-1">
          <span class="text-xs font-arabic text-muted-foreground">الملاحظات</span>
          <StickyNote :size="16" class="text-amber-600" />
        </div>
        <p class="text-2xl font-bold text-foreground">{{ store.notes.length }}</p>
        <p class="text-[10px] text-muted-foreground font-arabic">ملاحظة شخصية</p>
      </div>

      <!-- المفضلة -->
      <div class="rounded-xl border bg-card p-4">
        <div class="flex items-center justify-between mb-1">
          <span class="text-xs font-arabic text-muted-foreground">المفضلة</span>
          <Bookmark :size="16" class="text-primary" />
        </div>
        <p class="text-2xl font-bold text-foreground">{{ store.bookmarks.length }}</p>
        <p class="text-[10px] text-muted-foreground font-arabic">آية محفوظة</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { BookOpen, CheckCircle, StickyNote, Bookmark } from 'lucide-vue-next'
import { useQuranStore } from '../stores/quran'

const store = useQuranStore()

const stats = computed(() => {
  const readHistory = JSON.parse(localStorage.getItem('quran_read_history') || '{}')
  
  return {
    ayatsRead: Object.keys(readHistory).length,
    totalAyats: 6236,
    surahsCompleted: calculateCompletedSurahs(readHistory)
  }
})

const ayatsProgress = computed(() => {
  return ((stats.value.ayatsRead / stats.value.totalAyats) * 100).toFixed(1)
})

const surahsProgress = computed(() => {
  return ((stats.value.surahsCompleted / 114) * 100).toFixed(1)
})

const calculateCompletedSurahs = (readHistory) => {
  const surahsCount = {}
  Object.keys(readHistory).forEach(ayahId => {
    const [surahId] = ayahId.split(':')
    surahsCount[surahId] = (surahsCount[surahId] || 0) + 1
  })
  
  let completed = 0
  const surahVersesCounts = store.surahs.reduce((acc, s) => {
    acc[s.number] = s.total_verses || s.verses_count
    return acc
  }, {})
  
  Object.keys(surahsCount).forEach(surahId => {
    if (surahsCount[surahId] === surahVersesCounts[surahId]) {
      completed++
    }
  })
  
  return completed
}
</script>
