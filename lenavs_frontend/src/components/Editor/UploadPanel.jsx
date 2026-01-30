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
    setVerses,
    setLyricsFromText
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
  // LYRICS FILE (UPLOAD CORRIGIDO)
  // ===============================
  const handleLyricsUpload = async (file) => {
    try {
      const response = await uploadService.lyricsFile(file);

      // 🔥 compatível com qualquer retorno do service
      const lyrics = response.data?.lyrics || response.lyrics;

      if (!lyrics || !Array.isArray(lyrics)) {
        throw new Error('Formato inválido de letra');
      }

      setVerses(lyrics);
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
  // MANUAL LYRICS (CORRETO)
  // ===============================
  const submitLyricsText = () => {
    if (!lyricsText.trim()) return;

    // 🔥 toda a lógica está no editorStore
    setLyricsFromText(lyricsText);

    setLyricsText('');
    setShowLyricsModal(false);
  };

  return (
    <div className="upload-panel">
      <h2 className="panel-title">Arquivos</h2>

      {/* AUDIO ORIGINAL */}
      <div className="upload-section">
        <h3 className="section-title">
          <Music size={18} /> Música Original
        </h3>
        <div {...AudioOriginalDropzone.getRootProps()} className={`dropzone ${audioOriginal ? 'uploaded' : ''}`}>
          <input {...AudioOriginalDropzone.getInputProps()} />
          {audioOriginal ? (
            <>
              <Check size={24} />
              <span>{audioOriginal.originalName}</span>
            </>
          ) : (
            <>
              <Upload size={24} />
              <span>Arraste ou clique</span>
            </>
          )}
        </div>
      </div>

      {/* AUDIO INSTRUMENTAL */}
      <div className="upload-section">
        <h3 className="section-title">
          <FileMusic size={18} /> Música Instrumental
        </h3>
        <div {...AudioInstrumentalDropzone.getRootProps()} className={`dropzone ${audioInstrumental ? 'uploaded' : ''}`}>
          <input {...AudioInstrumentalDropzone.getInputProps()} />
          {audioInstrumental ? (
            <>
              <Check size={24} />
              <span>{audioInstrumental.originalName}</span>
            </>
          ) : (
            <>
              <Upload size={24} />
              <span>Arraste ou clique</span>
            </>
          )}
        </div>
      </div>

      {/* VIDEO */}
      <div className="upload-section">
        <h3 className="section-title">
          <Video size={18} /> Vídeo (Opcional)
        </h3>
        <div {...VideoDropzone.getRootProps()} className={`dropzone ${background?.type === 'video' ? 'uploaded' : ''}`}>
          <input {...VideoDropzone.getInputProps()} />
          <Upload size={24} />
          <span>Arraste ou clique</span>
        </div>
      </div>

      {/* IMAGE */}
      <div className="upload-section">
        <h3 className="section-title">
          <Image size={18} /> Imagem (Opcional)
        </h3>
        <div {...ImageDropzone.getRootProps()} className={`dropzone ${background?.type === 'image' ? 'uploaded' : ''}`}>
          <input {...ImageDropzone.getInputProps()} />
          <Upload size={24} />
          <span>Arraste ou clique</span>
        </div>
      </div>

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

        <button className="text-button" onClick={() => setShowLyricsModal(true)}>
          Colar texto manualmente
        </button>
      </div>

      {/* MODAL LETRA */}
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
              rows={16}
              value={lyricsText}
              onChange={(e) => setLyricsText(e.target.value)}
              placeholder="Cole a letra aqui. Use ENTER para quebra de linha e uma linha em branco entre estrofes."
            />

            <div className="modal-actions">
              <button onClick={submitLyricsText}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadPanel;
