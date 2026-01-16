<template>
  <div class="flex h-screen overflow-hidden bg-background">
    <!-- Sidebar gauche - Navigation -->
    <aside 
      class="w-80 border-r border-border/50 bg-card/30 backdrop-blur-sm flex flex-col transition-all duration-300"
      :class="{ '-translate-x-full lg:translate-x-0': !sidebarOpen }"
    >
      <!-- Header Sidebar -->
      <div class="p-6 border-b border-border/50">
        <div class="flex items-center justify-between mb-4">
          <h1 class="font-arabic text-2xl font-bold text-primary">القرآن الكريم</h1>
          <button 
            @click="$emit('toggle-sidebar')"
            class="lg:hidden p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <X :size="20" />
          </button>
        </div>
        
        <!-- Barre de recherche compacte -->
        <div class="relative">
          <Search class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" :size="16" />
          <input
            v-model="store.searchQuery"
            type="text"
            placeholder="ابحث في القرآن..."
            class="w-full pr-10 pl-4 py-2.5 rounded-xl border border-border/50 bg-background/50 text-sm font-arabic focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            dir="rtl"
          />
        </div>
      </div>

      <!-- Filtres -->
      <div class="px-6 py-4 border-b border-border/50 bg-muted/20">
        <div class="flex gap-2">
          <button
            v-for="filter in ['all', 'Meccan', 'Medinan']"
            :key="filter"
            @click="store.revelationFilter = filter"
            class="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium font-arabic transition-all"
            :class="store.revelationFilter === filter 
              ? 'bg-primary text-primary-foreground shadow-sm' 
              : 'bg-background/50 text-muted-foreground hover:bg-accent'"
          >
            {{ filter === 'all' ? 'الكل' : filter === 'Meccan' ? 'مكية' : 'مدنية' }}
          </button>
        </div>
      </div>

      <!-- Liste des sourates - Scrollable -->
      <div class="flex-1 overflow-y-auto custom-scrollbar">
        <div class="p-4 space-y-2">
          <button
            v-for="surah in store.filteredSurahs"
            :key="surah.id"
            @click="$emit('select-surah', surah)"
            class="w-full group relative overflow-hidden rounded-xl border border-border/30 bg-card hover:bg-accent/50 hover:border-primary/30 transition-all duration-200 hover:shadow-soft"
          >
            <div class="p-4 flex items-center gap-4">
              <!-- Numéro avec style organique -->
              <div class="relative flex-shrink-0">
                <div class="w-12 h-12 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                  <span class="text-primary font-bold text-sm">{{ surah.number }}</span>
                </div>
              </div>
              
              <!-- Info sourate -->
              <div class="flex-1 text-right">
                <h3 class="font-arabic font-bold text-base mb-0.5 group-hover:text-primary transition-colors">
                  {{ surah.name_arabic }}
                </h3>
                <p class="text-xs text-muted-foreground">
                  {{ surah.name_simple }} • {{ surah.verses_count }} آيات
                </p>
              </div>
              
              <!-- Badge type -->
              <div 
                class="px-2 py-1 rounded-md text-[10px] font-medium"
                :class="surah.type === 'Meccan' 
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' 
                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'"
              >
                {{ surah.type === 'Meccan' ? 'مكية' : 'مدنية' }}
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Footer Sidebar - Collections -->
      <div class="p-4 border-t border-border/50 bg-muted/20">
        <p class="text-xs text-muted-foreground mb-3 font-arabic text-center">كنوز القرآن</p>
        <div class="grid grid-cols-3 gap-2">
          <button
            @click="$emit('open-collection', 'duas')"
            class="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors group"
          >
            <Sparkles :size="16" class="mx-auto mb-1 text-emerald-600 dark:text-emerald-400" />
            <span class="text-[10px] font-arabic text-emerald-700 dark:text-emerald-300">أدعية</span>
          </button>
          <button
            @click="$emit('open-collection', 'solutions')"
            class="p-3 rounded-lg bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors group"
          >
            <Heart :size="16" class="mx-auto mb-1 text-rose-600 dark:text-rose-400" />
            <span class="text-[10px] font-arabic text-rose-700 dark:text-rose-300">علاج</span>
          </button>
          <button
            @click="$emit('open-collection', 'adab')"
            class="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
          >
            <Scale :size="16" class="mx-auto mb-1 text-blue-600 dark:text-blue-400" />
            <span class="text-[10px] font-arabic text-blue-700 dark:text-blue-300">آداب</span>
          </button>
        </div>
      </div>
    </aside>

    <!-- Zone de contenu principale -->
    <main class="flex-1 flex flex-col overflow-hidden">
      <!-- Header mobile -->
      <div class="lg:hidden p-4 border-b border-border/50 bg-card/50 backdrop-blur-sm flex items-center justify-between">
        <button 
          @click="$emit('toggle-sidebar')"
          class="p-2 rounded-lg hover:bg-accent transition-colors"
        >
          <Menu :size="20" />
        </button>
        <h1 class="font-arabic text-lg font-bold text-primary">القرآن الكريم</h1>
        <div class="w-10"></div>
      </div>

      <!-- Contenu scrollable -->
      <div class="flex-1 overflow-y-auto custom-scrollbar">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import { Search, X, Menu, Sparkles, Heart, Scale } from 'lucide-vue-next'
import { useQuranStore } from '../stores/quran'

defineProps({
  sidebarOpen: {
    type: Boolean,
    default: true
  }
})

defineEmits(['toggle-sidebar', 'select-surah', 'open-collection'])

const store = useQuranStore()
</script>
