<template>
  <div class="mb-8">
    <!-- Title -->
    <div class="mb-4" dir="rtl">
      <h2 class="text-xl md:text-2xl font-bold text-foreground" style="font-family: 'Amiri', 'Scheherazade New', 'Traditional Arabic', serif;">
        الصلاة القادمة
      </h2>
    </div>
    
    <div v-if="loading" class="text-center py-4">
      <p class="text-sm text-muted-foreground font-arabic">جاري التحميل...</p>
    </div>

    <div v-else-if="prayerTimes" class="space-y-4" dir="rtl">
      <!-- Next Prayer Countdown - Ultra compact -->
      <div class="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl p-4">
        <!-- Titre centré et grand -->
        <div class="text-center mb-4">
          <p class="text-xs opacity-80 font-arabic mb-2">الصلاة القادمة</p>
          <h3 class="text-3xl font-bold font-arabic mb-1">{{ getPrayerName(nextPrayer?.name) }}</h3>
          <p class="text-xl font-bold opacity-90">{{ nextPrayer?.time }}</p>
        </div>
        
        <!-- Countdown Timer ultra-compact -->
        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-2">
          <div class="flex items-center justify-center gap-1.5">
            <!-- Heures -->
            <div class="flex-1 text-center">
              <div class="bg-white/20 rounded-md px-2 py-1 mb-0.5">
                <p class="text-xl font-bold leading-none">{{ timeLeft.hours }}</p>
              </div>
              <p class="text-[8px] opacity-75 font-arabic">ساعة</p>
            </div>
            
            <span class="text-lg font-bold opacity-40 pb-3">:</span>
            
            <!-- Minutes -->
            <div class="flex-1 text-center">
              <div class="bg-white/20 rounded-md px-2 py-1 mb-0.5">
                <p class="text-xl font-bold leading-none">{{ timeLeft.minutes }}</p>
              </div>
              <p class="text-[8px] opacity-75 font-arabic">دقيقة</p>
            </div>
            
            <span class="text-lg font-bold opacity-40 pb-3">:</span>
            
            <!-- Secondes -->
            <div class="flex-1 text-center">
              <div class="bg-white/20 rounded-md px-2 py-1 mb-0.5">
                <p class="text-xl font-bold leading-none">{{ timeLeft.seconds }}</p>
              </div>
              <p class="text-[8px] opacity-75 font-arabic">ثانية</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Hadith/Ayah Slideshow avec animation -->
      <div v-if="nextPrayer" class="rounded-2xl border bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 p-8 md:p-10 relative overflow-hidden">
        <!-- Barre de progression -->
        <div class="absolute top-0 left-0 right-0 h-1 bg-emerald-200 dark:bg-emerald-800">
          <div class="h-full bg-emerald-600 dark:bg-emerald-400 transition-all duration-[5000ms] ease-linear" :style="{ width: slideProgress + '%' }"></div>
        </div>

        <!-- Titre avec indicateurs -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <Moon :size="32" class="text-emerald-600" />
            <h4 class="font-arabic-bold text-2xl md:text-3xl">{{ getPrayerHadithTitle(nextPrayer.name) }}</h4>
          </div>
          <!-- Indicateurs de slides (dots) -->
          <div class="flex gap-1.5">
            <div 
              v-for="(item, index) in getCurrentPrayerContent(nextPrayer.name)" 
              :key="index"
              class="w-2 h-2 rounded-full transition-all duration-300"
              :class="index === currentSlideIndex ? 'bg-emerald-600 dark:bg-emerald-400 w-6' : 'bg-emerald-300 dark:bg-emerald-700'"
            ></div>
          </div>
        </div>
        
        <!-- Contenu avec transition -->
        <Transition name="slide-fade" mode="out-in">
          <div :key="currentSlideIndex" class="min-h-[180px] flex flex-col justify-center">
            <div class="mb-6 text-center">
              <p class="text-sm text-muted-foreground font-arabic mb-4 flex items-center justify-center gap-2">
                <span v-if="currentSlide?.type === 'hadith'">قال رسولُ اللهِ ﷺ:</span>
                <span v-else>قال الله تعالى:</span>
              </p>
              <p class="text-xl md:text-2xl font-arabic leading-relaxed text-center px-4">{{ currentSlide?.text }}</p>
            </div>
            
            <div class="flex items-center justify-center gap-2 text-base text-muted-foreground">
              <BookOpen :size="16" />
              <span class="font-arabic">{{ currentSlide?.source }}</span>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Prayer Times List & Info Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        <!-- Prayer Times List -->
        <div class="rounded-xl border bg-card p-4 h-full">
          <h3 class="font-arabic-bold text-lg mb-3">مواقيت الصلاة</h3>
          <div class="space-y-2">
            <div
              v-for="prayer in prayers.filter(p => p.name !== 'Sunrise')"
              :key="prayer.name"
              class="flex items-center justify-between py-2.5 px-3 rounded-lg transition-colors"
              :class="isPrayerCurrent(prayer.name) ? 'bg-primary/10' : 'hover:bg-muted/50'"
            >
              <div class="flex items-center gap-2">
                <component :is="getPrayerIcon(prayer.name)" :size="18" 
                  :class="isPrayerCurrent(prayer.name) ? 'text-primary' : 'text-muted-foreground'"
                />
                <span class="text-base font-arabic" :class="isPrayerCurrent(prayer.name) ? 'font-bold text-primary' : ''">
                  {{ getPrayerName(prayer.name) }}
                </span>
              </div>
              <span class="text-base font-bold" :class="isPrayerCurrent(prayer.name) ? 'text-primary' : ''">
                {{ prayer.time}}
              </span>
            </div>
          </div>
        </div>

        <!-- Date & Qibla -->
        <div class="rounded-xl border bg-card p-4 h-full">
          <h3 class="font-arabic-bold text-lg mb-3">التاريخ والقبلة</h3>
          <div class="space-y-3">
            <div class="text-center p-3 rounded-lg bg-muted/50">
              <p class="text-sm text-muted-foreground font-arabic mb-1">التاريخ الهجري</p>
              <p class="font-arabic font-bold">{{ hijriDate }}</p>
            </div>
            <div class="text-center p-3 rounded-lg bg-muted/50">
              <p class="text-sm text-muted-foreground font-arabic mb-1">التاريخ الميلادي</p>
              <p class="font-bold">{{ gregorianDate }}</p>
            </div>
            <div class="text-center p-3 rounded-lg bg-primary/10">
              <p class="text-sm text-muted-foreground font-arabic mb-2">اتجاه القبلة</p>
              <div class="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-primary/30 bg-white dark:bg-background">
                <Navigation :size="24" class="text-primary" :style="{ transform: `rotate(${qiblaDirection}deg)` }" />
              </div>
              <p class="text-sm font-bold text-primary mt-2">{{ qiblaDirection }}°</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { Bell, Navigation, CloudMoon, Sun, Sunset, Moon, Clock, BookOpen } from 'lucide-vue-next'

const prayerTimes = ref(null)
const loading = ref(true)
const error = ref(null)
const hijriDate = ref('')
const gregorianDate = ref('')
const qiblaDirection = ref(0)
const currentTime = ref(new Date())

// Slideshow variables
const currentSlideIndex = ref(0)
const slideProgress = ref(0)
let slideInterval = null
let progressInterval = null

// Données des hadiths et ayahs pour chaque prière
const prayerContent = {
  Fajr: [
    { type: 'hadith', text: 'مَنْ صَلَّى الفَجْرَ فَهُوَ فِي ذِمَّةِ اللَّهِ', source: 'رواه مسلم' },
    { type: 'hadith', text: 'رَكْعَتَا الفَجْرِ خَيْرٌ مِنَ الدُّنْيَا وَمَا فِيهَا', source: 'رواه مسلم' },
    { type: 'hadith', text: 'اللَّهُمَّ بَارِكْ لِأُمَّتِي فِي بُكُورِهَا', source: 'رواه أبو داود' },
    { type: 'ayah', text: 'وَقُرْآنَ الْفَجْرِ ۖ إِنَّ قُرْآنَ الْفَجْرِ كَانَ مَشْهُودًا', source: 'الإسراء: 78' },
    { type: 'ayah', text: 'وَسَبِّحْ بِحَمْدِ رَبِّكَ قَبْلَ طُلُوعِ الشَّمْسِ', source: 'طه: 130' }
  ],
  Dhuhr: [
    { type: 'hadith', text: 'مَنْ حَافَظَ عَلَى أَرْبَعٍ قَبْلَ الظُّهْرِ وَأَرْبَعٍ بَعْدَهَا حَرَّمَهُ اللَّهُ عَلَى النَّارِ', source: 'رواه الترمذي' },
    { type: 'hadith', text: 'إِنَّ أَبْوَابَ السَّمَاءِ تُفْتَحُ عِنْدَ زَوَالِ الشَّمْسِ', source: 'رواه الترمذي' },
    { type: 'hadith', text: 'أَفْضَلُ الأَعْمَالِ الصَّلَاةُ لِوَقْتِهَا', source: 'متفق عليه' },
    { type: 'ayah', text: 'أَقِمِ الصَّلَاةَ لِدُلُوكِ الشَّمْسِ', source: 'الإسراء: 78' },
    { type: 'ayah', text: 'إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا', source: 'النساء: 103' }
  ],
  Asr: [
    { type: 'hadith', text: 'مَنْ صَلَّى البَرْدَيْنِ دَخَلَ الجَنَّةَ', source: 'متفق عليه' },
    { type: 'hadith', text: 'مَنْ تَرَكَ صَلَاةَ العَصْرِ فَقَدْ حَبِطَ عَمَلُهُ', source: 'رواه البخاري' },
    { type: 'hadith', text: 'تَعَاقَبُ فِيكُمْ مَلَائِكَةٌ بِاللَّيْلِ وَالنَّهَارِ', source: 'متفق عليه' },
    { type: 'ayah', text: 'حَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلَاةِ الْوُسْطَى', source: 'البقرة: 238' },
    { type: 'ayah', text: 'وَسَبِّحْ بِحَمْدِ رَبِّكَ قَبْلَ غُرُوبِهَا', source: 'طه: 130' }
  ],
  Maghrib: [
    { type: 'hadith', text: 'لَا تَزَالُ أُمَّتِي بِخَيْرٍ مَا عَجَّلُوا المَغْرِبَ', source: 'رواه أبو داود' },
    { type: 'hadith', text: 'إِذَا أَقْبَلَ اللَّيْلُ وَأَدْبَرَ النَّهَارُ فَقَدْ أَفْطَرَ الصَّائِمُ', source: 'متفق عليه' },
    { type: 'hadith', text: 'كَانَ النَّبِيُّ ﷺ يُصَلِّي المَغْرِبَ إِذَا غَرَبَتِ الشَّمْسُ', source: 'رواه مسلم' },
    { type: 'ayah', text: 'فَسُبْحَانَ اللَّهِ حِينَ تُمْسُونَ', source: 'الروم: 17' },
    { type: 'ayah', text: 'وَأَقِمِ الصَّلَاةَ طَرَفَيِ النَّهَارِ', source: 'هود: 114' }
  ],
  Isha: [
    { type: 'hadith', text: 'مَنْ صَلَّى العِشَاءَ فِي جَمَاعَةٍ فَكَأَنَّمَا قَامَ نِصْفَ اللَّيْلِ', source: 'رواه مسلم' },
    { type: 'hadith', text: 'أَثْقَلُ الصَّلَاةِ عَلَى المُنَافِقِينَ صَلَاةُ العِشَاءِ', source: 'متفق عليه' },
    { type: 'hadith', text: 'لَوْ يَعْلَمُونَ مَا فِي العِشَاءِ لَأَتَوْهَا وَلَوْ حَبْوًا', source: 'متفق عليه' },
    { type: 'ayah', text: 'وَمِنْ بَعْدِ صَلَاةِ الْعِشَاءِ', source: 'النور: 58' },
    { type: 'ayah', text: 'كَانُوا قَلِيلًا مِنَ اللَّيْلِ مَا يَهْجَعُونَ', source: 'الذاريات: 17' }
  ]
}

// Get current prayer content
const getCurrentPrayerContent = (prayerName) => {
  return prayerContent[prayerName] || []
}

// Get current slide
const currentSlide = computed(() => {
  if (!nextPrayer.value) return null
  const content = getCurrentPrayerContent(nextPrayer.value.name)
  return content[currentSlideIndex.value] || null
})

// Start slideshow
const startSlideshow = () => {
  // Reset
  currentSlideIndex.value = 0
  slideProgress.value = 0
  
  // Clear existing intervals
  if (slideInterval) clearInterval(slideInterval)
  if (progressInterval) clearInterval(progressInterval)
  
  // Change slide every 15 seconds (au lieu de 5)
  slideInterval = setInterval(() => {
    const content = getCurrentPrayerContent(nextPrayer.value?.name)
    if (content.length > 0) {
      currentSlideIndex.value = (currentSlideIndex.value + 1) % content.length
      slideProgress.value = 0
    }
  }, 15000) // 15 secondes
  
  // Update progress bar every 150ms pour 15 secondes
  progressInterval = setInterval(() => {
    slideProgress.value += 1 // 100% in 15000ms = 1% every 150ms
    if (slideProgress.value >= 100) {
      slideProgress.value = 0
    }
  }, 150) // 150ms
}

// Update time every second
setInterval(() => {
  currentTime.value = new Date()
}, 1000)

const prayers = computed(() => {
  if (!prayerTimes.value) return []
  
  return [
    { name: 'Fajr', time: prayerTimes.value.Fajr },
    { name: 'Sunrise', time: prayerTimes.value.Sunrise },
    { name: 'Dhuhr', time: prayerTimes.value.Dhuhr },
    { name: 'Asr', time: prayerTimes.value.Asr },
    { name: 'Maghrib', time: prayerTimes.value.Maghrib },
    { name: 'Isha', time: prayerTimes.value.Isha }
  ]
})

const nextPrayer = computed(() => {
  if (!prayers.value.length) return null
  
  const now = currentTime.value
  const today = new Date()
  
  for (const prayer of prayers.value) {
    if (prayer.name === 'Sunrise') continue
    
    const [hours, minutes] = prayer.time.split(':')
    const prayerTime = new Date(today)
    prayerTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)
    
    if (prayerTime > now) {
      return prayer
    }
  }
  
  return prayers.value[0]
})

const timeLeft = computed(() => {
  if (!nextPrayer.value || !prayerTimes.value) {
    return { hours: '00', minutes: '00', seconds: '00' }
  }
  
  const now = currentTime.value
  const today = new Date()
  const [hours, minutes] = nextPrayer.value.time.split(':')
  const prayerTime = new Date(today)
  prayerTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)
  
  let diff = prayerTime - now
  
  // If diff is negative, it's tomorrow
  if (diff < 0) {
    prayerTime.setDate(prayerTime.getDate() + 1)
    diff = prayerTime - now
  }
  
  const h = Math.floor(diff / (1000 * 60 * 60))
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const s = Math.floor((diff % (1000 * 60)) / 1000)
  
  return {
    hours: String(h).padStart(2, '0'),
    minutes: String(m).padStart(2, '0'),
    seconds: String(s).padStart(2, '0')
  }
})

// Watch for prayer changes - APRÈS la définition de nextPrayer
watch(() => nextPrayer.value?.name, (newPrayer) => {
  if (newPrayer) {
    startSlideshow()
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
  return nextPrayer.value?.name === name
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


const getArabicMonthName = (monthNumber) => {
  // Convertir en string et ajouter le zéro si nécessaire
  const monthStr = String(monthNumber).padStart(2, '0')
  const months = {
    '01': 'يناير', '02': 'فبراير', '03': 'مارس', '04': 'أبريل',
    '05': 'مايو', '06': 'يونيو', '07': 'يوليو', '08': 'أغسطس',
    '09': 'سبتمبر', '10': 'أكتوبر', '11': 'نوفمبر', '12': 'ديسمبر'
  }
  return months[monthStr] || monthNumber
}

const loadPrayerTimes = async () => {
  loading.value = true
  error.value = null
  
  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject)
    })
    
    const { latitude, longitude } = position.coords
    // Méthode 21 = Morocco (Ministère des Habous et des Affaires Islamiques du Maroc)
    const response = await fetch(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=21`)
    const data = await response.json()
    
    if (data.code === 200) {
      prayerTimes.value = data.data.timings
      
      // Hijri Date
      const hijri = data.data.date.hijri
      hijriDate.value = `${hijri.day} ${hijri.month.ar || hijri.month.en} ${hijri.year} هـ`
      
      // Gregorian Date
      const greg = data.data.date.gregorian
      const monthNameAr = greg.month.ar || getArabicMonthName(greg.month.number)
      gregorianDate.value = `${greg.day} ${monthNameAr} ${greg.year} م`
      
      // Qibla
      qiblaDirection.value = Math.round(data.data.meta.qibla) || 0
    }
  } catch (err) {
    error.value = 'حدث خطأ في تحميل المواقيت'
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPrayerTimes()
})

onUnmounted(() => {
  if (slideInterval) clearInterval(slideInterval)
  if (progressInterval) clearInterval(progressInterval)
})
</script>

<style scoped>
/* Animation de transition pour le slideshow */
.slide-fade-enter-active {
  transition: all 0.4s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s ease-in;
}

.slide-fade-enter-from {
  transform: translateX(-20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
