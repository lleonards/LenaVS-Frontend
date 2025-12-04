import React from 'react';
import { X } from 'lucide-react';
import './Modal.css';

function HelpModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Tutorial - LenaVS</h2>
          <button onClick={onClose} className="close-btn">
            <X size={24} />
          </button>
        </div>
        
        <div className="modal-body">
          <h3>Bem-vindo ao LenaVS!</h3>
          <p>Siga estes passos para criar seu vídeo karaokê:</p>
          
          <ol className="tutorial-steps">
            <li>
              <strong>Faça upload dos arquivos:</strong>
              <ul>
                <li>Música Original (obrigatório)</li>
                <li>Música Instrumental (opcional)</li>
                <li>Vídeo ou Imagem de fundo (opcional)</li>
                <li>Letra da música (obrigatório)</li>
              </ul>
            </li>
            
            <li>
              <strong>Configure as letras:</strong>
              <ul>
                <li>Defina tempo de início e fim de cada estrofe</li>
                <li>Personalize fonte, cores e efeitos</li>
                <li>Escolha o alinhamento e transições</li>
              </ul>
            </li>
            
            <li>
              <strong>Visualize no Preview:</strong>
              <ul>
                <li>Teste as sincronizações</li>
                <li>Ajuste cores de fundo se necessário</li>
              </ul>
            </li>
            
            <li>
              <strong>Exporte o vídeo:</strong>
              <ul>
                <li>Defina o nome do projeto</li>
                <li>Escolha o áudio (original ou instrumental)</li>
                <li>Clique em "Exportar Vídeo"</li>
              </ul>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default HelpModal;
