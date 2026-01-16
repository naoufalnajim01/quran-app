<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" @click.self="close">
      <div class="relative w-full max-w-6xl h-[90vh] bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl border-2 border-primary/20 overflow-hidden transform transition-all flex flex-col">
        <!-- Bouton fermer -->
        <button
          @click="close"
          class="absolute top-4 left-4 z-10 inline-flex items-center justify-center rounded-full bg-background hover:bg-destructive/20 hover:text-destructive transition-all h-10 w-10 border-2 border-border shadow-lg"
        >
          <X :size="20" class="stroke-[2.5]" />
        </button>

        <!-- Header -->
        <div class="bg-gradient-to-br from-primary/10 via-primary/5 to-background p-6 border-b border-border/50 flex-shrink-0">
          <div class="flex items-center justify-center gap-3">
            <img src="/logo.png" alt="القرآن الكريم" class="h-12 w-12" />
            <div class="text-center">
              <h2 class="font-arabic-bold text-2xl text-foreground">تطبيق القرآن الكريم</h2>
              <p class="font-arabic text-sm text-muted-foreground">الإصدار 2.0.0</p>
            </div>
          </div>
        </div>

        <!-- Contenu en grille 2 colonnes -->
        <div class="flex-1 overflow-y-auto custom-scrollbar p-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            <!-- Colonne GAUCHE : Invocations (50%) -->
            <div class="space-y-3">
              <div class="text-center mb-3">
                <Heart :size="28" class="text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
                <h3 class="font-arabic-bold text-2xl text-emerald-700 dark:text-emerald-400">الدُّعَاء</h3>
              </div>

              <div class="space-y-3">
                <div class="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800">
                  <p class="font-arabic text-base leading-loose text-right" dir="rtl">
                    اللَّهُمَّ بَارِكْ فِي صَاحِبِ هَذَا المَشْرُوعِ، وَفِي عِلْمِهِ وَعَمَلِهِ، وَاجْعَلْ هَذَا العَمَلَ فِي مِيزَانِ حَسَنَاتِهِ.
                  </p>
                </div>

                <div class="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-800">
                  <p class="font-arabic text-base leading-loose text-right" dir="rtl">
                    اللَّهُمَّ اغْفِرْ لِوَالِدَيْهِ، وَارْحَمْهُمَا كَمَا رَبَّيَاهُ صَغِيرًا، وَأَدْخِلْهُمَا الفِرْدَوْسَ الأَعْلَى مِنَ الجَنَّةِ.
                  </p>
                </div>

                <div class="p-4 rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 border border-rose-200 dark:border-rose-800">
                  <p class="font-arabic text-base leading-loose text-right" dir="rtl">
                    اللَّهُمَّ احْفَظْ أَبْنَاءَهُ، وَأَصْلِحْهُمْ، وَاجْعَلْهُمْ مِنَ الصَّالِحِينَ الصَّالِحَاتِ، وَقُرَّةَ عَيْنٍ لَهُ فِي الدُّنْيَا وَالآخِرَةِ.
                  </p>
                </div>

                <div class="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 border border-purple-200 dark:border-purple-800">
                  <p class="font-arabic text-base leading-loose text-right" dir="rtl">
                    اللَّهُمَّ بَارِكْ لَهُ فِي زَوْجَتِهِ، وَأَدِمْ بَيْنَهُمَا المَوَدَّةَ وَالرَّحْمَةَ، وَاجْعَلْ بَيْتَهُمَا بَيْتَ سَكِينَةٍ وَطَاعَةٍ وَإِيمَانٍ.
                  </p>
                </div>

                <div class="p-4 rounded-xl bg-gradient-to-br from-cyan-50 to-sky-50 dark:from-cyan-950/20 dark:to-sky-950/20 border border-cyan-200 dark:border-cyan-800">
                  <p class="font-arabic text-base leading-loose text-right" dir="rtl">
                    اللَّهُمَّ اغْفِرْ لِأَخَوَاتِهِ، وَبَارِكْ لَهُنَّ فِي أَزْوَاجِهِنَّ، وَأَصْلِحْ ذُرِّيَّتَهُنَّ، وَاجْمَعْهُمْ عَلَى مَا تُحِبُّ وَتَرْضَى.
                  </p>
                </div>

                <div class="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 border border-indigo-200 dark:border-indigo-800">
                  <p class="font-arabic text-base leading-loose text-right" dir="rtl">
                    اللَّهُمَّ اغْفِرْ لِوَالِدَيْ زَوْجَتِهِ، وَارْحَمْهُمَا، وَجَازِهِمَا عَنْ أُسْرَتِهِمَا خَيْرَ الجَزَاءِ.
                  </p>
                </div>

                <div class="p-4 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 border-2 border-emerald-300 dark:border-emerald-700">
                  <p class="font-arabic text-base leading-loose text-right font-bold" dir="rtl">
                    اللَّهُمَّ اجْعَلْ هَذَا العَمَلَ صَدَقَةً جَارِيَةً عَنْهُ، وَعَنْ أَهْلِهِ، وَعَنْ جَمِيعِ المُسْلِمِينَ وَالمُسْلِمَاتِ، الأَحْيَاءِ مِنْهُمْ وَالأَمْوَاتِ.
                  </p>
                  <p class="font-arabic text-base leading-loose text-right mt-2" dir="rtl">
                    اللَّهُمَّ تَقَبَّلْ مِنَّا جَمِيعًا، إِنَّكَ أَنْتَ السَّمِيعُ العَلِيمُ، وَتُبْ عَلَيْنَا إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ.
                  </p>
                </div>
              </div>
            </div>

            <!-- Colonne DROITE : Info (50%) -->
            <div class="space-y-4">
              <!-- Description -->
              <p class="font-arabic text-sm leading-relaxed text-center" dir="rtl">
                تطبيق قرآني مفتوح المصدر يهدف إلى تسهيل تلاوة وسماع القرآن الكريم بأحدث التقنيات.
              </p>

              <!-- Caractéristiques -->
              <div class="grid grid-cols-3 gap-2">
                <div class="p-2 rounded-lg bg-muted/30 text-center">
                  <Layout :size="20" class="text-primary mx-auto mb-1" />
                  <p class="font-arabic text-xs">واجهة عصرية</p>
                </div>
                <div class="p-2 rounded-lg bg-muted/30 text-center">
                  <Zap :size="20" class="text-primary mx-auto mb-1" />
                  <p class="font-arabic text-xs">سريع وخفيف</p>
                </div>
                <div class="p-2 rounded-lg bg-muted/30 text-center">
                  <Code2 :size="20" class="text-primary mx-auto mb-1" />
                  <p class="font-arabic text-xs">مفتوح المصدر</p>
                </div>
              </div>

              <!-- Développeur -->
              <div class="p-4 rounded-xl border bg-card">
                <div class="text-center mb-2">
                  <div class="inline-block w-20 h-20 rounded-full overflow-hidden border-4 border-primary/20 mb-2">
                    <img 
                      src="/logo.png" 
                      alt="صاحب المشروع"
                      class="w-full h-full object-cover p-1"
                    />
                  </div>
                  <h3 class="font-arabic-bold text-base">المطوّر</h3>
                  <p class="font-arabic-bold text-lg text-primary">صاحب المشروع</p>
                </div>
                <div class="flex justify-center mt-2">
                  <a href="https://github.com/naoufalnajim01" target="_blank" class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground text-background hover:opacity-90 text-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
                    </svg>
                    <span>GitHub</span>
                  </a>
                </div>
              </div>

              <!-- Technologies -->
              <div class="p-3 rounded-lg bg-muted/30">
                <h4 class="font-arabic-bold text-sm text-center mb-2">التقنيات</h4>
                <div class="flex flex-wrap justify-center gap-1">
                  <span class="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">Vue.js</span>
                  <span class="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">Tailwind</span>
                  <span class="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">Pinia</span>
                  <span class="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">Vite</span>
                  <span class="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">Laravel</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { X, Layout, Zap, Code2, User, Heart } from 'lucide-vue-next'

defineProps({
  show: Boolean
})

const emit = defineEmits(['close'])

const close = () => {
  emit('close')
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
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95) translateY(10px);
}

/* Scrollbar personnalisée verte */
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
