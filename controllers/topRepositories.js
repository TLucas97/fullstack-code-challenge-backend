const { fetchData } = require('./baseFetch');
require('dotenv').config();

const fetchTop30Repositories = async (req, res) => {
  try {
    const data = await fetchData(
      '/search/repositories?q=stars:>1&sort=stars&order=desc'
    );

    if (!data || typeof data !== 'object') {
      res.status(500).json({ message: 'Invalid API response' });
      return;
    }

    if (data.length === 0) {
      res.json(data);
      return;
    }

    res.json(data);
  } catch (error) {
    console.error(`Error fetching GitHub data: ${error.message}`);
    throw error;
  }
};

module.exports = { fetchTop30Repositories };
