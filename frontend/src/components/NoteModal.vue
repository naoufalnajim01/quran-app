<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto" @click.self="close">
      <div class="relative w-full max-w-2xl bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl border-2 border-primary/20 overflow-hidden transform transition-all my-8">
        <!-- Header -->
        <div class="bg-gradient-to-br from-primary/10 via-primary/5 to-background p-6 border-b border-border/50">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="p-2 rounded-lg bg-primary/10">
                <StickyNote :size="24" class="text-primary" />
              </div>
              <div>
                <h3 class="font-arabic-bold text-xl text-foreground">{{ isEditing ? 'تعديل الملاحظة' : 'إضافة ملاحظة' }}</h3>
                <p class="text-xs text-muted-foreground font-arabic mt-1" dir="rtl">
                  {{ ayah.surah_name_ar || 'السورة' }} - الآية {{ ayah.number_in_surah }}
                </p>
              </div>
            </div>
            <button @click="close" class="p-2 rounded-full hover:bg-destructive/20 hover:text-destructive transition-colors">
              <X :size="20" />
            </button>
          </div>
        </div>

        <!-- Body -->
        <div class="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          <!-- Verse Text (Read-only) -->
          <div class="p-4 rounded-xl bg-muted/30 border border-border/50">
            <p class="font-arabic text-right text-lg leading-relaxed text-foreground/90" dir="rtl">
              {{ ayah.text }}
            </p>
          </div>

          <!-- Note Content -->
          <div>
            <label class="block text-sm font-medium mb-2 font-arabic text-right" dir="rtl">
              نص الملاحظة
            </label>
            <textarea
              v-model="noteText"
              dir="rtl"
              rows="5"
              class="w-full px-4 py-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all font-arabic text-right resize-none"
              placeholder="اكتب ملاحظتك هنا..."
            ></textarea>
          </div>

          <!-- Category Selection -->
          <div>
            <label class="block text-sm font-medium mb-2 font-arabic text-right" dir="rtl">
              التصنيف
            </label>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button
                v-for="cat in categories"
                :key="cat.value"
                @click="selectedCategory = cat.value"
                class="p-3 rounded-xl border-2 transition-all font-arabic flex flex-col items-center gap-2"
                :class="selectedCategory === cat.value 
                  ? `border-${cat.color}-500 bg-${cat.color}-50 dark:bg-${cat.color}-950/20` 
                  : 'border-border hover:border-primary/50 bg-background'"
              >
                <component :is="cat.icon" :size="20" :class="`text-${cat.color}-500`" />
                <span class="text-xs">{{ cat.label }}</span>
              </button>
            </div>
          </div>

          <!-- Tags -->
          <div>
            <label class="block text-sm font-medium mb-2 font-arabic text-right" dir="rtl">
              الوسوم (اختياري)
            </label>
            <div class="flex flex-wrap gap-2 mb-2">
              <span
                v-for="(tag, index) in tags"
                :key="index"
                class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-arabic"
              >
                {{ tag }}
                <button @click="removeTag(index)" class="hover:text-destructive">
                  <X :size="14" />
                </button>
              </span>
            </div>
            <div class="flex gap-2">
              <input
                v-model="newTag"
                @keyup.enter="addTag"
                type="text"
                dir="rtl"
                class="flex-1 px-4 py-2 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary focus:border-primary font-arabic"
                placeholder="أضف وسم واضغط Enter"
              />
              <button
                @click="addTag"
                class="px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                <Plus :size="20" />
              </button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-6 border-t border-border/50 bg-muted/20 flex gap-3 justify-end">
          <button
            @click="close"
            class="px-6 py-2.5 rounded-xl border border-border hover:bg-accent transition-colors font-arabic"
          >
            إلغاء
          </button>
          <button
            @click="saveNote"
            :disabled="!noteText.trim()"
            class="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-arabic flex items-center gap-2"
          >
            <Save :size="18" />
            {{ isEditing ? 'تحديث' : 'حفظ' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue'
import { X, StickyNote, Save, Plus, Lightbulb, Star, BookMarked, AlertCircle } from 'lucide-vue-next'

const props = defineProps({
  show: Boolean,
  ayah: {
    type: Object,
    required: true
  },
  existingNote: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

const noteText = ref('')
const selectedCategory = ref('general')
const tags = ref([])
const newTag = ref('')
const isEditing = ref(false)

const categories = [
  { value: 'general', label: 'عامة', icon: StickyNote, color: 'blue' },
  { value: 'reflection', label: 'تأمل', icon: Lightbulb, color: 'amber' },
  { value: 'memorization', label: 'حفظ', icon: BookMarked, color: 'emerald' },
  { value: 'important', label: 'مهم', icon: AlertCircle, color: 'rose' }
]

watch(() => props.show, (newVal) => {
  if (newVal && props.existingNote) {
    isEditing.value = true
    noteText.value = props.existingNote.text
    selectedCategory.value = props.existingNote.category || 'general'
    tags.value = props.existingNote.tags || []
  } else {
    resetForm()
  }
})

const addTag = () => {
  if (newTag.value.trim() && !tags.value.includes(newTag.value.trim())) {
    tags.value.push(newTag.value.trim())
    newTag.value = ''
  }
}

const removeTag = (index) => {
  tags.value.splice(index, 1)
}

const resetForm = () => {
  noteText.value = ''
  selectedCategory.value = 'general'
  tags.value = []
  newTag.value = ''
  isEditing.value = false
}

const saveNote = () => {
  const note = {
    id: props.existingNote?.id || `note_${Date.now()}`,
    ayahId: `${props.ayah.surah_id}:${props.ayah.number_in_surah}`,
    text: noteText.value,
    category: selectedCategory.value,
    tags: tags.value,
    timestamp: Date.now(),
    ayah: {
      surah_id: props.ayah.surah_id,
      number_in_surah: props.ayah.number_in_surah,
      text: props.ayah.text,
      surah_name_ar: props.ayah.surah_name_ar
    }
  }
  
  emit('save', note)
  close()
}

const close = () => {
  resetForm()
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
</style>
