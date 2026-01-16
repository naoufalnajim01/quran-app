<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div
      v-for="surah in surahs"
      :key="surah.id"
      @click="$emit('select-surah', surah)"
      class="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:border-primary cursor-pointer"
    >
      <div class="p-5 h-full flex flex-col justify-between">
        <!-- Header avec numéro et badge -->
        <div class="flex flex-row-reverse items-center justify-between mb-4">
          <div class="flex flex-row-reverse items-center gap-3 w-full">
            <!-- Numéro de la Surah -->
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-lg">
              {{ surah.number }}
            </div>
            
            <div class="flex-1 text-right">
              <!-- Nom arabe -->
              <h3 class="font-arabic-title text-2xl truncate group-hover:text-primary transition-colors text-foreground">
                {{ surah.name_ar || surah.name_arabic }}
              </h3>
            </div>
          </div>
        </div>

        <div class="flex flex-row-reverse items-center justify-between mt-2 pt-3 border-t border-border/50">
            <!-- Badge Type (Arabe) -->
            <span
              :class="[
                  'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors font-arabic',
                  surah.type === 'Meccan'
                  ? 'bg-amber-100/50 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-200 dark:border-amber-900'
                  : 'bg-emerald-100/50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900'
              ]"
            >
              {{ surah.type === 'Meccan' ? 'مكية' : 'مدنية' }}
            </span>

            <!-- عداد الآيات -->
            <div class="flex items-center gap-1.5 text-muted-foreground">
              <span class="text-xs font-arabic">{{ surah.total_verses || surah.verses_count || 0 }} آية</span>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { BookOpen, MapPin, ChevronRight } from 'lucide-vue-next'

defineProps({
  surahs: {
    type: Array,
    required: true
  }
})

defineEmits(['select-surah'])

</script>
