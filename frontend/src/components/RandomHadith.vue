<template>
  <div class="rounded-2xl border bg-card text-card-foreground shadow-sm h-full flex flex-col p-6">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <BookText :size="20" class="text-primary" />
        </div>
        <div>
          <h3 class="font-arabic-bold text-lg">الحديث</h3>
          <p class="text-[10px] text-muted-foreground">Hadith du Prophète ﷺ</p>
        </div>
      </div>
      <button 
        @click="loadRandomHadith"
        class="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
        title="Hadith suivant"
      >
        <RefreshCw :size="16" class="text-primary" />
      </button>
    </div>

    <div v-if="hadith" class="flex flex-col flex-1 gap-4">
      <!-- Hadith Text in Arabic -->
      <div class="p-6 rounded-xl bg-muted/30 border border-border/50 flex-1 flex items-center justify-center">
        <p class="font-arabic text-lg leading-loose text-center" dir="rtl">
          {{ hadith.hadithArabic }}
        </p>
      </div>

      <!-- Source -->
      <div class="flex items-center px-3 py-2 rounded-lg bg-muted/50 mt-auto">
        <div class="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center ml-2">
          <span class="text-[10px] font-bold text-primary">{{ hadith.hadithNumber }}</span>
        </div>
        <div>
          <p class="font-arabic-bold text-xs">{{ hadith.collection }}</p>
          <p class="text-[10px] text-muted-foreground truncate max-w-[150px]">{{ hadith.book }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { BookText, RefreshCw } from 'lucide-vue-next'

const hadith = ref(null)

// Collection de hadiths authentiques (40 Hadiths An-Nawawi + autres)
const hadiths = [
  {
    hadithArabic: 'قَالَ رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ: إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
    collection: 'صحيح البخاري',
    book: 'كتاب بدء الوحي',
    hadithNumber: 1
  },
  {
    hadithArabic: 'قَالَ رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ: الإِسْلاَمُ أَنْ تَشْهَدَ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَتُقِيمَ الصَّلاَةَ، وَتُؤْتِيَ الزَّكَاةَ، وَتَصُومَ رَمَضَانَ، وَتَحُجَّ البَيْتَ إِنْ اسْتَطَعْتَ إِلَيْهِ سَبِيلاً',
    collection: 'صحيح مسلم',
    book: 'كتاب الإيمان',
    hadithNumber: 2
  },
  {
    hadithArabic: 'قَالَ رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ: مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ',
    collection: 'صحيح البخاري',
    book: 'كتاب الأدب',
    hadithNumber: 3
  },
  {
    hadithArabic: 'قَالَ رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ: الْمُؤْمِنُ الْقَوِيُّ خَيْرٌ وَأَحَبُّ إِلَى اللَّهِ مِنْ الْمُؤْمِنِ الضَّعِيفِ وَفِي كُلٍّ خَيْرٌ',
    collection: 'صحيح مسلم',
    book: 'كتاب القدر',
    hadithNumber: 4
  },
  {
    hadithArabic: 'قَالَ رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ: مَنْ غَشَّنَا فَلَيْسَ مِنَّا',
    collection: 'صحيح مسلم',
    book: 'كتاب الإيمان',
    hadithNumber: 5
  },
  {
    hadithArabic: 'قَالَ رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ: الدِّينُ النَّصِيحَةُ. قُلْنَا: لِمَنْ؟ قَالَ: لِلَّهِ وَلِكِتَابِهِ وَلِرَسُولِهِ وَلأَئِمَّةِ الْمُسْلِمِينَ وَعَامَّتِهِمْ',
    collection: 'صحيح مسلم',
    book: 'كتاب الإيمان',
    hadithNumber: 6
  },
  {
    hadithArabic: 'قَالَ رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ: لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
    collection: 'صحيح البخاري',
    book: 'كتاب الإيمان',
    hadithNumber: 7
  },
  {
    hadithArabic: 'قَالَ رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ: مَنْ يُرِدِ اللَّهُ بِهِ خَيْرًا يُفَقِّهْهُ فِي الدِّينِ',
    collection: 'صحيح البخاري',
    book: 'كتاب العلم',
    hadithNumber: 8
  },
  {
    hadithArabic: 'قَالَ رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ: الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ',
    collection: 'صحيح البخاري',
    book: 'كتاب الإيمان',
    hadithNumber: 9
  },
  {
    hadithArabic: 'قَالَ رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ: خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    collection: 'صحيح البخاري',
    book: 'كتاب فضائل القرآن',
    hadithNumber: 10
  }
]

const loadRandomHadith = () => {
  const randomIndex = Math.floor(Math.random() * hadiths.length)
  hadith.value = hadiths[randomIndex]
}

onMounted(() => {
  loadRandomHadith()
})
</script>
