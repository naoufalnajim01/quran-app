<template>
  <div class="rounded-2xl border bg-card text-card-foreground shadow-sm h-full flex flex-col p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Sunrise :size="20" class="text-primary" />
        </div>
        <div>
          <h3 class="font-arabic-bold text-lg">الأذكار</h3>
          <p class="text-[10px] text-muted-foreground">Invocations</p>
        </div>
      </div>
      <div class="flex items-center gap-1 bg-muted/50 p-1 rounded-md">
        <button 
          @click="currentCategory = 'morning'"
          :class="currentCategory === 'morning' ? 'bg-background shadow-sm text-amber-600 dark:text-amber-400' : 'text-muted-foreground hover:text-foreground'"
          class="px-2 py-1 text-[10px] font-bold rounded transition-all"
        >
          الصباح
        </button>
        <button 
          @click="currentCategory = 'evening'"
          :class="currentCategory === 'evening' ? 'bg-background shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-muted-foreground hover:text-foreground'"
          class="px-2 py-1 text-[10px] font-bold rounded transition-all"
        >
          المساء
        </button>
      </div>
    </div>

    <!-- Azkar Display -->
    <div v-if="currentAzkar" class="flex flex-col flex-1 gap-4">
      <!-- Current Dhikr -->
      <div 
        class="p-6 rounded-xl border flex-1 flex flex-col items-center justify-center transition-colors duration-300"
        :class="currentCategory === 'morning' ? 'bg-amber-50/50 dark:bg-amber-950/10 border-amber-200/50 dark:border-amber-800/30' : 'bg-indigo-50/50 dark:bg-indigo-950/10 border-indigo-200/50 dark:border-indigo-800/30'"
      >
        <div class="flex-1 flex items-center justify-center w-full">
          <p class="font-arabic text-lg leading-loose text-center" dir="rtl">
            {{ currentAzkar.text }}
          </p>
        </div>
        
        <div v-if="currentAzkar.count > 1" class="w-full flex items-center justify-between mt-4 patient-0 border-t pt-2 border-border/10">
          <span class="text-[10px] text-muted-foreground">{{ currentAzkar.reference || 'ذكر' }}</span>
          <div class="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-background/50">
            <span class="text-[10px] text-muted-foreground">تكرار</span>
            <span class="font-bold text-xs" :class="currentCategory === 'morning' ? 'text-amber-700 dark:text-amber-400' : 'text-indigo-700 dark:text-indigo-400'">
              {{ currentAzkar.count }}×
            </span>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/50 mt-auto">
        <button 
          @click="previousDhikr"
          :disabled="currentIndex === 0"
          class="p-1.5 rounded-md hover:bg-background transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight :size="16" />
        </button>
        
        <div class="text-center">
          <p class="text-xs font-bold">{{ currentIndex + 1 }} / {{ azkarList.length }}</p>
        </div>

        <button 
          @click="nextDhikr"
          :disabled="currentIndex === azkarList.length - 1"
          class="p-1.5 rounded-md hover:bg-background transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft :size="16" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { Sunrise, ChevronLeft, ChevronRight } from 'lucide-vue-next'

const currentCategory = ref('morning') // 'morning' or 'evening'
const currentIndex = ref(0)

// Azkar statiques (les plus communs)
const azkarData = {
  morning: [
    { text: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ', count: 1, reference: 'مسلم' },
    { text: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ', count: 1, reference: 'الترمذي' },
    { text: 'أَصْبَحْنَا عَلَى فِطْرَةِ الإِسْلاَمِ، وَعَلَى كَلِمَةِ الإِخْلاَصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ، وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ', count: 1, reference: 'أحمد' },
    { text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', count: 100, reference: 'البخاري' },
    { text: 'لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ', count: 10, reference: 'البخاري' },
    { text: 'أَعُوذُ بِاللَّهِ السَّمِيعِ الْعَلِيمِ مِنَ الشَّيْطَانِ الرَّجِيمِ، مِنْ هَمْزِهِ وَنَفْخِهِ وَنَفْثِهِ', count: 3, reference: 'أبو داود' },
    { text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي', count: 1, reference: 'ابن ماجه' },
    { text: 'حَسْبِيَ اللَّهُ لاَ إِلَهَ إِلاَّ هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ', count: 7, reference: 'أبو داود' }
  ],
  evening: [
    { text: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ', count: 1, reference: 'مسلم' },
    { text: 'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ', count: 1, reference: 'الترمذي' },
    { text: 'أَمْسَيْنَا عَلَى فِطْرَةِ الإِسْلاَمِ، وَعَلَى كَلِمَةِ الإِخْلاَصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ، وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ', count: 1, reference: 'أحمد' },
    { text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', count: 100, reference: 'البخاري' },
    { text: 'لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ', count: 10, reference: 'البخاري' },
    { text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي', count: 1, reference: 'ابن ماجه' },
    { text: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ', count: 3, reference: 'مسلم' },
    { text: 'حَسْبِيَ اللَّهُ لاَ إِلَهَ إِلاَّ هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ', count: 7, reference: 'أبو داود' }
  ]
}

const azkarList = computed(() => {
  return azkarData[currentCategory.value] || []
})

const currentAzkar = computed(() => {
  return azkarList.value[currentIndex.value] || null
})

const nextDhikr = () => {
  if (currentIndex.value < azkarList.value.length - 1) {
    currentIndex.value++
  }
}

const previousDhikr = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

// Reset index when category changes
watch(currentCategory, () => {
  currentIndex.value = 0
})

onMounted(() => {
  // Auto-select based on time of day
  const hour = new Date().getHours()
  if (hour >= 6 && hour < 12) {
    currentCategory.value = 'morning'
  } else {
    currentCategory.value = 'evening'
  }
})
</script>
