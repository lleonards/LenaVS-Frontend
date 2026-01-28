import React from 'react';
import { useEditorStore } from '../../store/editorStore';
import {
  Plus,
  Trash2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline
} from 'lucide-react';
import './LyricsEditor.css';

// 🎨 ESTILO PADRÃO (fallback)
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

function LyricsEditor() {
  const { verses, updateVerse, addVerse, removeVerse } = useEditorStore();

  const handleAdd = () => {
    addVerse({
      id: Date.now().toString(),
      text: 'Nova estrofe...',
      order: verses.length,
      startTime: '',
      endTime: '',
      style: { ...DEFAULT_STYLE }
    });
  };

  return (
    <div className="lyrics-editor">
      <div className="lyrics-header">
        <h2 className="panel-title">Editor de Letras</h2>
        <button onClick={handleAdd} className="add-btn">
          <Plus size={18} />
          Adicionar Estrofe
        </button>
      </div>

      <div className="verses-list">
        {verses.map((verse, index) => {
          // 🛡️ PROTEÇÃO ABSOLUTA
          const style = { ...DEFAULT_STYLE, ...(verse.style || {}) };

          return (
            <div key={verse.id} className="verse-block">
              <div className="verse-number">Estrofe {index + 1}</div>

              <textarea
                className="verse-text"
                value={verse.text || ''}
                onChange={(e) =>
                  updateVerse(verse.id, { text: e.target.value })
                }
                rows={3}
              />

              <div className="verse-timing">
                <div className="time-input">
                  <label>Início</label>
                  <input
                    type="text"
                    placeholder="mm:ss"
                    value={verse.startTime || ''}
                    onChange={(e) =>
                      updateVerse(verse.id, { startTime: e.target.value })
                    }
                  />
                </div>
                <div className="time-input">
                  <label>Fim</label>
                  <input
                    type="text"
                    placeholder="mm:ss"
                    value={verse.endTime || ''}
                    onChange={(e) =>
                      updateVerse(verse.id, { endTime: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="verse-controls">
                <div className="control-group">
                  <label>Tamanho</label>
                  <input
                    type="range"
                    min="20"
                    max="80"
                    value={style.fontSize}
                    onChange={(e) =>
                      updateVerse(verse.id, {
                        style: { ...style, fontSize: Number(e.target.value) }
                      })
                    }
                  />
                  <span>{style.fontSize}px</span>
                </div>

                <div className="control-group">
                  <label>Cor</label>
                  <input
                    type="color"
                    value={style.color}
                    onChange={(e) =>
                      updateVerse(verse.id, {
                        style: { ...style, color: e.target.value }
                      })
                    }
                  />
                </div>

                <div className="control-group">
                  <label>Contorno</label>
                  <input
                    type="color"
                    value={style.outlineColor}
                    onChange={(e) =>
                      updateVerse(verse.id, {
                        style: { ...style, outlineColor: e.target.value }
                      })
                    }
                  />
                </div>

                <div className="style-buttons">
                  <button
                    className={style.bold ? 'active' : ''}
                    onClick={() =>
                      updateVerse(verse.id, {
                        style: { ...style, bold: !style.bold }
                      })
                    }
                  >
                    <Bold size={16} />
                  </button>

                  <button
                    className={style.italic ? 'active' : ''}
                    onClick={() =>
                      updateVerse(verse.id, {
                        style: { ...style, italic: !style.italic }
                      })
                    }
                  >
                    <Italic size={16} />
                  </button>

                  <button
                    className={style.underline ? 'active' : ''}
                    onClick={() =>
                      updateVerse(verse.id, {
                        style: { ...style, underline: !style.underline }
                      })
                    }
                  >
                    <Underline size={16} />
                  </button>
                </div>

                <div className="align-buttons">
                  <button
                    className={style.alignment === 'left' ? 'active' : ''}
                    onClick={() =>
                      updateVerse(verse.id, {
                        style: { ...style, alignment: 'left' }
                      })
                    }
                  >
                    <AlignLeft size={16} />
                  </button>

                  <button
                    className={style.alignment === 'center' ? 'active' : ''}
                    onClick={() =>
                      updateVerse(verse.id, {
                        style: { ...style, alignment: 'center' }
                      })
                    }
                  >
                    <AlignCenter size={16} />
                  </button>

                  <button
                    className={style.alignment === 'right' ? 'active' : ''}
                    onClick={() =>
                      updateVerse(verse.id, {
                        style: { ...style, alignment: 'right' }
                      })
                    }
                  >
                    <AlignRight size={16} />
                  </button>
                </div>

                <div className="control-group">
                  <label>Transição</label>
                  <select
                    value={style.transition}
                    onChange={(e) =>
                      updateVerse(verse.id, {
                        style: { ...style, transition: e.target.value }
                      })
                    }
                  >
                    <option value="fade">Fade</option>
                    <option value="slide">Slide</option>
                    <option value="zoom-in">Zoom In</option>
                    <option value="zoom-out">Zoom Out</option>
                  </select>
                </div>

                <button
                  className="delete-btn"
                  onClick={() => removeVerse(verse.id)}
                >
                  <Trash2 size={16} />
                  Remover
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LyricsEditor;
