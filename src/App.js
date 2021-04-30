import React, { useState, useEffect } from 'react';
import Filter from './components/Filter';
import AddPersonForm from './components/AddPersonForm';
import Person from './components/Person';
import personServices from './services/persons';
import Notification from './components/Notification';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [search, setSearch] = useState('');
  const [showAll, setShowAll] = useState(true);
  const [newPerson, setNewPerson] = useState({ name: '', number: '' });
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notificationIsError, setNotificationIsError] = useState(false);

  useEffect(() => {
    personServices.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const addPerson = (e) => {
    e.preventDefault();

    if (newPerson.name && newPerson.number) {
      if (persons.some((person) => person.name === newPerson.name)) {
        const confirmToUpdate = window.confirm(
          `${newPerson.name} is already in the phonebook. Do you want to replace their previous number with a new one?`
        );

        if (confirmToUpdate) {
          updatePerson(newPerson);
        }
      } else {
        personServices.create(newPerson).then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson));
          setNewPerson({ name: '', number: '' });

          setNotificationMessage(`Added ${returnedPerson.name}`);
          setTimeout(() => {
            setNotificationMessage(null);
          }, 3000);
        });
      }
    } else {
      setNotificationIsError(true);
      setNotificationMessage('Please make sure to enter both a name and a number');

      setTimeout(() => {
        setNotificationMessage(null);
        setNotificationIsError(false);
      }, 3000);
    }
  };

  const updatePerson = (newPerson) => {
    const personToUpdate = persons.find((person) => person.name === newPerson.name);
    const changedPerson = { ...personToUpdate, number: newPerson.number };
    personServices
      .update(changedPerson, changedPerson.id)
      .then((returnedPerson) => {
        setPersons(
          persons.map((person) => (person.id !== changedPerson.id ? person : returnedPerson))
        );
        setNotificationMessage(`Updated ${returnedPerson.name}`);
        setTimeout(() => {
          setNotificationMessage(null);
        }, 3000);
      })
      .catch((error) => {
        setPersons(persons.filter((person) => person.id !== changedPerson.id));

        setNotificationIsError(true);
        setNotificationMessage(`${changedPerson.name} was already deleted from the server`);

        setTimeout(() => {
          setNotificationMessage(null);
          setNotificationIsError(false);
        }, 3000);
      });
  };

  const removePerson = (e) => {
    const personToDelete = persons.find((person) => person.id === +e.target.id);
    const confirmToDelete = window.confirm(`Delete ${personToDelete.name}?`);

    if (confirmToDelete) {
      personServices
        .remove(personToDelete.id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== personToDelete.id));
          setNotificationMessage(`Deleted ${personToDelete.name}`);
          setTimeout(() => {
            setNotificationMessage(null);
          }, 3000);
        })
        .catch((error) => {
          setPersons(persons.filter((person) => person.id !== personToDelete.id));

          setNotificationIsError(true);
          setNotificationMessage(`${personToDelete.name} was already deleted from the server`);

          setTimeout(() => {
            setNotificationMessage(null);
            setNotificationIsError(false);
          }, 3000);
        });
    }
  };

  const handleChange = (e) => {
    e.target.getAttribute('id') === 'name'
      ? setNewPerson({ ...newPerson, name: e.target.value })
      : setNewPerson({ ...newPerson, number: e.target.value });
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    search ? setShowAll(false) : setShowAll(true);
  };

  const personsToShow = showAll
    ? persons
    : persons.filter((person) => person.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification
        message={notificationMessage}
        messageClass={notificationIsError ? 'error' : 'notification'}
      />
      <Filter search={search} handleSearch={handleSearch} />
      <AddPersonForm addPerson={addPerson} newPerson={newPerson} handleChange={handleChange} />
      <h2>contacts</h2>
      {personsToShow.map((person) => (
        <Person person={person} key={person.id} handleClick={removePerson} />
      ))}
    </div>
  );
};

export default App;
