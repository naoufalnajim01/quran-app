<template>
  <div class="rounded-2xl border bg-card p-6">
    <div class="flex items-center gap-3 mb-4">
      <Sparkles :size="28" class="text-primary" />
      <h3 class="font-arabic-bold text-2xl">أسماء الله الحسنى</h3>
    </div>

    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <p class="font-arabic text-sm text-muted-foreground mt-2">جاري التحميل...</p>
    </div>

    <div v-else-if="error" class="text-center py-8">
      <p class="font-arabic text-sm text-destructive">{{ error }}</p>
    </div>

    <div v-else-if="names.length" class="space-y-4">
      <!-- Search -->
      <div class="relative">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="ابحث في الأسماء الحسنى..."
          dir="rtl"
          class="w-full px-4 py-2 rounded-lg border border-input bg-background text-right font-arabic"
        />
      </div>

      <!-- Names Grid - Mode paysage 4 colonnes -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[450px] overflow-y-auto custom-scrollbar pr-2">
        <div 
          v-for="name in filteredNames" 
          :key="name.number"
          class="p-3 rounded-xl border bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/20 transition-all cursor-pointer group"
        >
          <div class="flex items-start justify-between mb-2">
            <div class="flex-1">
              <h4 class="font-arabic-bold text-xl text-primary mb-1">{{ name.arabic }}</h4>
              <p class="text-xs text-muted-foreground">{{ name.transliteration }}</p>
            </div>
            <span class="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{{ name.number }}</span>
          </div>
        </div>
      </div>

      <!-- Counter -->
      <div class="text-center p-3 rounded-lg bg-muted/50">
        <p class="text-sm font-arabic">
          <span class="font-bold text-primary">{{ filteredNames.length }}</span> من أصل <span class="font-bold">99</span> اسماً
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Sparkles } from 'lucide-vue-next'

const names = ref([])
const loading = ref(true)
const error = ref(null)
const searchQuery = ref('')

const filteredNames = computed(() => {
  if (!searchQuery.value) return names.value
  
  const query = searchQuery.value.toLowerCase()
  return names.value.filter(name => 
    name.arabic.includes(searchQuery.value) ||
    name.transliteration.toLowerCase().includes(query)
  )
})

const loadNames = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await fetch('https://api.aladhan.com/v1/asmaAlHusna')
    
    const data = await response.json()
    
    if (data.code === 200 && data.status === 'OK') {
      // Adapter le format de l'API Aladhan - UNIQUEMENT EN ARABE
      names.value = data.data.map(item => ({
        number: item.number,
        arabic: item.name,
        transliteration: item.transliteration
      }))
    }
  } catch (err) {
    error.value = 'حدث خطأ في تحميل أسماء الله الحسنى'
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadNames()
})
</script>

<style scoped>
/* Scrollbar verte personnalisée */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(16, 185, 129, 0.1);
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #10b981, #059669);
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #059669, #047857);
}
</style>
