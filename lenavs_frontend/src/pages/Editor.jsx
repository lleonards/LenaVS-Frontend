import React, { useState } from 'react';
import Header from '../components/Editor/Header';
import UploadPanel from '../components/Editor/UploadPanel';
import PreviewPanel from '../components/Editor/PreviewPanel';
import LyricsEditor from '../components/Editor/LyricsEditor';
import ExportPanel from '../components/Editor/ExportPanel';
import HelpModal from '../components/Modals/HelpModal';
import ProjectsModal from '../components/Modals/ProjectsModal';
import LibraryModal from '../components/Modals/LibraryModal';
import { useEditorStore } from '../store/editorStore';
import './Editor.css';

function Editor() {
  const hasLyrics = useEditorStore(state => state.hasLyrics);
  const [showHelp, setShowHelp] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);

  return (
    <div className="editor-container">
      <Header 
        onHelp={() => setShowHelp(true)}
        onProjects={() => setShowProjects(true)}
        onLibrary={() => setShowLibrary(true)}
      />
      
      <div className="editor-content">
        <div className="editor-left">
          <UploadPanel />
        </div>
        
        <div className="editor-center">
          <PreviewPanel />
          {hasLyrics && <LyricsEditor />}
        </div>
        
        <div className="editor-right">
          <ExportPanel />
        </div>
      </div>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
      {showProjects && <ProjectsModal onClose={() => setShowProjects(false)} />}
      {showLibrary && <LibraryModal onClose={() => setShowLibrary(false)} />}
    </div>
  );
}

export default Editor;
