<template>
  <div v-if="store.bookmarks.length > 0" class="mb-10 animate-in fade-in duration-500">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-2xl font-bold flex items-center gap-3 font-arabic">
        <Bookmark :size="24" class="text-primary fill-current" />
        المفضلة ({{  store.bookmarks.length }})
      </h3>
      
      <!-- Filtres par catégorie -->
      <div class="flex items-center gap-2">
        <button
          v-for="cat in bookmarkCategories"
          :key="cat.value"
          @click="selectedCategory = cat.value"
          class="px-3 py-1.5 rounded-full text-sm font-arabic transition-all"
          :class="selectedCategory === cat.value 
            ? `bg-${cat.color}-100 text-${cat.color}-800 dark:bg-${cat.color}-900/30 dark:text-${cat.color}-400 border-2 border-${cat.color}-500` 
            : 'bg-muted text-muted-foreground hover:bg-accent border border-border'"
        >
          {{ cat.label }}
        </button>
      </div>
    </div>

    <!-- Liste des favoris -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="bookmark in filteredBookmarks"
        :key="bookmark.id"
        class="group rounded-xl border-2 bg-card p-5 shadow-sm hover:shadow-lg transition-all cursor-pointer relative overflow-hidden"
        :class="`border-${getCategoryColor(bookmark.category)}-200 dark:border-${getCategoryColor(bookmark.category)}-900 hover:border-${getCategoryColor(bookmark.category)}-400`"
        @click="$emit('select', bookmark)"
      >
        <!-- Bande colorée -->
        <div 
          class="absolute top-0 left-0 right-0 h-1.5"
          :class="`bg-gradient-to-r from-${getCategoryColor(bookmark.category)}-400 to-${getCategoryColor(bookmark.category)}-600`"
        ></div>

        <!-- Header -->
        <div class="flex justify-between items-start mb-3">
          <div class="text-xs text-muted-foreground font-medium font-arabic flex items-center gap-2" dir="rtl">
            <component 
              :is="getCategoryIcon(bookmark.category)" 
              :size="14" 
              :class="`text-${getCategoryColor(bookmark.category)}-500`" 
            />
            <span>{{ bookmark.surah_name_ar || bookmark.surah_name_en }}</span>
            <span>•</span>
            <span>الآية {{ bookmark.number_in_surah }}</span>
          </div>
          
          <div class="flex items-center gap-1">
            <!-- Catégorie badge -->
            <span 
              class="px-2 py-0.5 rounded-full text-[10px] font-bold"
              :class="`bg-${getCategoryColor(bookmark.category)}-100 text-${getCategoryColor(bookmark.category)}-700 dark:bg-${getCategoryColor(bookmark.category)}-900/30 dark:text-${getCategoryColor(bookmark.category)}-400`"
            >
              {{ getCategoryLabel(bookmark.category) }}
            </span>
            
            <!-- Actions -->
            <button
              @click.stop="$emit('remove', bookmark)"
              class="opacity-0 group-hover:opacity-100 p-1.5 rounded-full hover:bg-destructive/20 hover:text-destructive transition-all"
              title="حذف"
            >
              <X :size="14" />
            </button>
          </div>
        </div>

        <!-- Texte du verset -->
        <p class="font-arabic text-right text-base leading-relaxed line-clamp-3 mb-3" dir="rtl">
          {{ bookmark.text }}
        </p>

        <!-- Footer -->
        <div class="flex items-center justify-between text-xs text-muted-foreground">
          <div class="flex items-center gap-2">
            <Clock :size="12" />
            <span class="font-arabic">{{ formatDate(bookmark.timestamp) }}</span>
          </div>
          
          <!-- Note indicator -->
          <div v-if="hasNote(bookmark)" class="flex items-center gap-1 text-amber-600">
            <StickyNote :size="12" />
            <span class="font-arabic text-[10px]">ملاحظة</span>
          </div>
        </div>
      </div>
    </div>

    <!-- État vide filtré -->
    <div v-if="filteredBookmarks.length === 0" class="text-center py-12">
      <div class="inline-flex flex-col items-center gap-3">
        <div class="p-4 rounded-full bg-muted">
          <Bookmark :size="32" class="text-muted-foreground" />
        </div>
        <p class="font-arabic text-muted-foreground">لا توجد مفضلات في هذه الفئة</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Bookmark, X, Clock, StickyNote, Star, Lightbulb, Heart, AlertCircle } from 'lucide-vue-next'
import { useQuranStore } from '../stores/quran'

const emit = defineEmits(['select', 'remove'])

const store = useQuranStore()
const selectedCategory = ref('all')

const bookmarkCategories = [
  { value: 'all', label: 'الكل', color: 'gray' },
  { value: 'favorite', label: 'مفضل', color: 'rose' },
  { value: 'memorization', label: 'حفظ', color: 'emerald' },
  { value: 'reflection', label: 'تأمل', color: 'amber' },
  { value: 'important', label: 'مهم', color: 'blue' }
]

const filteredBookmarks = computed(() => {
  if (selectedCategory.value === 'all') {
    return store.bookmarks
  }
  return store.bookmarks.filter(b => b.category === selectedCategory.value)
})

const getCategoryColor = (category) => {
  const cat = bookmarkCategories.find(c => c.value === category)
  return cat?.color || 'gray'
}

const getCategoryLabel = (category) => {
  const cat = bookmarkCategories.find(c => c.value === category)
  return cat?.label || '---'
}

const getCategoryIcon = (category) => {
  const icons = {
    favorite: Heart,
    memorization: Star,
    reflection: Lightbulb,
    important: AlertCircle
  }
  return icons[category] || Bookmark
}

const hasNote = (bookmark) => {
  return !!store.getNoteForAyah(bookmark.surah_id, bookmark.number_in_surah)
}

const formatDate = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return 'اليوم'
  if (days === 1) return 'أمس'
  if (days < 7) return `منذ ${days} أيام`
  if (days < 30) return `منذ ${Math.floor(days / 7)} أسابيع`
  return date.toLocaleDateString('ar-EG')
}
</script>
