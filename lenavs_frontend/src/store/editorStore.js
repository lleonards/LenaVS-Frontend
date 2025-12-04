import { create } from 'zustand';

export const useEditorStore = create((set, get) => ({
  // Project info
  projectName: '',
  currentProject: null,
  
  // Uploaded files
  audioOriginal: null,
  audioInstrumental: null,
  background: null,
  backgroundType: null, // 'video' or 'image'
  backgroundColor: '#000000',
  
  // Lyrics
  verses: [],
  hasLyrics: false,
  
  // Preview state
  currentTime: 0,
  isPlaying: false,
  duration: 0,
  previewAudioType: 'original', // 'original' or 'instrumental'
  
  // Actions
  setProjectName: (name) => set({ projectName: name }),
  
  setAudioOriginal: (file) => set({ audioOriginal: file }),
  setAudioInstrumental: (file) => set({ audioInstrumental: file }),
  
  setBackground: (file, type) => set({ 
    background: file, 
    backgroundType: type 
  }),
  
  setBackgroundColor: (color) => set({ backgroundColor: color }),
  
  setVerses: (verses) => set({ 
    verses, 
    hasLyrics: verses.length > 0 
  }),
  
  addVerse: (verse) => set((state) => ({
    verses: [...state.verses, verse],
    hasLyrics: true
  })),
  
  updateVerse: (id, updates) => set((state) => ({
    verses: state.verses.map(v => 
      v.id === id ? { ...v, ...updates } : v
    )
  })),
  
  removeVerse: (id) => set((state) => ({
    verses: state.verses.filter(v => v.id !== id)
  })),
  
  reorderVerses: (verses) => set({ verses }),
  
  setCurrentTime: (time) => set({ currentTime: time }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setDuration: (duration) => set({ duration: duration }),
  setPreviewAudioType: (type) => set({ previewAudioType: type }),
  
  resetProject: () => set({
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
  
  loadProject: (project) => set({
    projectName: project.name,
    currentProject: project,
    ...project.data
  })
}));
