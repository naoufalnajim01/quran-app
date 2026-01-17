import { defineStore } from 'pinia'
import axios from 'axios'

const isProduction = window.location.hostname !== 'localhost'
const API_URL = isProduction ? 'https://quran.connectapps.org/api/public' : 'http://localhost:8000'
const TRANSLATION_API = 'https://alquran-api.pages.dev/api/quran'

const sanitizeSearchQuery = (query) => {
    if (typeof query !== 'string') return ''
    return query
        .trim()
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<[^>]*>/g, '')
        .replace(/javascript:/gi, '')
        .substring(0, 200)
}

const checkRateLimit = (key, maxRequests = 30, windowMs = 60000) => {
    const now = Date.now()
    const stored = sessionStorage.getItem(`rl_${key}`)
    let requests = stored ? JSON.parse(stored) : []
    requests = requests.filter(time => time > now - windowMs)
    if (requests.length >= maxRequests) return false
    requests.push(now)
    sessionStorage.setItem(`rl_${key}`, JSON.stringify(requests))
    return true
}

const validateNote = (note) => {
    if (!note || typeof note !== 'object') return null
    return {
        id: note.id || `note_${Date.now()}`,
        ayahId: String(note.ayahId || ''),
        text: String(note.text || '').substring(0, 5000),
        category: ['general', 'reflection', 'memorization', 'important'].includes(note.category)
            ? note.category : 'general',
        tags: Array.isArray(note.tags)
            ? note.tags.slice(0, 10).map(t => String(t).substring(0, 50)) : [],
        timestamp: note.timestamp || Date.now(),
        surahId: parseInt(note.surahId, 10) || null,
        ayahNumber: parseInt(note.ayahNumber, 10) || null
    }
}

export const useQuranStore = defineStore('quran', {
    state: () => ({
        surahs: [],
        surahNamesTashkeel: {},
        ayahs: [],
        currentSurah: null,
        currentPlayingAyahId: null,
        currentAudio: null,
        isPlaying: false,
        selectedReciter: localStorage.getItem('selectedReciter') || 'ar.alafasy',
        availableReciters: [
            { id: 'ar.alafasy', name: 'مشاري العفاسي', folder: 'Alafasy_128kbps' },
            { id: 'ar.abdulbasit', name: 'عبد الباسط', folder: 'Abdul_Basit_Murattal_192kbps' },
            { id: 'ar.husary', name: 'محمود الحصري', folder: 'Husary_128kbps' },
            { id: 'ar.minshawi', name: 'محمد المنشاوي', folder: 'Minshawy_Murattal_128kbps' },
            { id: 'ar.sudais', name: 'عبدالرحمن السديس', folder: 'Abdurrahmaan_As-Sudais_192kbps' },
            { id: 'ar.shuraim', name: 'سعود الشريم', folder: 'Saood_ash-Shuraym_128kbps' },
            { id: 'ar.ajamy', name: 'أحمد العجمي', folder: 'Ahmed_ibn_Ali_al-Ajamy_128kbps_ketaballah.net' },
            { id: 'ar.maher', name: 'ماهر المعيقلي', folder: 'MaherAlMuaiqly128kbps' },
            { id: 'ar.ghamdi', name: 'سعد الغامدي', folder: 'Ghamadi_40kbps' },
            { id: 'ar.dosari', name: 'ياسر الدوسري', folder: 'Yasser_Ad-Dussary_128kbps' }
        ],
        selectedLanguage: localStorage.getItem('quranLanguage') || 'ar',
        availableLanguages: [
            { code: 'ar', name: 'Arabic', nativeName: 'العربية', edition: null },
            { code: 'en', name: 'English', nativeName: 'English', edition: 'en.sahih' },
            { code: 'fr', name: 'French', nativeName: 'Français', edition: 'fr.hamidullah' },
            { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', edition: 'id.indonesian' },
            { code: 'ru', name: 'Russian', nativeName: 'Русский', edition: 'ru.kuliev' },
            { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', edition: 'tr.diyanet' },
            { code: 'transliteration', name: 'Transliteration', nativeName: 'Translitération', edition: 'en.transliteration' }
        ],
        translations: {},
        loading: false,
        error: null,
        fontSize: parseInt(localStorage.getItem('quranFontSize')) || 32,
        darkMode: localStorage.getItem('darkMode') === 'true',
        searchQuery: '',
        bookmarks: JSON.parse(localStorage.getItem('bookmarks') || '[]'),
        searchResults: [],
        isSearching: false,
        autoPlayEnabled: false,
        revelationFilter: 'all',
        showKeyboard: false,
        quranData: null,
        readingMode: false,
        selectedTafsirId: 'ar-tafsir-muyassar',
        tafsirData: {},
        isTafsirLoading: false,
        availableTafsirs: [
            { id: 'ar-tafsir-muyassar', name: 'التفسير الميسر' },
            { id: 'ar-tafsir-ibn-kathir', name: 'تفسير ابن كثير' },
            { id: 'ar-tafsir-al-jalalayn', name: 'تفسير الجلالين' },
            { id: 'ar-tafsir-al-saddi', name: 'تفسير السعدي' },
            { id: 'ar-tafsir-al-baghawi', name: 'تفسير البغوي' },
            { id: 'ar-tafsir-al-qurtubi', name: 'تفسير القرطبي' },
            { id: 'ar-tafsir-al-tabari', name: 'تفسير الطبري' }
        ],
        notes: JSON.parse(localStorage.getItem('quran_notes') || '[]'),
        noteCategories: [
            { value: 'general', label: 'عامة', color: 'blue' },
            { value: 'reflection', label: 'تأمل', color: 'amber' },
            { value: 'memorization', label: 'حفظ', color: 'emerald' },
            { value: 'important', label: 'مهم', color: 'rose' }
        ],
        readHistory: JSON.parse(localStorage.getItem('quran_read_history') || '{}')
    }),

    getters: {
        filteredSurahs() {
            let result = this.surahs

            if (this.searchQuery) {
                const q = this.searchQuery.toLowerCase()
                result = result.filter(s =>
                    s.name_ar?.includes(this.searchQuery) ||
                    s.name_en?.toLowerCase().includes(q) ||
                    s.number?.toString() === q
                )
            }

            if (this.revelationFilter !== 'all') {
                result = result.filter(s => s.type === this.revelationFilter)
            }

            return result
        }
    },

    actions: {
        async fetchTafsir(surahId) {
            const cacheKey = `${this.selectedTafsirId}_${surahId}`
            if (this.tafsirData[cacheKey]) return

            this.isTafsirLoading = true
            try {
                const response = await axios.get(`https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/${this.selectedTafsirId}/${surahId}.json`)
                const tafsirMap = {}
                response.data.ayahs.forEach(item => {
                    tafsirMap[item.ayah] = item.text
                })
                this.tafsirData[cacheKey] = tafsirMap
            } catch (error) {
                console.error('Failed to fetch tafsir:', error)
            } finally {
                this.isTafsirLoading = false
            }
        },

        getAyahTafsir(surahId, ayahNumber) {
            const cacheKey = `${this.selectedTafsirId}_${surahId}`
            if (!this.tafsirData[cacheKey]) return null
            return this.tafsirData[cacheKey][ayahNumber] || null
        },

        async loadSurahNamesTashkeel() {
            try {
                const response = await axios.get('/surah-names-tashkeel.json')
                this.surahNamesTashkeel = response.data
            } catch (error) {
                console.error('Failed to load tashkeel names:', error)
            }
        },

        toggleBookmark(ayah) {
            const index = this.bookmarks.findIndex(b => b.id === ayah.id)
            if (index !== -1) {
                this.bookmarks.splice(index, 1)
            } else {
                this.bookmarks.push({
                    id: ayah.id,
                    surah_id: ayah.surah_id,
                    number_in_surah: ayah.number_in_surah,
                    text: ayah.text?.substring(0, 100),
                    timestamp: Date.now()
                })
            }
            localStorage.setItem('bookmarks', JSON.stringify(this.bookmarks))
        },

        checkBookmarked(ayahId) {
            return this.bookmarks.some(b => b.id === ayahId)
        },

        async searchAyahs(query) {
            const sanitizedQuery = sanitizeSearchQuery(query)

            if (!sanitizedQuery || sanitizedQuery.length < 2) {
                this.searchResults = []
                return
            }

            if (!checkRateLimit('search', 20, 60000)) {
                this.error = 'الرجاء الانتظار قليلا'
                return
            }

            this.isSearching = true
            this.error = null

            try {
                if (!this.quranData) {
                    const response = await axios.get('/quran-full.json')
                    this.quranData = response.data
                }

                const removeTashkeel = (text) => {
                    return text.replace(/[\u064B-\u065F\u0670]/g, "")
                }

                const results = []
                const normalizedQuery = removeTashkeel(sanitizedQuery)

                // quranData est directement un tableau de sourates
                const surahs = Array.isArray(this.quranData) ? this.quranData : this.quranData.surahs || []

                for (const surah of surahs) {
                    for (const ayah of (surah.verses || surah.ayahs || [])) {
                        const normalizedText = removeTashkeel(ayah.text)
                        if (normalizedText.includes(normalizedQuery)) {
                            results.push({
                                ...ayah,
                                surah_id: surah.id || surah.number,
                                surah_name: surah.transliteration || surah.name_en || surah.name,
                                surah_name_ar: surah.name || surah.name_ar
                            })
                        }
                        if (results.length >= 50) break
                    }
                    if (results.length >= 50) break
                }

                this.searchResults = results
            } catch (error) {
                this.error = 'حدث خطأ في البحث'
                console.error('Search error:', error)
            } finally {
                this.isSearching = false
            }
        },

        async fetchSurahs() {
            // Valider selectedReciter au cas où localStorage contient une ancienne valeur
            const validReciters = this.availableReciters.map(r => r.id)
            if (!validReciters.includes(this.selectedReciter)) {
                this.selectedReciter = 'ar.alafasy'
                localStorage.setItem('selectedReciter', 'ar.alafasy')
            }

            this.loading = true
            this.error = null
            try {
                const response = await axios.get(`${API_URL}/surahs?per_page=114`)

                const versesCount = [
                    7, 286, 200, 176, 120, 165, 206, 75, 129, 109,
                    123, 111, 43, 52, 99, 128, 111, 110, 98, 135,
                    112, 78, 118, 64, 77, 227, 93, 88, 69, 60,
                    34, 30, 73, 54, 45, 83, 182, 88, 75, 85,
                    54, 53, 89, 59, 37, 35, 38, 29, 18, 45,
                    60, 49, 62, 55, 78, 96, 29, 22, 24, 13,
                    14, 11, 11, 18, 12, 12, 30, 52, 52, 44,
                    28, 28, 20, 56, 40, 31, 50, 40, 46, 42,
                    29, 19, 36, 25, 22, 17, 19, 26, 30, 20,
                    15, 21, 11, 8, 8, 19, 5, 8, 8, 11,
                    11, 8, 3, 9, 5, 4, 7, 3, 6, 3,
                    5, 4, 5, 6
                ]

                this.surahs = response.data.data.map((surah, index) => ({
                    ...surah,
                    verses_count: versesCount[index] || 0,
                    total_verses: versesCount[index] || 0
                }))
            } catch (error) {
                this.error = 'فشل تحميل السور'
                console.error('Error fetching surahs:', error)
            } finally {
                this.loading = false
            }
        },

        async fetchAyahs(surahNumber) {
            this.loading = true
            this.error = null
            try {
                const response = await axios.get(`${API_URL}/ayahs?surah=${surahNumber}&per_page=300`)
                this.ayahs = response.data.data

                if (this.selectedLanguage !== 'ar') {
                    await this.fetchTranslation(surahNumber)
                }
            } catch (error) {
                this.error = 'فشل تحميل الآيات'
                console.error('Error fetching ayahs:', error)
            } finally {
                this.loading = false
            }
        },

        async fetchTranslation(surahNumber) {
            const lang = this.availableLanguages.find(l => l.code === this.selectedLanguage)
            if (!lang || !lang.edition) return

            if (this.translations[surahNumber]) return

            try {
                const response = await axios.get(`${TRANSLATION_API}/${lang.edition}/${surahNumber}`)
                const translationMap = {}
                response.data.forEach(item => {
                    translationMap[item.verse] = item.text
                })
                this.translations[surahNumber] = translationMap
            } catch (error) {
                console.error('Error fetching translation:', error)
            }
        },

        setLanguage(langCode) {
            this.selectedLanguage = langCode
            localStorage.setItem('quranLanguage', langCode)
            this.translations = {}

            if (this.currentSurah && langCode !== 'ar') {
                this.fetchTranslation(this.currentSurah.number)
            }
        },

        playAyah(ayah) {
            if (this.currentAudio) {
                this.currentAudio.pause()
                this.currentAudio = null
            }

            if (this.currentPlayingAyahId === ayah.id && this.isPlaying) {
                this.isPlaying = false
                this.currentPlayingAyahId = null
                return
            }

            const reciter = this.availableReciters.find(r => r.id === this.selectedReciter)
            const folder = reciter?.folder || 'Alafasy_128kbps'

            const surahNum = String(ayah.surah_id).padStart(3, '0')
            const ayahNum = String(ayah.number_in_surah).padStart(3, '0')
            const audioUrl = `https://everyayah.com/data/${folder}/${surahNum}${ayahNum}.mp3`

            const audio = new Audio(audioUrl)
            this.currentAudio = audio
            this.currentPlayingAyahId = ayah.id
            this.isPlaying = true

            audio.play().catch(error => {
                console.error('Audio playback error:', error)
                this.isPlaying = false
            })

            audio.onended = () => {
                this.isPlaying = false

                if (this.autoPlayEnabled) {
                    const currentIndex = this.ayahs.findIndex(a => a.id === ayah.id)
                    if (currentIndex !== -1 && currentIndex < this.ayahs.length - 1) {
                        const nextAyah = this.ayahs[currentIndex + 1]
                        setTimeout(() => this.playAyah(nextAyah), 500)
                    }
                }
            }
        },

        setReciter(reciterId) {
            this.selectedReciter = reciterId
            localStorage.setItem('selectedReciter', reciterId)

            if (this.currentAudio) {
                this.currentAudio.pause()
                this.currentAudio = null
                this.isPlaying = false
            }
        },

        toggleAutoPlay() {
            this.autoPlayEnabled = !this.autoPlayEnabled
        },

        setFontSize(size) {
            this.fontSize = size
            localStorage.setItem('quranFontSize', size)
        },

        toggleDarkMode() {
            this.darkMode = !this.darkMode
            localStorage.setItem('darkMode', this.darkMode)
            if (this.darkMode) {
                document.documentElement.classList.add('dark')
            } else {
                document.documentElement.classList.remove('dark')
            }
        },

        initDarkMode() {
            if (this.darkMode) {
                document.documentElement.classList.add('dark')
            } else {
                document.documentElement.classList.remove('dark')
            }
        },

        saveNote(note) {
            const validatedNote = validateNote(note)
            if (!validatedNote) return

            const existingIndex = this.notes.findIndex(n => n.id === validatedNote.id)
            if (existingIndex !== -1) {
                this.notes[existingIndex] = validatedNote
            } else {
                this.notes.push(validatedNote)
            }
            localStorage.setItem('quran_notes', JSON.stringify(this.notes))
        },

        deleteNote(noteId) {
            this.notes = this.notes.filter(n => n.id !== noteId)
            localStorage.setItem('quran_notes', JSON.stringify(this.notes))
        },

        getNoteForAyah(surahId, ayahNumber) {
            const ayahId = `${surahId}:${ayahNumber}`
            return this.notes.find(note => note.ayahId === ayahId)
        },

        getNotesByCategory(category) {
            if (!category || category === 'all') return this.notes
            return this.notes.filter(note => note.category === category)
        },

        getNotesByTag(tag) {
            return this.notes.filter(note => note.tags && note.tags.includes(tag))
        },

        getAllTags() {
            const allTags = new Set()
            this.notes.forEach(note => {
                if (note.tags) {
                    note.tags.forEach(tag => allTags.add(tag))
                }
            })
            return Array.from(allTags)
        },

        markAyahAsRead(surahId, ayahNumber) {
            const ayahId = `${surahId}:${ayahNumber}`
            if (!this.readHistory[ayahId]) {
                this.readHistory[ayahId] = {
                    timestamp: Date.now(),
                    surahId: surahId,
                    ayahNumber: ayahNumber
                }
                localStorage.setItem('quran_read_history', JSON.stringify(this.readHistory))
            }
        },

        isAyahRead(surahId, ayahNumber) {
            const ayahId = `${surahId}:${ayahNumber}`
            return !!this.readHistory[ayahId]
        },

        getReadProgress() {
            const totalAyats = 6236
            const readCount = Object.keys(this.readHistory).length
            return {
                read: readCount,
                total: totalAyats,
                percentage: ((readCount / totalAyats) * 100).toFixed(1)
            }
        }
    }
})
