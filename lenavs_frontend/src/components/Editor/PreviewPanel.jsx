import React, { useRef, useEffect, useState } from 'react';
import { useEditorStore } from '../../store/editorStore';
import { Play, Pause, Volume2, Palette } from 'lucide-react';
import './PreviewPanel.css';

// 🔥 Converte caminho relativo -> URL completa do backend Render
const getFileUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${import.meta.env.VITE_API_URL}${url}`;
};

function PreviewPanel() {
  const {
    audioOriginal,
    audioInstrumental,
    background,
    backgroundColor,
    verses,
    currentTime,
    isPlaying,
    duration,
    previewAudioType,
    setCurrentTime,
    setIsPlaying,
    setDuration,
    setPreviewAudioType,
    setBackgroundColor
  } = useEditorStore();

  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const currentAudio =
    previewAudioType === 'original' ? audioOriginal : audioInstrumental;

  // 🔥 Mantém o tempo ao trocar entre Original <-> Instrumental
  useEffect(() => {
    if (!audioRef.current || !currentAudio) return;

    const url = getFileUrl(currentAudio.url);
    const oldTime = currentTime;

    audioRef.current.src = url;

    audioRef.current.onloadedmetadata = () => {
      audioRef.current.currentTime = oldTime;
      if (isPlaying) audioRef.current.play();
    };
  }, [previewAudioType]);

  const activeVerse = verses.find(v => {
    const start = parseTime(v.startTime);
    const end = parseTime(v.endTime);
    return currentTime >= start && currentTime <= end;
  });

  function parseTime(timeStr) {
    if (!timeStr) return 0;
    const parts = timeStr.split(':').map(Number);
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return parts[0] || 0;
  }

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const time = percentage * duration;

    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="preview-panel">
      <div
        className="preview-container"
        style={{
          backgroundColor: background ? 'transparent' : backgroundColor
        }}
      >
        {background && background.type === 'video' && (
          <video
            ref={videoRef}
            src={getFileUrl(background.url)}
            className="preview-bg"
            autoPlay
            loop
            muted
          />
        )}

        {background && background.type === 'image' && (
          <img
            src={getFileUrl(background.url)}
            className="preview-bg"
            alt="Background"
          />
        )}

        {activeVerse && (
          <div
            className="preview-verse"
            style={{
              fontFamily: activeVerse.style.fontFamily,
              fontSize: `${activeVerse.style.fontSize}px`,
              color: activeVerse.style.color,
              textShadow: `2px 2px ${activeVerse.style.outlineWidth}px ${activeVerse.style.outlineColor}`,
              fontWeight: activeVerse.style.bold ? 'bold' : 'normal',
              fontStyle: activeVerse.style.italic ? 'italic' : 'normal',
              textDecoration: activeVerse.style.underline ? 'underline' : 'none',
              textAlign: activeVerse.style.alignment
            }}
          >
            {activeVerse.text}
          </div>
        )}
      </div>

      {/* CONTROLS */}
      <div className="preview-controls">
        <button className="control-btn" onClick={togglePlay}>
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>

        {/* 🔥 Botão que alterna os áudios e AGORA MOSTRA QUAL ESTÁ ATIVO */}
        <button
          className={`control-btn small audio-toggle-btn ${
            previewAudioType === 'original' ? 'active-audio' : ''
          }`}
          onClick={() =>
            setPreviewAudioType(
              previewAudioType === 'original' ? 'instrumental' : 'original'
            )
          }
        >
          <Volume2 size={16} />
        </button>
        <span className="audio-label">
          {previewAudioType === 'original' ? 'Original' : 'Instrumental'}
        </span>

        {/* COLOR PICKER */}
        {!background && (
          <div className="color-picker-wrapper">
            <button
              className="control-btn small"
              onClick={() => setShowColorPicker(!showColorPicker)}
            >
              <Palette size={16} />
            </button>

            {showColorPicker && (
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="color-input"
              />
            )}
          </div>
        )}

        <div className="time-display">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div className="progress-bar" onClick={handleSeek}>
        <div
          className="progress-fill"
          style={{
            width: `${(currentTime / duration) * 100}%`
          }}
        />
      </div>

      {/* AUDIO PLAYER */}
      {currentAudio && (
        <audio
          ref={audioRef}
          src={getFileUrl(currentAudio.url)}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
        />
      )}
    </div>
  );
}

export default PreviewPanel;
