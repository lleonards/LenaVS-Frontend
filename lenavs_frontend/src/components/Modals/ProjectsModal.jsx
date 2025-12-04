import React, { useState, useEffect } from 'react';
import { X, Folder, Trash2 } from 'lucide-react';
import { projectService } from '../../api/services';
import { useEditorStore } from '../../store/editorStore';
import './Modal.css';

function ProjectsModal({ onClose }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadProject = useEditorStore(state => state.loadProject);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await projectService.getAll();
      setProjects(response.data.projects);
    } catch (error) {
      alert('Erro ao carregar projetos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deseja realmente deletar este projeto?')) return;
    
    try {
      await projectService.delete(id);
      loadProjects();
    } catch (error) {
      alert('Erro ao deletar projeto');
    }
  };

  const handleLoad = async (project) => {
    loadProject(project);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Meus Projetos</h2>
          <button onClick={onClose} className="close-btn">
            <X size={24} />
          </button>
        </div>
        
        <div className="modal-body">
          {loading ? (
            <div className="loading-state">Carregando projetos...</div>
          ) : projects.length === 0 ? (
            <div className="empty-state">
              <Folder size={48} />
              <p>Nenhum projeto encontrado</p>
            </div>
          ) : (
            <div className="projects-grid">
              {projects.map(project => (
                <div key={project.id} className="project-card">
                  <div className="project-info">
                    <h3>{project.name}</h3>
                    <p className="project-date">
                      {new Date(project.updatedAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="project-actions">
                    <button 
                      onClick={() => handleLoad(project)}
                      className="btn-primary"
                    >
                      Abrir
                    </button>
                    <button 
                      onClick={() => handleDelete(project.id)}
                      className="btn-danger"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectsModal;
