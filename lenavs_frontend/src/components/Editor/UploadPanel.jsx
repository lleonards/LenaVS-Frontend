import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useEditorStore } from '../../store/editorStore';
import { uploadService } from '../../api/services';
import {
  Music,
  FileMusic,
  Image,
  Video,
  FileText,
  Upload,
  Check,
  X
} from 'lucide-react';
import './UploadPanel.css';

function UploadPanel() {
  const {
    audioOriginal,
    audioInstrumental,
    background,
    setAudioOriginal,
    setAudioInstrumental,
    setBackground,
    setVerses
  } = useEditorStore();

  const [showLyricsModal, setShowLyricsModal] = useState(false);
  const [lyricsText, setLyricsText] = useState('');

  // ===============================
  // AUDIO
  // ===============================
  const handleAudioUpload = async (file, type) => {
    try {
      const response = await uploadService.audio(file, type);
      const fileData = {
        ...response.data.file,
        url: response.data.file.path
      };

      type === 'original'
        ? setAudioOriginal(fileData)
        : setAudioInstrumental(fileData);
    } catch {
      alert('Erro ao fazer upload do áudio');
    }
  };

  // ===============================
  // MEDIA
  // ===============================
  const handleMediaUpload = async (file, type) => {
    try {
      const response = await uploadService.media(file, type);
      setBackground({
        ...response.data.file,
        url: response.data.file.path,
        type
      });
    } catch {
      alert('Erro ao fazer upload da mídia');
    }
  };

  // ===============================
  // LYRICS FILE
  // ===============================
  const handleLyricsUpload = async (file) => {
    try {
      const response = await uploadService.lyricsFile(file);
      setVerses(response.data.lyrics);
    } catch {
      alert('Erro ao fazer upload da letra');
    }
  };

  // ===============================
  // DROPZONES
  // ===============================
  const AudioOriginalDropzone = useDropzone({
    accept: { 'audio/*': [] },
    maxFiles: 1,
    onDrop: ([file]) => handleAudioUpload(file, 'original')
  });

  const AudioInstrumentalDropzone = useDropzone({
    accept: { 'audio/*': [] },
    maxFiles: 1,
    onDrop: ([file]) => handleAudioUpload(file, 'instrumental')
  });

  const VideoDropzone = useDropzone({
    accept: { 'video/*': [] },
    maxFiles: 1,
    onDrop: ([file]) => handleMediaUpload(file, 'video')
  });

  const ImageDropzone = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: ([file]) => handleMediaUpload(file, 'image')
  });

  const LyricsDropzone = useDropzone({
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    onDrop: ([file]) => handleLyricsUpload(file)
  });

  // ===============================
  // MANUAL TEXT
  // ===============================
  const handleSubmitLyricsText = async () => {
    if (!lyricsText.trim()) return;

    try {
      const response = await uploadService.lyricsText(lyricsText);
      setVerses(response.data.lyrics);
      setLyricsText('');
      setShowLyricsModal(false);
    } catch {
      alert('Erro ao processar letra');
    }
  };

  return (
    <div className="upload-panel">
      <h2 className="panel-title">Arquivos</h2>

      {/* LYRICS */}
      <div className="upload-section">
        <h3 className="section-title">
          <FileText size={18} /> Letra
        </h3>

        <div {...LyricsDropzone.getRootProps()} className="dropzone">
          <input {...LyricsDropzone.getInputProps()} />
          <Upload size={24} />
          <span>Arraste arquivo ou clique</span>
        </div>

        <div className="divider">ou</div>

        <button
          className="text-button"
          onClick={() => setShowLyricsModal(true)}
        >
          Colar texto manualmente
        </button>
      </div>

      {/* MODAL */}
      {showLyricsModal && (
        <div className="lyrics-modal-backdrop">
          <div className="lyrics-modal">
            <div className="modal-header">
              <h3>Colar letra da música</h3>
              <button onClick={() => setShowLyricsModal(false)}>
                <X size={18} />
              </button>
            </div>

            <textarea
              value={lyricsText}
              onChange={(e) => setLyricsText(e.target.value)}
              placeholder="Cole a letra aqui, com Enter normal entre os versos..."
              rows={12}
            />

            <div className="modal-actions">
              <button onClick={handleSubmitLyricsText}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadPanel;
