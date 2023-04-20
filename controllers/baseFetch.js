require('dotenv').config();
const axios = require('axios');

const BASE_URL = process.env.BASE_URL;
const GITHUB_PERSONAL_TOKEN = process.env.GITHUB_PERSONAL_TOKEN;

const fetchData = async (endpoint) => {
  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      headers: {
        Authorization: `token ${GITHUB_PERSONAL_TOKEN}`,
      },
    });

    if (response.data === 'Not Found') {
      return [];
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}: ${error.message}`);
  }
};

const postData = async (endpoint, token, data) => {
  try {
    const response = await axios.post(`${BASE_URL}${endpoint}`, data, {
      headers: {
        Authorization: `token ${token}`,
        Aplication: 'application/vnd.github+json',
        Accept: 'application/vnd.github.v3+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'X-OAuth-Scopes': 'repo',
        'X-Accepted-OAuth-Scopes': 'repo',
      },
    });

    console.log(response);
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}: ${error.message}`);
  }
};

const fetchAuthData = async (endpoint, token) => {
  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data === 'Not Found') {
      return [];
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}: ${error.message}`);
  }
};

const fetchAccessTokenData = async (url, id, secret, code) => {
  const response = await axios.post(
    `${url}?client_id=${id}&client_secret=${secret}&code=${code}&scope=repo`,
    {
      headers: {
        Accept: 'application/json',
        'X-OAuth-Scopes': 'repo',
        'X-Accepted-OAuth-Scopes': 'repo',
      },
    }
  );

  return response.data;
};

module.exports = { fetchData, fetchAccessTokenData, fetchAuthData, postData };
