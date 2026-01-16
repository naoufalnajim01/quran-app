<template>
  <aside class="h-full bg-card border-r border-border flex flex-col overflow-hidden">
    <!-- Quick Stats -->
    <div class="p-4 border-b border-border">
      <h3 class="font-arabic-bold text-sm mb-3 flex items-center gap-2">
        <BarChart3 :size="16" class="text-primary" />
        إحصائيات سريعة
      </h3>
      <div class="grid grid-cols-2 gap-2">
        <div class="text-center p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/20">
          <p class="text-2xl font-bold text-emerald-600">{{ stats.ayatsRead }}</p>
          <p class="text-[10px] text-muted-foreground font-arabic">آية مقروءة</p>
        </div>
        <div class="text-center p-2 rounded-lg bg-amber-50 dark:bg-amber-950/20">
          <p class="text-2xl font-bold text-amber-600">{{ stats.surahsCompleted }}</p>
          <p class="text-[10px] text-muted-foreground font-arabic">سورة مكتملة</p>
        </div>
        <div class="text-center p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20">
          <p class="text-xl font-bold text-blue-600">{{ store.notes.length }}</p>
          <p class="text-[10px] text-muted-foreground font-arabic">ملاحظة</p>
        </div>
        <div class="text-center p-2 rounded-lg bg-rose-50 dark:bg-rose-950/20">
          <p class="text-xl font-bold text-rose-600">{{ store.bookmarks.length }}</p>
          <p class="text-[10px] text-muted-foreground font-arabic">مفضلة</p>
        </div>
      </div>
    </div>

    <!-- Prayer Times Compact -->
    <div class="flex-1 overflow-y-auto p-4">
      <h3 class="font-arabic-bold text-sm mb-3 flex items-center gap-2">
        <Clock :size="16" class="text-primary" />
        الصلاة القادمة
      </h3>
      
      <div v-if="nextPrayer" class="mb-4 p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg">
        <div class="flex items-center justify-between mb-3">
          <p class="text-xs opacity-90 font-arabic">الصلاة القادمة</p>
          <div class="p-1.5 rounded-lg bg-white/20 backdrop-blur-sm">
            <Bell :size="14" />
          </div>
        </div>
        
        <div class="text-right mb-4">
          <h4 class="font-arabic-bold text-3xl mb-1">{{ getPrayerName(nextPrayer.name) }}</h4>
          <p class="text-xl font-bold opacity-90">{{ nextPrayer.time }}</p>
        </div>
        
        <!-- Countdown Timer -->
        <div class="bg-white/10 backdrop-blur-sm rounded-xl p-3">
          <div class="flex items-center justify-center gap-2 mb-2">
            <div class="flex-1 text-center">
              <div class="bg-white/20 rounded-lg p-2 mb-1">
                <p class="text-3xl font-bold leading-none">{{ formatTimeUnit(timeLeft.seconds) }}</p>
              </div>
              <p class="text-[10px] opacity-80 font-arabic">ثانية</p>
            </div>
            
            <span class="text-2xl font-bold opacity-50">:</span>
            
            <div class="flex-1 text-center">
              <div class="bg-white/20 rounded-lg p-2 mb-1">
                <p class="text-3xl font-bold leading-none">{{ formatTimeUnit(timeLeft.minutes) }}</p>
              </div>
              <p class="text-[10px] opacity-80 font-arabic">دقيقة</p>
            </div>
            
            <span class="text-2xl font-bold opacity-50">:</span>
            
            <div class="flex-1 text-center">
              <div class="bg-white/20 rounded-lg p-2 mb-1">
                <p class="text-3xl font-bold leading-none">{{ formatTimeUnit(timeLeft.hours) }}</p>
              </div>
              <p class="text-[10px] opacity-80 font-arabic">ساعة</p>
            </div>
          </div>
        </div>
      </div>

      <!-- All Prayers -->
      <div class="space-y-1">
        <div
          v-for="prayer in prayers.filter(p => p.name !== 'Sunrise')"
          :key="prayer.name"
          class="flex items-center justify-between p-2 rounded-lg transition-colors"
          :class="isPrayerCurrent(prayer.name) ? 'bg-primary/10' : 'hover:bg-muted/50'"
        >
          <div class="flex items-center gap-2">
            <component :is="getPrayerIcon(prayer.name)" :size="14" 
              :class="isPrayerCurrent(prayer.name) ? 'text-primary' : 'text-muted-foreground'"
            />
            <span class="text-sm font-arabic" :class="isPrayerCurrent(prayer.name) ? 'font-bold text-primary' : ''">
              {{ getPrayerName(prayer.name) }}
            </span>
          </div>
          <span class="text-sm font-bold" :class="isPrayerCurrent(prayer.name) ? 'text-primary' : ''">
            {{ prayer.time }}
          </span>
        </div>
      </div>

      <!-- Qibla -->
      <div class="mt-4 p-3 rounded-xl border bg-card">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-arabic">اتجاه القبلة</span>
          <span class="text-sm font-bold text-primary">{{ qiblaDirection }}°</span>
        </div>
        <div class="relative h-20 bg-muted/50 rounded-lg flex items-center justify-center">
          <div class="relative w-16 h-16 rounded-full border-2 border-primary/20">
            <div 
              class="absolute inset-0 flex items-center justify-center transition-transform duration-1000"
              :style="{ transform: `rotate(${qiblaDirection}deg)` }"
            >
              <Navigation :size="24" class="text-primary fill-current" />
            </div>
          </div>
        </div>
      </div>

      <!-- Hadith de la prière -->
      <div v-if="nextPrayer" class="mt-4 p-4 rounded-xl border bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20">
        <div class="flex items-center gap-2 mb-3">
          <Moon :size="20" class="text-emerald-600" />
          <h4 class="font-arabic-bold text-base">{{ getPrayerHadithTitle(nextPrayer.name) }}</h4>
        </div>
        
        <div class="mb-3">
          <p class="text-xs text-muted-foreground font-arabic mb-2">قال رسولُ اللهِ ﷺ:</p>
          <p class="text-sm font-arabic leading-relaxed text-right">{{ getPrayerHadith(nextPrayer.name) }}</p>
        </div>
        
        <div class="flex items-center gap-1 text-xs text-muted-foreground">
          <BookOpen :size="14" />
          <span class="font-arabic">{{ getPrayerHadithSource(nextPrayer.name) }}</span>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="p-4 border-t border-border space-y-2">
      <button
        @click="$emit('open-surah-modal')"
        class="w-full px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-arabic flex items-center justify-center gap-2"
      >
        <BookOpen :size="18" />
        اختر سورة
      </button>
      <button
        @click="store.readingMode = !store.readingMode"
        class="w-full px-4 py-2 rounded-xl border border-border hover:bg-accent transition-colors font-arabic flex items-center justify-center gap-2"
        :class="store.readingMode ? 'bg-accent' : ''"
      >
        <Book :size="18" />
        {{ store.readingMode ? 'قائمة' : 'وضع المصحف' }}
      </button>
      
      <!-- Footer Links -->
      <div class="pt-3 mt-3 border-t border-border">
        <p class="text-center text-xs text-muted-foreground font-arabic mb-2">تطبيق القرآن الكريم</p>
        <div class="flex items-center justify-center gap-3 text-xs">
          <a href="https://github.com/YOUR_USERNAME/quran-app" target="_blank" rel="noopener noreferrer" class="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
            <Github :size="14" />
            GitHub
          </a>
          <span class="text-muted-foreground">•</span>
          <span class="text-muted-foreground">2026</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { 
  BarChart3, Clock, BookOpen, Book, Navigation, Github,
  Sunrise, Sun, Sunset, Moon, CloudMoon, Bell
} from 'lucide-vue-next'
import { useQuranStore } from '../stores/quran'

const emit = defineEmits(['open-surah-modal'])
const store = useQuranStore()

const props = defineProps({
  prayers: Array,
  nextPrayer: Object,
  timeLeft: Object,
  qiblaDirection: Number
})

const stats = computed(() => {
  const readHistory = JSON.parse(localStorage.getItem('quran_read_history') || '{}')
  return {
    ayatsRead: Object.keys(readHistory).length,
    surahsCompleted: 0 // Simplified
  }
})

const getPrayerName = (name) => {
  const names = {
    'Fajr': 'الفجر',
    'Dhuhr': 'الظهر',
    'Asr': 'العصر',
    'Maghrib': 'المغرب',
    'Isha': 'العشاء'
  }
  return names[name] || name
}

const getPrayerIcon = (name) => {
  const icons = {
    'Fajr': CloudMoon,
    'Dhuhr': Sun,
    'Asr': Sun,
    'Maghrib': Sunset,
    'Isha': Moon
  }
  return icons[name] || Clock
}

const isPrayerCurrent = (name) => {
  return props.nextPrayer?.name === name
}

const formatTimeUnit = (value) => {
  return String(value || 0).padStart(2, '0')
}

const getPrayerHadithTitle = (name) => {
  const titles = {
    'Fajr': 'صلاة الفجر',
    'Dhuhr': 'صلاة الظهر',
    'Asr': 'صلاة العصر',
    'Maghrib': 'صلاة المغرب',
    'Isha': 'صلاة العشاء'
  }
  return titles[name] || ''
}

const getPrayerHadith = (name) => {
  const hadiths = {
    'Fajr': 'مَنْ صَلَّى الفَجْرَ فَهُوَ فِي ذِمَّةِ اللَّهِ، فَلَا يَطْلُبَنَّكُمُ اللَّهُ مِنْ ذِمَّتِهِ بِشَيْءٍ، فَيُدْرِكَهُ فَيَكُبَّهُ فِي نَارِ جَهَنَّمَ',
    'Dhuhr': 'مَنْ حَافَظَ عَلَى أَرْبَعِ رَكَعَاتٍ قَبْلَ الظُّهْرِ وَأَرْبَعٍ بَعْدَهَا، حَرَّمَهُ اللَّهُ عَلَى النَّارِ',
    'Asr': 'مَنْ صَلَّى البَرْدَيْنِ دَخَلَ الجَنَّةَ',
    'Maghrib': 'لَا تَزَالُ أُمَّتِي بِخَيْرٍ مَا عَجَّلُوا المَغْرِبَ',
    'Isha': 'مَنْ صَلَّى العِشَاءَ فِي جَمَاعَةٍ فَكَأَنَّمَا قَامَ نِصْفَ اللَّيْلِ، وَمَنْ صَلَّى الصُّبْحَ فِي جَمَاعَةٍ فَكَأَنَّمَا قَامَ اللَّيْلَ كُلَّهُ'
  }
  return hadiths[name] || ''
}

const getPrayerHadithSource = (name) => {
  const sources = {
    'Fajr': 'رواه مسلم',
    'Dhuhr': 'رواه الترمذي وصححه الألباني',
    'Asr': 'متفق عليه (والبَرْدَانِ: الفَجْرُ وَالعَصْرُ)',
    'Maghrib': 'رواه أبو داود وصححه الألباني',
    'Isha': 'رواه مسلم'
  }
  return sources[name] || ''
}


</script>
