<template>
  <div class="min-h-screen flex flex-col" :class="{ 'dark': store.darkMode }">
    <AppHeader @back="backToSurahs" @toggle-about="showAboutModal = true" />
    
    <main class="flex-1 container mx-auto px-4 py-8">
      <!-- Message d'erreur -->
      <div
        v-if="store.error"
        class="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive"
      >
        <div class="flex items-start gap-3">
          <AlertCircle :size="20" class="mt-0.5" />
          <div>
            <h3 class="font-semibold">Erreur</h3>
            <p class="text-sm">{{ store.error }}</p>
          </div>
        </div>
      </div>

      <!-- État de chargement -->
      <LoadingSpinner v-if="store.loading" message="جاري تحميل القرآن الكريم..." />

      <!-- Vue Liste des Surahs -->
      <div v-else-if="!selectedSurah" class="space-y-8">
        <!-- Résultats Recherche Ayahs -->
        <div v-if="store.searchResults.length > 0" class="mb-8">
          <h3 class="text-xl font-bold mb-4 flex items-center gap-2">
            <Search :size="20" /> 
            Résultats de recherche ({{ store.searchResults.length }})
          </h3>
          <AyahList
            :ayahs="store.searchResults"
            :surah="{ name_en: 'Résultats de recherche', name_ar: 'نتائج البحث', type: 'Result' }"
            :fontSize="store.fontSize"
            @back="store.searchResults = []"
          />
        </div>

        <!-- PRIORITÉ 1: Collections Explorer (كنوز القرآن) -->
        <div v-if="!store.searchQuery && !activeCollection && !selectedSurah" class="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div class="mb-6" dir="rtl">
                <h2 class="text-2xl md:text-3xl font-bold text-foreground" style="font-family: 'Amiri', 'Scheherazade New', 'Traditional Arabic', serif;">
                    كنوز القرآن
                </h2>
            </div>
            
            <!-- Grid 4 colonnes responsive -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                 <!-- القرآن الكريم -->
                <button @click="showSurahModal = true" class="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 border-2 border-primary/30 group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <div class="absolute top-0 left-0 p-3 opacity-10 group-hover:scale-110 transition-transform duration-500">
                        <img src="/logo.png" alt="القرآن" class="w-24 h-24" />
                    </div>
                    <div class="relative z-10 flex flex-col items-center text-center">
                        <div class="w-12 h-12 rounded-xl bg-primary shadow-md flex items-center justify-center mb-4 text-primary-foreground group-hover:rotate-6 transition-transform p-2">
                            <img src="/logo.png" alt="القرآن" class="w-full h-full object-contain" />
                        </div>
                        <h3 class="text-lg font-bold font-arabic mb-1 text-primary">القرآن الكريم</h3>
                        <p class="text-xs text-muted-foreground font-arabic leading-relaxed">تصفح جميع السور</p>
                    </div>
                </button>

                 <!-- Solutions -->
                <button @click="activeCollection = 'solutions'" class="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-rose-50 to-orange-50 dark:from-rose-950/30 dark:to-orange-950/30 border border-rose-100 dark:border-rose-900 group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <div class="absolute top-0 left-0 p-3 opacity-10 group-hover:scale-110 transition-transform duration-500">
                        <Heart class="w-24 h-24 text-rose-500" />
                    </div>
                    <div class="relative z-10 flex flex-col items-center text-center">
                        <div class="w-12 h-12 rounded-xl bg-white dark:bg-rose-900/50 shadow-md flex items-center justify-center mb-4 text-rose-600 dark:text-rose-400 group-hover:rotate-6 transition-transform">
                            <Heart class="w-6 h-6 fill-rose-100 dark:fill-rose-900" />
                        </div>
                        <h3 class="text-lg font-bold font-arabic mb-1 text-rose-900 dark:text-rose-100">الشفاء والرحمة</h3>
                        <p class="text-xs text-rose-700/80 dark:text-rose-300/80 font-arabic leading-relaxed">آيات السكينة والطمأنينة</p>
                    </div>
                </button>

                <!-- Douas -->
                <button @click="activeCollection = 'duas'" class="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-100 dark:border-emerald-900 group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <div class="absolute top-0 left-0 p-3 opacity-10 group-hover:scale-110 transition-transform duration-500">
                        <Sparkles class="w-24 h-24 text-emerald-500" />
                    </div>
                    <div class="relative z-10 flex flex-col items-center text-center">
                        <div class="w-12 h-12 rounded-xl bg-white dark:bg-emerald-900/50 shadow-md flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400 group-hover:rotate-6 transition-transform">
                            <Sparkles class="w-6 h-6" />
                        </div>
                        <h3 class="text-lg font-bold font-arabic mb-1 text-emerald-900 dark:text-emerald-100">أدعية مختارة</h3>
                        <p class="text-xs text-emerald-700/80 dark:text-emerald-300/80 font-arabic leading-relaxed">جوامع الدعاء المأثور</p>
                    </div>
                </button>

                <!-- Adab -->
                <button @click="activeCollection = 'adab'" class="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-100 dark:border-blue-900 group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <div class="absolute top-0 left-0 p-3 opacity-10 group-hover:scale-110 transition-transform duration-500">
                        <Library class="w-24 h-24 text-blue-500" />
                    </div>
                    <div class="relative z-10 flex flex-col items-center text-center">
                        <div class="w-12 h-12 rounded-xl bg-white dark:bg-blue-900/50 shadow-md flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400 group-hover:rotate-6 transition-transform">
                            <Library class="w-6 h-6" />
                        </div>
                        <h3 class="text-lg font-bold font-arabic mb-1 text-blue-900 dark:text-blue-100">الآداب والأخلاق</h3>
                        <p class="text-xs text-blue-700/80 dark:text-blue-300/80 font-arabic leading-relaxed">بناء الشخصية المسلمة</p>
                    </div>
                </button>
            </div>
        </div>

        <!-- PRIORITÉ 2: Dashboard des Statistiques -->
        <Dashboard v-if="!store.searchQuery && !activeCollection" />

        <!-- PRIORITÉ 3: Horaires de Prière -->
        <PrayerTimes v-if="!store.searchQuery && !activeCollection" />

        <!-- PRIORITÉ 3.5: Asma ul Husna (99 noms d'Allah) -->
        <div v-if="!store.searchQuery && !activeCollection" class="mt-6">
          <AsmaUlHusna />
        </div>

        <!-- PRIORITÉ 4: Section Favoris Améliorée -->
        <BookmarksSection
          v-if="!activeCollection && !store.searchQuery"
          @select="goToAyah"
          @remove="store.toggleBookmark"
        />
        
        <!-- Résultats de la recherche (Versets) -->
        <SearchResults 
          v-if="store.searchQuery.length >= 2" 
          @select-surah="selectSurah"
        />


        <!-- Collection Viewer -->
        <CollectionManager 
            v-if="activeCollection" 
            :type="activeCollection" 
            @close="activeCollection = null" 
            class="mb-12"
        />

        
        <!-- Liste des Sourates: Maintenant dans le modal uniquement -->
        
        <!-- État vide global -->
        <div v-if="store.filteredSurahs.length === 0 && store.searchResults.length === 0 && !store.isSearching && store.searchQuery" class="text-center py-12">
          <p class="text-muted-foreground font-arabic" dir="rtl">لم يتم العثور على سورة أو آية لـ "{{ store.searchQuery }}"</p>
        </div>
      </div>

      <!-- Mode Mushaf (lecture continue de tout le Quran) -->
      <MushafMode
        v-else-if="store.readingMode && !selectedSurah"
        :surahs="store.surahs"
        @toggle-mode="store.readingMode = false"
        @open-note="openNoteForAyah"
      />

      <!-- Vue Ayahs (une seule sourate sélectionnée) -->
      <AyahList
        v-else-if="selectedSurah"
        :ayahs="store.ayahs"
        :surah="store.currentSurah"
        :fontSize="store.fontSize"
        @back="backToSurahs"
      />
    </main>

    <!-- Footer (uniquement sur la page principale) -->
    <footer v-if="!selectedSurah && !store.readingMode" class="mt-auto border-t bg-gradient-to-br from-background via-background to-primary/5">
      <div class="container mx-auto px-4 py-12">
        <!-- Islamic Tools Grid (Hadith, Azkar, Tasbih) -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16 max-w-7xl mx-auto px-4 items-stretch">
          <!-- 1. Random Hadith -->
          <div class="h-full flex flex-col">
            <RandomHadith class="h-full flex-1" />
          </div>

          <!-- 2. Daily Azkar -->
          <div class="h-full flex flex-col">
            <DailyAzkar class="h-full flex-1" />
          </div>

          <!-- 3. Tasbih Counter -->
          <div class="h-full flex flex-col">
            <TasbihCounter class="h-full flex-1" />
          </div>
        </div>

        <!-- Section Intro (Logo + Description) -->
        <div class="text-center mb-12 max-w-2xl mx-auto">
          <div class="mb-6 relative inline-block">
            <div class="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
            <img src="/logo.png" alt="القرآن الكريم" class="h-24 w-24 object-contain relative z-10 mx-auto" />
          </div>
          <h2 class="font-arabic-bold text-4xl mb-4 bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
            القرآن الكريم
          </h2>
          <p class="font-arabic text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            تطبيق قرآني حديث ومفتوح المصدر، يوفّر تجربة متكاملة لقراءة القرآن الكريم والاستماع إليه
          </p>
        </div>



        <!-- Douaa Section -->
        <div class="mb-8">
          <div class="text-center mb-6">
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg mb-2">
              <Heart :size="20" />
              <h3 class="font-arabic-bold text-lg">الدُّعَاء</h3>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            <!-- Douaa 1 -->
            <div class="group p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-2 border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all hover:shadow-lg">
              <div class="flex items-start gap-2 mb-2">
                <div class="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                  <span class="text-sm font-bold">١</span>
                </div>
                <p class="font-arabic text-sm leading-relaxed text-right flex-1" dir="rtl">
                  اللَّهُمَّ بَارِكْ فِي صَاحِبِ هَذَا المَشْرُوعِ، وَفِي عِلْمِهِ وَعَمَلِهِ، وَاجْعَلْ هَذَا العَمَلَ فِي مِيزَانِ حَسَنَاتِهِ.
                </p>
              </div>
            </div>

            <!-- Douaa 2 -->
            <div class="group p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-2 border-amber-200 dark:border-amber-800 hover:border-amber-400 dark:hover:border-amber-600 transition-all hover:shadow-lg">
              <div class="flex items-start gap-2 mb-2">
                <div class="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                  <span class="text-sm font-bold">٢</span>
                </div>
                <p class="font-arabic text-sm leading-relaxed text-right flex-1" dir="rtl">
                  اللَّهُمَّ اغْفِرْ لِوَالِدَيْهِ، وَارْحَمْهُمَا كَمَا رَبَّيَاهُ صَغِيرًا، وَأَدْخِلْهُمَا الفِرْدَوْسَ الأَعْلَى مِنَ الجَنَّةِ.
                </p>
              </div>
            </div>

            <!-- Douaa 3 -->
            <div class="group p-4 rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 border-2 border-rose-200 dark:border-rose-800 hover:border-rose-400 dark:hover:border-rose-600 transition-all hover:shadow-lg">
              <div class="flex items-start gap-2 mb-2">
                <div class="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                  <span class="text-sm font-bold">٣</span>
                </div>
                <p class="font-arabic text-sm leading-relaxed text-right flex-1" dir="rtl">
                  اللَّهُمَّ احْفَظْ أَبْنَاءَهُ، وَأَصْلِحْهُمْ، وَاجْعَلْهُمْ مِنَ الصَّالِحِينَ الصَّالِحَاتِ، وَقُرَّةَ عَيْنٍ لَهُ فِي الدُّنْيَا وَالآخِرَةِ.
                </p>
              </div>
            </div>

            <!-- Douaa 4 -->
            <div class="group p-4 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 border-2 border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all hover:shadow-lg">
              <div class="flex items-start gap-2 mb-2">
                <div class="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                  <span class="text-sm font-bold">٤</span>
                </div>
                <p class="font-arabic text-sm leading-relaxed text-right flex-1" dir="rtl">
                  اللَّهُمَّ بَارِكْ لَهُ فِي زَوْجَتِهِ، وَأَدِمْ بَيْنَهُمَا المَوَدَّةَ وَالرَّحْمَةَ، وَاجْعَلْ بَيْتَهُمَا بَيْتَ سَكِينَةٍ وَطَاعَةٍ وَإِيمَانٍ.
                </p>
              </div>
            </div>

            <!-- Douaa 5 -->
            <div class="group p-4 rounded-xl bg-gradient-to-br from-cyan-50 to-sky-50 dark:from-cyan-950/30 dark:to-sky-950/30 border-2 border-cyan-200 dark:border-cyan-800 hover:border-cyan-400 dark:hover:border-cyan-600 transition-all hover:shadow-lg">
              <div class="flex items-start gap-2 mb-2">
                <div class="w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                  <span class="text-sm font-bold">٥</span>
                </div>
                <p class="font-arabic text-sm leading-relaxed text-right flex-1" dir="rtl">
                  اللَّهُمَّ اغْفِرْ لِأَخَوَاتِهِ، وَبَارِكْ لَهُنَّ فِي أَزْوَاجِهِنَّ، وَأَصْلِحْ ذُرِّيَّتَهُنَّ، وَاجْمَعْهُمْ عَلَى مَا تُحِبُّ وَتَرْضَى.
                </p>
              </div>
            </div>

            <!-- Douaa 6 -->
            <div class="group p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 border-2 border-indigo-200 dark:border-indigo-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all hover:shadow-lg">
              <div class="flex items-start gap-2 mb-2">
                <div class="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                  <span class="text-sm font-bold">٦</span>
                </div>
                <p class="font-arabic text-sm leading-relaxed text-right flex-1" dir="rtl">
                  اللَّهُمَّ اغْفِرْ لِوَالِدَيْ زَوْجَتِهِ، وَارْحَمْهُمَا، وَجَازِهِمَا عَنْ أُسْرَتِهِمَا خَيْرَ الجَزَاءِ.
                </p>
              </div>
            </div>

            <!-- Douaa Final - Pleine largeur -->
            <div class="md:col-span-2 lg:col-span-3 p-6 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl border-2 border-emerald-400">
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Heart :size="20" />
                </div>
                <div class="flex-1">
                  <p class="font-arabic text-base leading-relaxed text-right font-bold mb-2" dir="rtl">
                    اللَّهُمَّ اجْعَلْ هَذَا العَمَلَ صَدَقَةً جَارِيَةً عَنْهُ، وَعَنْ أَهْلِهِ، وَعَنْ جَمِيعِ المُسْلِمِينَ وَالمُسْلِمَاتِ، الأَحْيَاءِ مِنْهُمْ وَالأَمْوَاتِ.
                  </p>
                  <p class="font-arabic text-sm leading-relaxed text-right opacity-90" dir="rtl">
                    اللَّهُمَّ تَقَبَّلْ مِنَّا جَمِيعًا، إِنَّكَ أَنْتَ السَّمِيعُ العَلِيمُ، وَتُبْ عَلَيْنَا إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="pt-6 border-t border-border/50">
          <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <p class="text-sm text-muted-foreground font-arabic">
              © 2026 القرآن الكريم • جميع الحقوق محفوظة
            </p>
            <div class="flex items-center gap-4">
              <button 
                @click="scrollToTop" 
                class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
              >
                <Home :size="16" />
                <span class="font-arabic text-sm">الرئيسية</span>
              </button>
              <button 
                @click="showAboutModal = true" 
                class="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <Info :size="16" />
                <span class="font-arabic text-sm">حول التطبيق</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
    
    <!-- Modal Sélection Sourate -->
    <SurahModal
      :show="showSurahModal"
      :selectedSurah="selectedSurah"
      @update:show="showSurahModal = $event"
      @select="selectSurah"
    />
    
    <!-- Popup d'accueil -->
    <WelcomeModal />
    
    <!-- About Modal -->
    <AboutModal :show="showAboutModal" @close="showAboutModal = false" />
    
    <!-- Clavier Arabe -->
    <ArabicKeyboard />
    
    <!-- Bouton Retour en haut -->
    <ScrollToTop />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { 
  AlertCircle, Heart, Github, Search, Bookmark, Library,
  Volume2, Menu, Home, Info, ExternalLink,
  Code2, User, Shield, Code, Zap, Scale, Sparkles
} from 'lucide-vue-next'
import { useQuranStore } from './stores/quran'
import AppHeader from './components/AppHeader.vue'
import SurahList from './components/SurahList.vue'
import AyahList from './components/AyahList.vue'
import MushafMode from './components/MushafMode.vue'
import BookmarksSection from './components/BookmarksSection.vue'
import Dashboard from './components/Dashboard.vue'
import PrayerTimes from './components/PrayerTimes.vue'
import AsmaUlHusna from './components/AsmaUlHusna.vue'
import RandomHadith from './components/RandomHadith.vue'
import DailyAzkar from './components/DailyAzkar.vue'
import TasbihCounter from './components/TasbihCounter.vue'
import SurahModal from './components/SurahModal.vue'
import CollectionManager from './components/CollectionManager.vue'
import LoadingSpinner from './components/LoadingSpinner.vue'
import WelcomeModal from './components/WelcomeModal.vue'
import AboutModal from './components/AboutModal.vue'
import ArabicKeyboard from './components/ArabicKeyboard.vue'
import ScrollToTop from './components/ScrollToTop.vue'
import SearchResults from './components/SearchResults.vue'

const store = useQuranStore()
const activeCollection = ref(null)
const selectedSurah = ref(null)
const showAboutModal = ref(false)
const showSurahModal = ref(false)

// Watcher pour la recherche
let searchTimeout
watch(() => store.searchQuery, (newQuery) => {
  if (searchTimeout) clearTimeout(searchTimeout)
  
  if (newQuery && newQuery.length >= 2) {
    searchTimeout = setTimeout(() => {
      store.searchAyahs(newQuery)
    }, 500) // Debounce 500ms
  } else {
    store.searchResults = []
  }
})

onMounted(async () => {
  await Promise.all([
    store.fetchSurahs(),
    store.loadSurahNamesTashkeel()
  ])
})

const selectSurah = async (surah) => {
  selectedSurah.value = surah
  store.currentSurah = surah
  // Si on vient d'une recherche, on peut vouloir garder le terme ou non.
  // Pour l'instant on garde le comportement par défaut
  await store.fetchAyahs(surah.number)
}

const goToAyah = async (bookmark) => {
  const surah = store.surahs.find(s => s.id === bookmark.surah_id)
  if (surah) {
    await selectSurah(surah)
    // Optional: Scroll logic could be added here later
  }
}

const backToSurahs = () => {
  selectedSurah.value = null
  store.currentSurah = null
  store.ayahs = []
  store.searchResults = []
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  backToSurahs()
}

const openNoteForAyah = (ayah) => {
  // Cette fonction sera appelée depuis MushafMode
  // On peut implémenter un événement global ou utiliser un modal centralisé
  console.log('Open note for ayah:', ayah)
  // TODO: Implémenter le modal de notes global si nécessaire
}

</script>
