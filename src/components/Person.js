import React from 'react';

const Person = ({ person, handleClick }) => (
  <p>
    {person.name} {person.number}{' '}
    <button type="button" onClick={handleClick} id={person.id}>
      delete
    </button>
  </p>
);

export default Person;
