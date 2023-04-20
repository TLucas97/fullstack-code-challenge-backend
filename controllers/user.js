require('dotenv').config();
const {
  fetchData,
  fetchAccessTokenData,
  fetchAuthData,
  postData,
} = require('./baseFetch');

const PORT = process.env.PORT || 5000;
const GITHUB_ACCESS_TOKEN_URL = process.env.GITHUB_ACCESS_TOKEN_URL;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

const fetchGithubUsersData = async (req, res) => {
  try {
    const since = req.query.since;
    const per_page = req.query.per_page;
    const hostname = req.hostname;

    const dinamic_url = !per_page
      ? `/users?since=${since}`
      : `/users?since=${since}&per_page=${per_page}`;

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
    const data = await fetchData(`/users/${username}`);

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
    const data = await fetchData(`/users/${username}/repos`);

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

const fetchUserAccessToken = async (req, res) => {
  const code = req.query.code;

  const data = await fetchAccessTokenData(
    GITHUB_ACCESS_TOKEN_URL,
    CLIENT_ID,
    CLIENT_SECRET,
    code
  );

  res.json(data);
};

const fetchUserAuthInfo = async (req, res) => {
  const access_token = req.query.access_token;

  const data = await fetchAuthData('/user', access_token);

  res.json(data);
};

const createNewUserRepository = async (req, res) => {
  const access_token = req.query.access_token;
  const body = {
    name: req.body.name,
    description: req.body.description,
    private: req.body.private,
  };

  const data = await postData('/user/repos', access_token, body);

  res.json(data);
};

module.exports = {
  fetchGithubUsersData,
  fetchGithubUserDetails,
  fetchGithubUserRepos,
  fetchData,
  fetchUserAccessToken,
  fetchUserAuthInfo,
  createNewUserRepository,
};
