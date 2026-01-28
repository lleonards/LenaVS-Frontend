import { create } from 'zustand';

// 🎨 ESTILO PADRÃO (garantia total)
const DEFAULT_STYLE = {
  fontFamily: 'Montserrat',
  fontSize: 48,
  color: '#FFFFFF',
  outlineColor: '#000000',
  outlineWidth: 2,
  bold: false,
  italic: false,
  underline: false,
  alignment: 'center',
  transition: 'fade'
};

// ✂️ Processa letra colada manualmente
const processPastedLyrics = (text) => {
  if (!text || typeof text !== 'string') {
    return { verses: [], autoSeparated: false };
  }

  const normalized = text.replace(/\r\n/g, '\n').trim();

  // 🧠 Caso 1: usuário já separou por estrofes (linha em branco)
  let blocks = normalized.split(/\n\s*\n/).filter(Boolean);
  let autoSeparated = false;

  // 🧠 Caso 2: não tem estrofes → separar a cada 4 linhas
  if (blocks.length === 1) {
    const lines = normalized.split('\n').filter(l => l.trim() !== '');

    if (lines.length > 4) {
      autoSeparated = true;
      blocks = [];

      for (let i = 0; i < lines.length; i += 4) {
        blocks.push(lines.slice(i, i + 4).join('\n'));
      }
    }
  }

  const verses = blocks.map((block, index) => ({
    id: crypto.randomUUID(),
    text: block.trim(),
    order: index,
    startTime: '',
    endTime: '',
    style: { ...DEFAULT_STYLE }
  }));

  return { verses, autoSeparated };
};

export const useEditorStore = create((set, get) => ({
  // =========================
  // Project info
  // =========================
  projectName: '',
  currentProject: null,

  // =========================
  // Uploaded files
  // =========================
  audioOriginal: null,
  audioInstrumental: null,
  background: null,
  backgroundType: null,
  backgroundColor: '#000000',

  // =========================
  // Lyrics
  // =========================
  verses: [],
  hasLyrics: false,

  // =========================
  // Preview
  // =========================
  currentTime: 0,
  isPlaying: false,
  duration: 0,
  previewAudioType: 'original',

  // =========================
  // Actions
  // =========================
  setProjectName: (name) => set({ projectName: name }),

  setAudioOriginal: (file) => set({ audioOriginal: file }),
  setAudioInstrumental: (file) => set({ audioInstrumental: file }),

  setBackground: (file, type) =>
    set({ background: file, backgroundType: type }),

  setBackgroundColor: (color) => set({ backgroundColor: color }),

  // 🔥 USADO PELO UPLOAD DE ARQUIVO
  setVerses: (verses) =>
    set({
      verses: verses.map((v, i) => ({
        ...v,
        id: v.id || crypto.randomUUID(),
        order: i,
        style: { ...DEFAULT_STYLE, ...(v.style || {}) }
      })),
      hasLyrics: verses.length > 0
    }),

  // 🔥 USADO PELO BOTÃO "COLAR TEXTO"
  setLyricsFromText: (text) => {
    const { verses, autoSeparated } = processPastedLyrics(text);

    set({
      verses,
      hasLyrics: verses.length > 0
    });

    if (autoSeparated) {
      setTimeout(() => {
        alert(
          'A letra não estava separada em estrofes.\n' +
          'O sistema dividiu automaticamente em blocos de 4 linhas.'
        );
      }, 100);
    }
  },

  addVerse: (verse) =>
    set((state) => ({
      verses: [
        ...state.verses,
        {
          ...verse,
          id: verse.id || crypto.randomUUID(),
          order: state.verses.length,
          style: { ...DEFAULT_STYLE, ...(verse.style || {}) }
        }
      ],
      hasLyrics: true
    })),

  updateVerse: (id, updates) =>
    set((state) => ({
      verses: state.verses.map((v) =>
        v.id === id
          ? {
              ...v,
              ...updates,
              style: {
                ...DEFAULT_STYLE,
                ...(v.style || {}),
                ...(updates.style || {})
              }
            }
          : v
      )
    })),

  removeVerse: (id) =>
    set((state) => ({
      verses: state.verses.filter((v) => v.id !== id)
    })),

  reorderVerses: (verses) =>
    set({
      verses: verses.map((v, i) => ({
        ...v,
        id: v.id || crypto.randomUUID(),
        order: i,
        style: { ...DEFAULT_STYLE, ...(v.style || {}) }
      }))
    }),

  // =========================
  // Player
  // =========================
  setCurrentTime: (time) => set({ currentTime: time }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setDuration: (duration) => set({ duration }),
  setPreviewAudioType: (type) => set({ previewAudioType: type }),

  // =========================
  // Reset / Load
  // =========================
  resetProject: () =>
    set({
      projectName: '',
      currentProject: null,
      audioOriginal: null,
      audioInstrumental: null,
      background: null,
      backgroundType: null,
      backgroundColor: '#000000',
      verses: [],
      hasLyrics: false,
      currentTime: 0,
      isPlaying: false,
      duration: 0,
      previewAudioType: 'original'
    }),

  loadProject: (project) =>
    set({
      projectName: project.name,
      currentProject: project,
      ...project.data
    })
}));
