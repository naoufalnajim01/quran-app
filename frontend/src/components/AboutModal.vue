<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-md" @click.self="close">
      <div class="relative w-full h-full sm:h-[90vh] sm:max-w-6xl bg-white dark:bg-zinc-950 sm:rounded-2xl shadow-2xl border-0 sm:border-2 border-primary/20 overflow-hidden transform transition-all flex flex-col">
        <!-- Bouton fermer -->
        <button
          @click="close"
          class="absolute top-4 left-4 z-10 inline-flex items-center justify-center rounded-full bg-background/80 backdrop-blur hover:bg-destructive/20 hover:text-destructive transition-all h-8 w-8 sm:h-10 sm:w-10 border border-border shadow-lg"
        >
          <X :size="18" class="stroke-[2.5]" />
        </button>

        <!-- Header -->
        <div class="bg-gradient-to-br from-primary/10 via-primary/5 to-background p-4 sm:p-6 border-b border-border/50 flex-shrink-0 mt-8 sm:mt-0">
          <div class="flex items-center justify-center gap-3">
            <img src="/logo.png" alt="القرآن الكريم" class="h-12 w-12" />
            <div class="text-center">
              <h2 class="font-arabic-bold text-2xl text-foreground">تطبيق القرآن الكريم</h2>
              <p class="font-arabic text-sm text-muted-foreground">الإصدار 2.0.0</p>
            </div>
          </div>
        </div>

        <!-- Contenu -->
        <div class="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-8">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 h-full">
            
            <!-- Colonne Droite : Infos (40%) -->
            <div class="lg:col-span-4 space-y-6">
              <!-- Description -->
              <div class="p-6 rounded-2xl bg-muted/20 border border-border/50 text-center">
                <p class="font-arabic text-lg leading-relaxed text-foreground" dir="rtl">
                  تطبيق قرآني مفتوح المصدر يهدف إلى تسهيل تلاوة وسماع القرآن الكريم بأحدث التقنيات.
                </p>
              </div>

              <!-- Caractéristiques -->
              <div class="grid grid-cols-1 gap-3">
                <div class="flex items-center gap-4 p-4 rounded-xl bg-card border border-border shadow-sm transition-hover hover:border-primary/30 hover:shadow-md">
                  <div class="p-2.5 rounded-full bg-primary/10 text-primary">
                    <Layout :size="24" />
                  </div>
                  <div class="text-right flex-1">
                    <h4 class="font-arabic-bold text-sm">واجهة عصرية</h4>
                    <p class="font-arabic text-xs text-muted-foreground">تصميم نظيف وسهل الاستخدام</p>
                  </div>
                </div>
                
                <div class="flex items-center gap-4 p-4 rounded-xl bg-card border border-border shadow-sm transition-hover hover:border-primary/30 hover:shadow-md">
                  <div class="p-2.5 rounded-full bg-primary/10 text-primary">
                    <Zap :size="24" />
                  </div>
                  <div class="text-right flex-1">
                    <h4 class="font-arabic-bold text-sm">سريع وخفيف</h4>
                    <p class="font-arabic text-xs text-muted-foreground">أداء عالي على جميع الأجهزة</p>
                  </div>
                </div>

                <div class="flex items-center gap-4 p-4 rounded-xl bg-card border border-border shadow-sm transition-hover hover:border-primary/30 hover:shadow-md">
                  <div class="p-2.5 rounded-full bg-primary/10 text-primary">
                    <Code2 :size="24" />
                  </div>
                  <div class="text-right flex-1">
                    <h4 class="font-arabic-bold text-sm">مفتوح المصدر</h4>
                    <p class="font-arabic text-xs text-muted-foreground">ساهم في تطوير التطبيق</p>
                  </div>
                </div>
              </div>

              <!-- Technologies -->
              <div class="p-5 rounded-2xl bg-muted/20 border border-border/50">
                <h4 class="font-arabic-bold text-sm text-center mb-4 text-muted-foreground">التقنيات المستخدمة</h4>
                <div class="flex flex-wrap justify-center gap-2">
                  <span class="px-3 py-1.5 rounded-full bg-background border border-border text-xs font-medium shadow-sm">Vue.js 3</span>
                  <span class="px-3 py-1.5 rounded-full bg-background border border-border text-xs font-medium shadow-sm">Tailwind CSS</span>
                  <span class="px-3 py-1.5 rounded-full bg-background border border-border text-xs font-medium shadow-sm">Pinia</span>
                  <span class="px-3 py-1.5 rounded-full bg-background border border-border text-xs font-medium shadow-sm">Vite</span>
                  <span class="px-3 py-1.5 rounded-full bg-background border border-border text-xs font-medium shadow-sm">Lumen</span>
                </div>
              </div>
            </div>

            <!-- Colonne Gauche : Douaa (60%) -->
            <div class="lg:col-span-8">
              <div class="h-full flex flex-col">
                <div class="text-center mb-6 flex items-center justify-center gap-3">
                  <div class="h-px w-12 bg-border"></div>
                  <div class="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <Heart :size="24" class="fill-current" />
                    <h3 class="font-arabic-bold text-2xl">الدُّعَاء</h3>
                  </div>
                  <div class="h-px w-12 bg-border"></div>
                </div>

                <div class="grid gap-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  <div class="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-teal-50/80 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200/60 dark:border-emerald-800/60 shadow-sm">
                    <p class="font-arabic text-xl leading-loose text-center text-emerald-900 dark:text-emerald-100" dir="rtl">
                      اللَّهُمَّ بَارِكْ فِي صَاحِبِ هَذَا المَشْرُوعِ، وَفِي عِلْمِهِ وَعَمَلِهِ، وَاجْعَلْ هَذَا العَمَلَ فِي مِيزَانِ حَسَنَاتِهِ.
                    </p>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="p-4 rounded-xl bg-card border border-border hover:border-amber-200 dark:hover:border-amber-800 transition-colors">
                      <p class="font-arabic text-base leading-loose text-center" dir="rtl">
                        اللَّهُمَّ اغْفِرْ لِوَالِدَيْهِ، وَارْحَمْهُمَا كَمَا رَبَّيَاهُ صَغِيرًا، وَأَدْخِلْهُمَا الفِرْدَوْسَ الأَعْلَى مِنَ الجَنَّةِ.
                      </p>
                    </div>

                    <div class="p-4 rounded-xl bg-card border border-border hover:border-rose-200 dark:hover:border-rose-800 transition-colors">
                      <p class="font-arabic text-base leading-loose text-center" dir="rtl">
                        اللَّهُمَّ احْفَظْ أَبْنَاءَهُ، وَأَصْلِحْهُمْ، وَاجْعَلْهُمْ مِنَ الصَّالِحِينَ الصَّالِحَاتِ.
                      </p>
                    </div>

                    <div class="p-4 rounded-xl bg-card border border-border hover:border-purple-200 dark:hover:border-purple-800 transition-colors">
                      <p class="font-arabic text-base leading-loose text-center" dir="rtl">
                        اللَّهُمَّ بَارِكْ لَهُ فِي زَوْجَتِهِ، وَأَدِمْ بَيْنَهُمَا المَوَدَّةَ وَالرَّحْمَةَ.
                      </p>
                    </div>

                    <div class="p-4 rounded-xl bg-card border border-border hover:border-cyan-200 dark:hover:border-cyan-800 transition-colors">
                      <p class="font-arabic text-base leading-loose text-center" dir="rtl">
                        اللَّهُمَّ اغْفِرْ لِأَخَوَاتِهِ وَبَارِكْ لَهُنَّ فِي أَزْوَاجِهِنَّ وَذُرِّيَّتِهِنَّ.
                      </p>
                    </div>
                  </div>

                  <div class="p-5 rounded-xl bg-muted/30 border border-border text-center mt-2">
                    <p class="font-arabic text-base leading-loose" dir="rtl">
                      اللَّهُمَّ اجْعَلْ هَذَا العَمَلَ صَدَقَةً جَارِيَةً عَنْهُ، وَعَنْ أَهْلِهِ، وَعَنْ جَمِيعِ المُسْلِمِينَ وَالمُسْلِمَاتِ.
                    </p>
                  </div>
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
