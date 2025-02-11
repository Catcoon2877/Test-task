import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { fetchRepos } from './features/reposSlice';
import SearchBar from './components/SearchBar';
import RepoCard from './components/RepoCard';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const { repos, loading, error, hasMore } = useSelector((state: RootState) => state.repos);

  useEffect(() => {
    const handleScroll = () => {
      console.log(document.documentElement.offsetHeight);
      console.log(window.innerHeight);
      console.log(document.documentElement.scrollTop);
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        if (hasMore && !loading) {
          const username = (document.getElementById('username') as HTMLInputElement)?.value;
          if (username) {
            dispatch(fetchRepos(username));
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, dispatch]);

  return (
    <div className='main'>
      <SearchBar />
      {error && <p className="error">{error}</p>}
      {repos.length === 0 && !loading && !error && (
        <p className="info">Репозитории отсутствуют или пользователь не найден.</p>
      )}
      <div className="repos-grid">
        {repos.map((repo) => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </div>
      {loading && <LoadingSpinner />}
    </div>
  );
};

export default App;