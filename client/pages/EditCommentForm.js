// EditCommentForm.js

import React, { useState } from 'react';

const EditCommentForm = ({ initialText, onEditComment, onCancel }) => {
  const [newCommentText, setNewCommentText] = useState(initialText);

  const handleInputChange = (event) => {
    setNewCommentText(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onEditComment(newCommentText);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Nouveau texte du commentaire:
        <textarea value={newCommentText} onChange={handleInputChange} />
      </label>
      <div className="flex justify-end space-x-2 mt-2">
        <button type="submit">Enregistrer</button>
        <button type="button" onClick={onCancel}>
          Annuler
        </button>
      </div>
    </form>
  );
};

export default EditCommentForm;
