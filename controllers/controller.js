const axios = require('axios');
require('dotenv').config();

const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL || 'https://api.github.com';
const GITHUB_PERSONAL_TOKEN = process.env.GITHUB_PERSONAL_TOKEN || '';

const fetchData = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `token ${GITHUB_PERSONAL_TOKEN}`,
      },
    });

    if (response.data === 'Not Found') {
      return [];
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${url}: ${error.message}`);
  }
};

const fetchGithubUsersData = async (req, res) => {
  try {
    const since = req.query.since;
    const per_page = req.query.per_page;
    const hostname = req.hostname;

    const dinamic_url = !per_page
      ? `${BASE_URL}/users?since=${since}`
      : `${BASE_URL}/users?since=${since}&per_page=${per_page}`;

    const data = await fetchData(dinamic_url);

    if (!data || typeof data !== 'object') {
      res.status(500).json({ message: 'Invalid API response' });
      return;
    }

    const nextPageSince = data[data.length - 1].id;

    const dinamic_url_per_page = !per_page
      ? `http://${hostname}:${PORT}/api/users?since=${nextPageSince}`
      : `http://${hostname}:${PORT}/api/users?since=${nextPageSince}&per_page=${per_page}`;

    const dataArray = [
      ...data,
      {
        next_page: dinamic_url_per_page,
        last_user_id: nextPageSince,
      },
    ];

    if (data.length === 0) {
      res.json(data);
      return;
    }

    res.json(dataArray);
  } catch (error) {
    console.error(`Error fetching GitHub data: ${error.message}`);
    throw error;
  }
};

const fetchGithubUserDetails = async (req, res) => {
  try {
    const username = req.params.username;
    const data = await fetchData(`${BASE_URL}/users/${username}`);

    if (!data || typeof data !== 'object') {
      res.status(500).json({ message: 'Invalid API response' });
      return;
    }

    if (!data) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(data);
  } catch (error) {
    console.error(`Error fetching GitHub user details: ${error.message}`);
    throw error;
  }
};

const fetchGithubUserRepos = async (req, res) => {
  try {
    const username = req.params.username;
    const data = await fetchData(`${BASE_URL}/users/${username}/repos`);

    if (!data || typeof data !== 'object') {
      res.status(500).json({ message: 'Invalid API response' });
      return;
    }

    res.json(data);
  } catch (error) {
    console.error(`Error fetching GitHub user repos: ${error.message}`);
    throw error;
  }
};

module.exports = {
  fetchGithubUsersData,
  fetchGithubUserDetails,
  fetchGithubUserRepos,
  fetchData,
};
