import React from 'react';

const AddPersonForm = ({ addPerson, newPerson, handleChange }) => {
  return (
    <form onSubmit={addPerson}>
      <h2>add new contact</h2>
      <div>
        name: <input value={newPerson.name} onChange={handleChange} id="name" />
      </div>
      <div>
        number: <input value={newPerson.number} onChange={handleChange} id="number" />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default AddPersonForm;
