const axios = require('axios');
const { fetchData } = require('../controllers/controller');
const {
  mockedGithubResponse: users_list_response,
} = require('./mocks/users_list');
const {
  mockedGithubResponse: user_repos_response,
} = require('./mocks/user_repos');
const {
  mockedGithubResponse: single_user_response,
} = require('./mocks/single_user');

jest.mock('axios', () => ({
  get: jest.fn(),
}));

describe('fetchData', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('fetches data successfully', async () => {
    const url = 'https://api.github.com/users?since=1';
    const data = users_list_response;
    axios.get.mockResolvedValueOnce({ data });

    const result = await fetchData(url);

    expect(result).toEqual(data);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(url, {
      headers: {
        Authorization: `token ${process.env.GITHUB_PERSONAL_TOKEN}`,
      },
    });
  });

  it('returns empty array when "Not Found" is returned', async () => {
    const url = 'https://api.github.com/users?since=1';
    axios.get.mockResolvedValueOnce({ data: 'Not Found' });

    const result = await fetchData(url);

    expect(result).toEqual([]);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(url, {
      headers: {
        Authorization: `token ${process.env.GITHUB_PERSONAL_TOKEN}`,
      },
    });
  });

  it('logs an error when an error occurs', async () => {
    const url = 'https://api.github.com/users?since=1';
    const errorMessage = 'Internal Server Error';
    axios.get.mockRejectedValueOnce(new Error(errorMessage));

    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    await fetchData(url);

    expect(consoleSpy).toHaveBeenCalledWith(
      `Error fetching data from ${url}: ${errorMessage}`
    );
    consoleSpy.mockRestore();
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(url, {
      headers: {
        Authorization: `token ${process.env.GITHUB_PERSONAL_TOKEN}`,
      },
    });
  });

  it('fetches a single user successfully', async () => {
    const url = 'https://api.github.com/users/tlucas97';
    const data = single_user_response;
    axios.get.mockResolvedValueOnce({ data });

    const result = await fetchData(url);

    expect(result).toEqual(data);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(url, {
      headers: {
        Authorization: `token ${process.env.GITHUB_PERSONAL_TOKEN}`,
      },
    });

    axios.get.mockResolvedValueOnce({ data: 'Not Found' });

    const result2 = await fetchData(url);

    expect(result2).toEqual([]);

    expect(axios.get).toHaveBeenCalledTimes(2);

    expect(axios.get).toHaveBeenCalledWith(url, {
      headers: {
        Authorization: `token ${process.env.GITHUB_PERSONAL_TOKEN}`,
      },
    });

    const errorMessage = 'Internal Server Error';

    axios.get.mockRejectedValueOnce(new Error(errorMessage));

    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    await fetchData(url);

    expect(consoleSpy).toHaveBeenCalledWith(
      `Error fetching data from ${url}: ${errorMessage}`
    );

    consoleSpy.mockRestore();

    expect(axios.get).toHaveBeenCalledTimes(3);

    expect(axios.get).toHaveBeenCalledWith(url, {
      headers: {
        Authorization: `token ${process.env.GITHUB_PERSONAL_TOKEN}`,
      },
    });
  });

  it('fetches a single user repos successfully', async () => {
    const url = 'https://api.github.com/users/caioldamasceno/repos';
    const data = user_repos_response;
    axios.get.mockResolvedValueOnce({ data });

    const result = await fetchData(url);

    expect(result).toEqual(data);

    expect(axios.get).toHaveBeenCalledTimes(1);

    expect(axios.get).toHaveBeenCalledWith(url, {
      headers: {
        Authorization: `token ${process.env.GITHUB_PERSONAL_TOKEN}`,
      },
    });

    axios.get.mockResolvedValueOnce({ data: 'Not Found' });

    const result2 = await fetchData(url);

    expect(result2).toEqual([]);

    expect(axios.get).toHaveBeenCalledTimes(2);

    expect(axios.get).toHaveBeenCalledWith(url, {
      headers: {
        Authorization: `token ${process.env.GITHUB_PERSONAL_TOKEN}`,
      },
    });

    const errorMessage = 'Internal Server Error';

    axios.get.mockRejectedValueOnce(new Error(errorMessage));

    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    await fetchData(url);

    expect(consoleSpy).toHaveBeenCalledWith(
      `Error fetching data from ${url}: ${errorMessage}`
    );

    consoleSpy.mockRestore();

    expect(axios.get).toHaveBeenCalledTimes(3);

    expect(axios.get).toHaveBeenCalledWith(url, {
      headers: {
        Authorization: `token ${process.env.GITHUB_PERSONAL_TOKEN}`,
      },
    });
  });
});
