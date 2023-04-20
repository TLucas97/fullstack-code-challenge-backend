const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const {
  fetchGithubUsersData,
  fetchGithubUserDetails,
  fetchGithubUserRepos,
  fetchUserAccessToken,
  fetchUserAuthInfo,
  createNewUserRepository,
} = require('../controllers/user');

const {
  fetchGithubOrganizationsData,
  fetchGithubOrgDetails,
  fetchGithubOrgMembers,
} = require('../controllers/organization');

const { fetchTop30Repositories } = require('../controllers/topRepositories');

require('dotenv').config();

const app = express();

const corsOptions = {
  origin: '*',
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

const PORT = process.env.PORT || 8080;

app.get('/api/users', cors(), fetchGithubUsersData);
app.get('/api/users/:username/details', cors(), fetchGithubUserDetails);
app.get('/api/users/:username/repos', cors(), fetchGithubUserRepos);
app.get('/api/users/auth_details', cors(), fetchUserAuthInfo);

app.post('/api/users/access_token', cors(), fetchUserAccessToken);
app.post('/api/users/create_repo', cors(), createNewUserRepository);

app.get('/api/orgs', cors(), fetchGithubOrganizationsData);
app.get('/api/orgs/:org/details', cors(), fetchGithubOrgDetails);
app.get('/api/orgs/:org/members', cors(), fetchGithubOrgMembers);
app.get('/api/top30repos', cors(), fetchTop30Repositories);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
