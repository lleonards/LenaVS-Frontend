import React from 'react';
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
  Check
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

  // ===============================
  // AUDIO
  // ===============================
  const handleAudioUpload = async (file, type) => {
    try {
      const response = await uploadService.audio(file);

      const fileData = {
        ...response.data.file,
        url: response.data.file.path
      };

      if (type === 'original') {
        setAudioOriginal(fileData);
      } else {
        setAudioInstrumental(fileData);
      }
    } catch (error) {
      console.error('Erro upload áudio:', error);
      alert('Erro ao fazer upload do áudio');
    }
  };

  // ===============================
  // MEDIA (VIDEO / IMAGE)
  // ===============================
  const handleMediaUpload = async (file, type) => {
    try {
      const response = await uploadService.media(file, type);

      const fileData = {
        ...response.data.file,
        url: response.data.file.path,
        type
      };

      setBackground(fileData);
    } catch (error) {
      console.error('Erro upload mídia:', error);
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
    } catch (error) {
      console.error('Erro upload letra:', error);
      alert('Erro ao fazer upload da letra');
    }
  };

  // ===============================
  // DROPZONES
  // ===============================
  const AudioOriginalDropzone = useDropzone({
    accept: { 'audio/*': [] },
    maxFiles: 1,
    onDrop: files => handleAudioUpload(files[0], 'original')
  });

  const AudioInstrumentalDropzone = useDropzone({
    accept: { 'audio/*': [] },
    maxFiles: 1,
    onDrop: files => handleAudioUpload(files[0], 'instrumental')
  });

  const VideoDropzone = useDropzone({
    accept: { 'video/*': [] },
    maxFiles: 1,
    onDrop: files => handleMediaUpload(files[0], 'video')
  });

  const ImageDropzone = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: files => handleMediaUpload(files[0], 'image')
  });

  const LyricsDropzone = useDropzone({
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    onDrop: files => handleLyricsUpload(files[0])
  });

  // ===============================
  // RENDER
  // ===============================
  return (
    <div className="upload-panel">
      <h2 className="panel-title">Arquivos</h2>

      {/* AUDIO ORIGINAL */}
      <div className="upload-section">
        <h3 className="section-title">
          <Music size={18} /> Música Original
        </h3>
        <div
          {...AudioOriginalDropzone.getRootProps()}
          className={`dropzone ${audioOriginal ? 'uploaded' : ''}`}
        >
          <input {...AudioOriginalDropzone.getInputProps()} />
          {audioOriginal ? (
            <>
              <Check size={24} className="check-icon" />
              <span className="file-name">{audioOriginal.originalName}</span>
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
        <div
          {...AudioInstrumentalDropzone.getRootProps()}
          className={`dropzone ${audioInstrumental ? 'uploaded' : ''}`}
        >
          <input {...AudioInstrumentalDropzone.getInputProps()} />
          {audioInstrumental ? (
            <>
              <Check size={24} className="check-icon" />
              <span className="file-name">{audioInstrumental.originalName}</span>
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
        <div
          {...VideoDropzone.getRootProps()}
          className={`dropzone ${background?.type === 'video' ? 'uploaded' : ''}`}
        >
          <input {...VideoDropzone.getInputProps()} />
          {background?.type === 'video' ? (
            <>
              <Check size={24} className="check-icon" />
              <span className="file-name">{background.originalName}</span>
            </>
          ) : (
            <>
              <Upload size={24} />
              <span>Arraste ou clique</span>
            </>
          )}
        </div>
      </div>

      {/* IMAGE */}
      <div className="upload-section">
        <h3 className="section-title">
          <Image size={18} /> Imagem (Opcional)
        </h3>
        <div
          {...ImageDropzone.getRootProps()}
          className={`dropzone ${background?.type === 'image' ? 'uploaded' : ''}`}
        >
          <input {...ImageDropzone.getInputProps()} />
          {background?.type === 'image' ? (
            <>
              <Check size={24} className="check-icon" />
              <span className="file-name">{background.originalName}</span>
            </>
          ) : (
            <>
              <Upload size={24} />
              <span>Arraste ou clique</span>
            </>
          )}
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

        <button
          className="text-button"
          onClick={async () => {
            const text = prompt('Cole ou digite a letra da música:');
            if (!text) return;

            try {
              const response = await uploadService.lyricsText(text);
              setVerses(response.data.lyrics);
            } catch {
              alert('Erro ao processar letra');
            }
          }}
        >
          Colar texto manualmente
        </button>
      </div>
    </div>
  );
}

export default UploadPanel;
