<template>
  <div class="animate-in fade-in slide-in-from-bottom-4 duration-500">
    <!-- Vue : Liste des Catégories -->
    <div v-if="!selectedCategory" class="max-w-4xl mx-auto p-4">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-2xl font-bold font-arabic text-foreground">{{ title }}</h2>
        <button 
          @click="$emit('close')" 
          class="group inline-flex items-center gap-2 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground px-4 py-2 text-sm font-medium transition-all duration-200 hover:shadow-soft border border-primary/20 hover:border-primary"
        >
          <ArrowRight :size="16" class="rotate-180 group-hover:-translate-x-1 transition-transform" />
          <span class="font-arabic">العودة للرئيسية</span>
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          v-for="item in items"
          :key="item.id"
          @click="selectCategory(item)"
          class="flex items-center gap-4 p-5 rounded-2xl border-2 border-border/50 bg-card hover:bg-primary/5 hover:border-primary/40 transition-all duration-300 group text-right shadow-soft hover:shadow-soft-lg hover:-translate-y-0.5"
        >
          <div class="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
            <component :is="getIcon(item.icon)" :size="22" />
          </div>
          <div class="flex-1">
            <h3 class="font-bold font-arabic text-lg leading-none mb-1.5 group-hover:text-primary transition-colors">{{ item.title }}</h3>
            <span class="text-xs text-muted-foreground font-medium">{{ item.verses.length }} آيات</span>
          </div>
          <ArrowLeft :size="16" class="text-muted-foreground group-hover:text-primary group-hover:-translate-x-1 transition-all" />
        </button>
      </div>
    </div>

    <!-- Vue : Versets de la catégorie -->
    <div v-else>
      <div class="mb-4 flex items-center gap-4">
        <button 
            @click="selectedCategory = null"
            class="group inline-flex items-center gap-2 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground px-4 py-2 font-medium transition-all duration-200 hover:shadow-soft border border-primary/20 hover:border-primary"
        >
            <ArrowRight :size="16" class="rotate-180 group-hover:-translate-x-1 transition-transform" />
            <span class="font-arabic text-sm">رجوع</span>
        </button>
        <h2 class="text-xl font-bold font-arabic text-foreground">{{ selectedCategory.title }}</h2>
      </div>

      <div v-if="loadingVerses" class="flex justify-center py-20">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>

      <AyahList 
        v-else
        :ayahs="verses"
        :surah="{ 
            id: 0, 
            name_arabic: selectedCategory.title, 
            name_en: 'Collection', 
            verses_count: verses.length 
        }"
        @back="selectedCategory = null"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ArrowRight, ArrowLeft, Heart, Shield, Frown, Flame, CloudRain, HeartCrack, User, Sparkles, Briefcase, Clock, Coins, ShieldCheck, Users, Feather, Handshake, MessageCircle, EyeOff, Scale, BookOpen } from 'lucide-vue-next'
import { useQuranStore } from '../stores/quran'
import AyahList from './AyahList.vue'

const props = defineProps({
  type: {
    type: String,
    required: true // 'duas', 'solutions', 'adab'
  }
})

defineEmits(['close'])

const store = useQuranStore()
const items = ref([])
const selectedCategory = ref(null)
const verses = ref([])
const loadingVerses = ref(false)

const title = computed(() => {
    switch(props.type) {
        case 'duas': return 'أدعية مختارة'
        case 'solutions': return 'علاج من القرآن'
        case 'adab': return 'آداب وأخلاق'
        default: return 'كنوز القرآن'
    }
})

const icons = {
    Heart, Shield, Frown, Flame, CloudRain, HeartCrack, User, Sparkles, Briefcase, Clock, 
    Coins, ShieldCheck, Users, Feather, Handshake, MessageCircle, EyeOff, Scale, BookOpen
}

const getIcon = (name) => {
    return icons[name] || BookOpen
}

onMounted(async () => {
    items.value = await store.loadCollection(props.type)
})

const selectCategory = async (item) => {
    selectedCategory.value = item
    loadingVerses.value = true
    try {
        verses.value = await store.fetchVersesByIds(item.verses)
    } finally {
        loadingVerses.value = false
    }
}
</script>
