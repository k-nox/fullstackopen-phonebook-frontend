import React from 'react';

const Filter = ({ search, handleSearch }) => (
  <div>
    search by name: <input value={search} onChange={handleSearch} />
  </div>
);

export default Filter;
