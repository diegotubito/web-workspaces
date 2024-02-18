import React from 'react';
import './CustomModal.css'; // Assume you have basic modal styles defined

export const CustomModal = ({ isOpen, onClose, workspaces, onSelectWorkspace }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Select Your Workspace</h2>
        <ul>
          {workspaces.map((workspace) => (
            <li key={workspace.id} onClick={() => onSelectWorkspace(workspace)}>
              {workspace.name}
            </li>
          ))}
        </ul>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

