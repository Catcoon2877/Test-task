import React from 'react';

interface RepoCardProps {
  repo: {
    id: number;
    name: string;
    description: string | null;
    html_url: string;
    stargazers_count: number;
    updated_at: string;
  };
}

const RepoCard: React.FC<RepoCardProps> = ({ repo }) => {
  return (
    <div className="repo-card">
      <h2>{repo.name}</h2>
      <p>{repo.description || 'Описание отсутствует'}</p>
      <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
        Ссылка на репозиторий
      </a>
      <p>Звёзды: {repo.stargazers_count}</p>
      <p>Последнее обновление: {new Date(repo.updated_at).toLocaleDateString()}</p>
    </div>
  );
};

export default RepoCard;