const BASE_URL = 'https://api.github.com';

export const fetchUser = async (username) => {
  const res = await fetch(`${BASE_URL}/users/${username}`);
  if (!res.ok) throw new Error('User not found');
  return res.json();
};

export const fetchRepos = async (username) => {
  const res = await fetch(
    `${BASE_URL}/users/${username}/repos?sort=updated&per_page=20`
  );
  if (!res.ok) throw new Error('Could not fetch repos');
  return res.json();
};

export const fetchLanguages = async (username, repoName) => {
  const res = await fetch(
    `${BASE_URL}/repos/${username}/${repoName}/languages`
  );
  if (!res.ok) throw new Error('Could not fetch languages');
  return res.json();
};