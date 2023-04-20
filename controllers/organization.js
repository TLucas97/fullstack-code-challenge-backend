const { fetchData } = require('./baseFetch');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const fetchGithubOrganizationsData = async (req, res) => {
  try {
    const since = req.query.since;
    const per_page = req.query.per_page;
    const hostname = req.hostname;

    const dinamic_url = !per_page
      ? `/organizations?since=${since}`
      : `/organizations?since=${since}&per_page=${per_page}`;

    const data = await fetchData(dinamic_url);

    if (!data || typeof data !== 'object') {
      res.status(500).json({ message: 'Invalid API response' });
      return;
    }

    const nextPageSince = data[data.length - 1].id;

    const dinamic_url_per_page = !per_page
      ? `http://${hostname}:${PORT}/api/orgs?since=${nextPageSince}`
      : `http://${hostname}:${PORT}/api/orgs?since=${nextPageSince}&per_page=${per_page}`;

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
    console.error(`Error fetching organization data: ${error.message}`);
    throw error;
  }
};

const fetchGithubOrgDetails = async (req, res) => {
  try {
    const org = req.params.org;
    const data = await fetchData(`/orgs/${org}`);

    if (!data || typeof data !== 'object') {
      res.status(500).json({ message: 'Invalid API response' });
      return;
    }

    if (!data) {
      res.status(404).json({ message: 'Organization not found' });
      return;
    }

    res.json(data);
  } catch (error) {
    console.error(
      `Error fetching GitHub organization details: ${error.message}`
    );
    throw error;
  }
};

const fetchGithubOrgMembers = async (req, res) => {
  try {
    const org = req.params.org;
    const data = await fetchData(`/users/${org}/members`);

    if (!data || typeof data !== 'object') {
      res.status(500).json({ message: 'Invalid API response' });
      return;
    }

    res.json(data);
  } catch (error) {
    console.error(
      `Error fetching GitHub organization members: ${error.message}`
    );
    throw error;
  }
};

module.exports = {
  fetchGithubOrganizationsData,
  fetchGithubOrgDetails,
  fetchGithubOrgMembers,
};
