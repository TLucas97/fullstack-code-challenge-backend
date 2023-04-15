const express = require('express');
const cors = require('cors');
const {
  fetchGithubUsersData,
  fetchGithubUserDetails,
  fetchGithubUserRepos,
} = require('../controllers/controller');
require('dotenv').config();

const app = express();

const corsOptions = {
  origin: '*',
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 8080;

app.get('/api/users', cors(), fetchGithubUsersData);
app.get('/api/users/:username/details', cors(), fetchGithubUserDetails);
app.get('/api/users/:username/repos', cors(), fetchGithubUserRepos);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
