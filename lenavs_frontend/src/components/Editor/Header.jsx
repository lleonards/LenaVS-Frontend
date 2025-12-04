import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useEditorStore } from '../../store/editorStore';
import { Menu, HelpCircle, Folder, Library, LogOut, Plus } from 'lucide-react';
import './Header.css';

function Header({ onHelp, onProjects, onLibrary }) {
  const navigate = useNavigate();
  const logout = useAuthStore(state => state.logout);
  const user = useAuthStore(state => state.user);
  const resetProject = useEditorStore(state => state.resetProject);
  const [showMenu, setShowMenu] = useState(false);
  const [showHelpDropdown, setShowHelpDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNewProject = () => {
    if (confirm('Criar novo projeto? Alterações não salvas serão perdidas.')) {
      resetProject();
    }
  };

  return (
    <header className="editor-header">
      <div className="header-left">
        <img src="/logo.png" alt="LenaVS" className="header-logo" />
      </div>
      
      <div className="header-center">
        <nav className="header-nav">
          <div 
            className="nav-item dropdown"
            onMouseEnter={() => setShowHelpDropdown(true)}
            onMouseLeave={() => setShowHelpDropdown(false)}
          >
            <button className="nav-button">
              <HelpCircle size={18} />
              Ajuda
            </button>
            {showHelpDropdown && (
              <div className="dropdown-menu">
                <button onClick={onHelp} className="dropdown-item">
                  Tutorial
                </button>
                <button onClick={() => {
                  // FAQ modal logic will be added
                  alert('FAQ em breve!');
                }} className="dropdown-item">
                  FAQ
                </button>
                <button onClick={() => {
                  // Report bug modal logic will be added
                  alert('Relatar erro em breve!');
                }} className="dropdown-item">
                  Relatar Erro
                </button>
                <button onClick={() => {
                  alert('LenaVS v1.0.0 - Gerador de Vídeos Karaokê');
                }} className="dropdown-item">
                  Sobre o LenaVS
                </button>
              </div>
            )}
          </div>
          
          <button className="nav-button" onClick={handleNewProject}>
            <Plus size={18} />
            Novo Projeto
          </button>
          
          <button className="nav-button" onClick={onProjects}>
            <Folder size={18} />
            Projetos
          </button>
          
          <button className="nav-button" onClick={onLibrary}>
            <Library size={18} />
            Biblioteca
          </button>
        </nav>
      </div>
      
      <div className="header-right">
        <div className="user-menu">
          <button 
            className="user-button"
            onClick={() => setShowMenu(!showMenu)}
          >
            <div className="user-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <span className="user-name">{user?.name || 'Usuário'}</span>
          </button>
          
          {showMenu && (
            <div className="user-dropdown">
              <button onClick={handleLogout} className="dropdown-item">
                <LogOut size={16} />
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
