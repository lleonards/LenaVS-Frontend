import React from 'react';
import { useEditorStore } from '../../store/editorStore';
import { Plus, Trash2, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline } from 'lucide-react';
import './LyricsEditor.css';

function LyricsEditor() {
  const { verses, updateVerse, addVerse, removeVerse } = useEditorStore();

  const handleAdd = () => {
    const newVerse = {
      id: Date.now().toString(),
      text: 'Nova estrofe...',
      order: verses.length,
      startTime: '',
      endTime: '',
      style: {
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
      }
    };
    addVerse(newVerse);
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
        {verses.map((verse, index) => (
          <div key={verse.id} className="verse-block">
            <div className="verse-number">Estrofe {index + 1}</div>
            
            <textarea
              className="verse-text"
              value={verse.text}
              onChange={(e) => updateVerse(verse.id, { text: e.target.value })}
              rows={3}
            />
            
            <div className="verse-timing">
              <div className="time-input">
                <label>Início</label>
                <input
                  type="text"
                  placeholder="mm:ss"
                  value={verse.startTime}
                  onChange={(e) => updateVerse(verse.id, { startTime: e.target.value })}
                />
              </div>
              <div className="time-input">
                <label>Fim</label>
                <input
                  type="text"
                  placeholder="mm:ss"
                  value={verse.endTime}
                  onChange={(e) => updateVerse(verse.id, { endTime: e.target.value })}
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
                  value={verse.style.fontSize}
                  onChange={(e) => updateVerse(verse.id, { 
                    style: { ...verse.style, fontSize: parseInt(e.target.value) }
                  })}
                />
                <span>{verse.style.fontSize}px</span>
              </div>

              <div className="control-group">
                <label>Cor</label>
                <input
                  type="color"
                  value={verse.style.color}
                  onChange={(e) => updateVerse(verse.id, { 
                    style: { ...verse.style, color: e.target.value }
                  })}
                />
              </div>

              <div className="control-group">
                <label>Contorno</label>
                <input
                  type="color"
                  value={verse.style.outlineColor}
                  onChange={(e) => updateVerse(verse.id, { 
                    style: { ...verse.style, outlineColor: e.target.value }
                  })}
                />
              </div>

              <div className="style-buttons">
                <button
                  className={verse.style.bold ? 'active' : ''}
                  onClick={() => updateVerse(verse.id, { 
                    style: { ...verse.style, bold: !verse.style.bold }
                  })}
                  title="Negrito"
                >
                  <Bold size={16} />
                </button>
                <button
                  className={verse.style.italic ? 'active' : ''}
                  onClick={() => updateVerse(verse.id, { 
                    style: { ...verse.style, italic: !verse.style.italic }
                  })}
                  title="Itálico"
                >
                  <Italic size={16} />
                </button>
                <button
                  className={verse.style.underline ? 'active' : ''}
                  onClick={() => updateVerse(verse.id, { 
                    style: { ...verse.style, underline: !verse.style.underline }
                  })}
                  title="Sublinhado"
                >
                  <Underline size={16} />
                </button>
              </div>

              <div className="align-buttons">
                <button
                  className={verse.style.alignment === 'left' ? 'active' : ''}
                  onClick={() => updateVerse(verse.id, { 
                    style: { ...verse.style, alignment: 'left' }
                  })}
                >
                  <AlignLeft size={16} />
                </button>
                <button
                  className={verse.style.alignment === 'center' ? 'active' : ''}
                  onClick={() => updateVerse(verse.id, { 
                    style: { ...verse.style, alignment: 'center' }
                  })}
                >
                  <AlignCenter size={16} />
                </button>
                <button
                  className={verse.style.alignment === 'right' ? 'active' : ''}
                  onClick={() => updateVerse(verse.id, { 
                    style: { ...verse.style, alignment: 'right' }
                  })}
                >
                  <AlignRight size={16} />
                </button>
              </div>

              <div className="control-group">
                <label>Transição</label>
                <select
                  value={verse.style.transition}
                  onChange={(e) => updateVerse(verse.id, { 
                    style: { ...verse.style, transition: e.target.value }
                  })}
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
        ))}
      </div>
    </div>
  );
}

export default LyricsEditor;
