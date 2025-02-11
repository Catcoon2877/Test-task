import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { resetRepos, fetchRepos } from '../features/reposSlice';
import debounce from 'lodash.debounce';

const SearchBar: React.FC = () => {
  const [username, setUsername] = useState('');
  const dispatch = useDispatch();

  const handleSearch = useCallback((username: string) => {
    if (username) {
      dispatch(resetRepos());
      dispatch(fetchRepos(username));
    }
  }, [dispatch]);

  const debouncedSearch = useCallback(
    debounce((username: string) => handleSearch(username), 500),
    [handleSearch]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value.trim();
    setUsername(newUsername);
    debouncedSearch(newUsername);
  };

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <div className="container">
      <h1>Поиск репозиториев GitHub</h1>
      <input
        type="text"
        value={username}
        onChange={handleInputChange}
        placeholder="Введите имя пользователя GitHub"
        id="username"
      />
    </div>
  );
};

export default SearchBar;