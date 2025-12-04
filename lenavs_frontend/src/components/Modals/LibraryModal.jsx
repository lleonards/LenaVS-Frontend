import React, { useState, useEffect } from 'react';
import { X, Library } from 'lucide-react';
import { projectService } from '../../api/services';
import './Modal.css';

function LibraryModal({ onClose }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPublicProjects();
  }, []);

  const loadPublicProjects = async () => {
    try {
      const response = await projectService.getPublic();
      setProjects(response.data.projects);
    } catch (error) {
      alert('Erro ao carregar biblioteca pública');
    } finally {
      setLoading(false);
    }
  };

  const handleClone = async (id) => {
    try {
      await projectService.clone(id);
      alert('Projeto clonado com sucesso! Confira em "Meus Projetos"');
      onClose();
    } catch (error) {
      alert('Erro ao clonar projeto');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Biblioteca Pública</h2>
          <button onClick={onClose} className="close-btn">
            <X size={24} />
          </button>
        </div>
        
        <div className="modal-body">
          {loading ? (
            <div className="loading-state">Carregando...</div>
          ) : projects.length === 0 ? (
            <div className="empty-state">
              <Library size={48} />
              <p>Nenhum projeto público disponível</p>
            </div>
          ) : (
            <div className="projects-grid">
              {projects.map(project => (
                <div key={project.id} className="project-card">
                  <div className="project-info">
                    <h3>{project.name}</h3>
                    <p className="project-date">
                      {new Date(project.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleClone(project.id)}
                    className="btn-primary"
                  >
                    Clonar Projeto
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LibraryModal;
