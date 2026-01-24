import React, { useState } from 'react';
import { useEditorStore } from '../../store/editorStore';
import { exportService } from '../../api/services';
import { Download, FileVideo, Music } from 'lucide-react';
import './ExportPanel.css';

function ExportPanel() {
  const {
    projectName,
    audioOriginal,
    audioInstrumental,
    background,
    backgroundType,
    backgroundColor,
    verses,
    duration,
    setProjectName
  } = useEditorStore();

  const [audioType, setAudioType] = useState('original');
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (!projectName) {
      alert('Por favor, defina um nome para o projeto');
      return;
    }

    if (!audioOriginal && !audioInstrumental) {
      alert('Por favor, faça upload de pelo menos um áudio');
      return;
    }

    if (verses.length === 0) {
      alert('Por favor, adicione letras ao projeto');
      return;
    }

    setExporting(true);

    try {
      const response = await exportService.video({
        projectName,
        audioType,
        audioOriginalPath: audioOriginal?.path,
        audioInstrumentalPath: audioInstrumental?.path,
        backgroundPath: background?.path,
        backgroundType,
        backgroundColor,
        verses,
        videoDuration: duration
      });

      const filePath = response?.data?.downloadUrl;

      if (!filePath) {
        throw new Error('URL de download não retornada pelo servidor');
      }

      // 🔥 GARANTE URL ABSOLUTA (corrige o bug real)
      const downloadUrl = filePath.startsWith('http')
        ? filePath
        : `${window.location.origin}${filePath}`;

      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${projectName}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      alert('Vídeo gerado com sucesso!');
    } catch (error) {
      console.error('EXPORT ERROR:', error);
      alert(
        'Erro ao gerar vídeo: ' +
          (error.response?.data?.error || error.message)
      );
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="export-panel">
      <h2 className="panel-title">Exportar Vídeo</h2>

      <div className="export-section">
        <label className="export-label">
          <FileVideo size={18} />
          Nome do Projeto
        </label>
        <input
          type="text"
          className="project-name-input"
          placeholder="Meu Projeto"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
      </div>

      <div className="export-section">
        <label className="export-label">
          <Music size={18} />
          Áudio para Exportar
        </label>

        <div className="audio-options">
          <label className="radio-option">
            <input
              type="radio"
              name="audioType"
              value="original"
              checked={audioType === 'original'}
              onChange={(e) => setAudioType(e.target.value)}
              disabled={!audioOriginal}
            />
            <span>Música Original</span>
          </label>

          <label className="radio-option">
            <input
              type="radio"
              name="audioType"
              value="instrumental"
              checked={audioType === 'instrumental'}
              onChange={(e) => setAudioType(e.target.value)}
              disabled={!audioInstrumental}
            />
            <span>Música Instrumental</span>
          </label>
        </div>
      </div>

      <div className="export-info">
        <div className="info-row">
          <span>Áudio:</span>
          <span className={audioOriginal || audioInstrumental ? 'status-ok' : 'status-missing'}>
            {audioOriginal || audioInstrumental ? '✓' : '✗'}
          </span>
        </div>

        <div className="info-row">
          <span>Letras:</span>
          <span className={verses.length > 0 ? 'status-ok' : 'status-missing'}>
            {verses.length > 0 ? `${verses.length} estrofe(s)` : '✗'}
          </span>
        </div>

        <div className="info-row">
          <span>Background:</span>
          <span className="status-optional">
            {background ? '✓ ' + background.type : 'Opcional'}
          </span>
        </div>
      </div>

      <button
        className="export-button"
        onClick={handleExport}
        disabled={
          exporting ||
          !projectName ||
          (!audioOriginal && !audioInstrumental) ||
          verses.length === 0
        }
      >
        {exporting ? (
          <>
            <div className="loading-spinner" />
            Gerando vídeo...
          </>
        ) : (
          <>
            <Download size={20} />
            Exportar Vídeo
          </>
        )}
      </button>
    </div>
  );
}

export default ExportPanel;
