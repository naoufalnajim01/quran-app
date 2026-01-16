<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div class="relative w-full max-w-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-zinc-900 dark:to-zinc-950 rounded-3xl shadow-2xl border border-emerald-200 dark:border-emerald-900/30 overflow-hidden">
        
        <!-- Header avec logo -->
        <div class="relative bg-gradient-to-br from-emerald-600 to-teal-600 dark:from-emerald-700 dark:to-teal-700 p-8 text-center">
          <div class="flex flex-col items-center gap-4">
            <img src="/logo.png" alt="Logo" class="w-24 h-24 rounded-2xl shadow-lg" />
            <h2 class="font-arabic-bold text-3xl text-white" dir="rtl">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </h2>
          </div>
        </div>

        <!-- Contenu -->
        <div class="p-8 space-y-6">
          <!-- Douaa -->
          <div class="space-y-4">
            <div class="flex items-center justify-center gap-2 text-emerald-700 dark:text-emerald-400">
              <Heart :size="24" class="fill-current" />
              <h3 class="font-arabic-bold text-xl">دعاء</h3>
            </div>
            <div class="bg-white/80 dark:bg-zinc-800/50 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-800">
              <p class="font-arabic text-lg leading-relaxed text-center text-foreground" dir="rtl">
                اللَّهُمَّ بَارِكْ فِي صَاحِبِ هَذَا المَشْرُوعِ، وَفِي عِلْمِهِ وَعَمَلِهِ، وَاجْعَلْ هَذَا العَمَلَ فِي مِيزَانِ حَسَنَاتِهِ.
              </p>
              <p class="font-arabic text-lg leading-relaxed text-center text-foreground mt-4" dir="rtl">
                اللَّهُمَّ اغْفِرْ لِوَالِدَيْهِ، وَارْحَمْهُمَا كَمَا رَبَّيَاهُ صَغِيرًا، وَأَدْخِلْهُمَا الفِرْدَوْسَ الأَعْلَى مِنَ الجَنَّةِ.
              </p>
            </div>
          </div>

          <!-- Hadith -->
          <div class="space-y-4">
            <div class="flex items-center justify-center gap-2 text-amber-600 dark:text-amber-500">
              <Sparkles :size="24" class="fill-current" />
              <h3 class="font-arabic-bold text-xl">حديث شريف</h3>
            </div>
            <div class="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-2xl p-6 border border-amber-200 dark:border-amber-800">
              <p class="font-arabic text-sm leading-relaxed text-center mb-3 text-muted-foreground" dir="rtl">
                قال رسول الله ﷺ:
              </p>
              <p class="font-arabic-bold text-xl leading-relaxed text-center text-foreground" dir="rtl">
                «خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ»
              </p>
              <p class="font-arabic text-sm text-muted-foreground text-center mt-3" dir="rtl">
                — رواه البخاري
              </p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-8 pb-8 space-y-4">
          <button
            @click="closeModal"
            class="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-4 font-bold text-lg transition-all shadow-lg hover:shadow-xl"
          >
            <span class="font-arabic">ابدأ التلاوة</span>
          </button>
          
          <label class="flex items-center justify-center gap-3 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
            <input
              type="checkbox"
              v-model="dontShowAgain"
              class="w-4 h-4 rounded border-2 border-muted-foreground checked:bg-emerald-600 checked:border-emerald-600 transition-all cursor-pointer"
            />
            <span class="font-arabic">لا تُظهر هذه الرسالة مرة أخرى</span>
          </label>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Heart, Sparkles } from 'lucide-vue-next'

const show = ref(false)
const dontShowAgain = ref(false)

onMounted(() => {
  const hasSeenWelcome = localStorage.getItem('hasSeenWelcome')
  if (!hasSeenWelcome) {
    setTimeout(() => {
      show.value = true
    }, 800)
  }
})

const closeModal = () => {
  if (dontShowAgain.value) {
    localStorage.setItem('hasSeenWelcome', 'true')
  }
  show.value = false
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.9) translateY(30px);
}
</style>
