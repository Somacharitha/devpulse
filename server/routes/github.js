const express = require('express');
const axios = require('axios');

const router = express.Router();

const githubHeaders = () => ({
  'User-Agent': 'DevPulse-App',
  ...(process.env.GITHUB_TOKEN && {
    'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`
  })
});

// USER API
router.get('/user/:username', async (req, res) => {
  try {
    const { username } = req.params;

    const response = await axios.get(
      `https://api.github.com/users/${username}`,
      { headers: githubHeaders() }
    );

    res.json(response.data);

  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'GitHub API failed';

    console.log(`USER ERROR [${status}]:`, message);
    res.status(status).json({ message });
  }
});

// REPOS API
router.get('/repos/:username', async (req, res) => {
  try {
    const { username } = req.params;

    const response = await axios.get(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=30`,
      { headers: githubHeaders() }
    );

    res.json(response.data);

  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'GitHub API failed';

    console.log(`REPOS ERROR [${status}]:`, message);
    res.status(status).json({ message });
  }
});
// EVENTS API
router.get('/events/:username', async (req, res) => {
  try {
    const { username } = req.params;

    const response = await axios.get(
      `https://api.github.com/users/${username}/events/public?per_page=100`,
      { headers: githubHeaders() }
    );

    // Process events into daily activity counts
    const activityMap = {};

    response.data.forEach(event => {
      const date = event.created_at.split('T')[0]; // "2024-04-10"
      if (!activityMap[date]) activityMap[date] = 0;

      // Weight different event types
      switch (event.type) {
        case 'PushEvent':
          activityMap[date] += event.payload?.commits?.length || 1;
          break;
        case 'PullRequestEvent':
          activityMap[date] += 2;
          break;
        case 'IssuesEvent':
        case 'IssueCommentEvent':
          activityMap[date] += 1;
          break;
        case 'CreateEvent':
          activityMap[date] += 1;
          break;
        default:
          activityMap[date] += 1;
      }
    });

    res.json(activityMap);

  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'GitHub API failed';
    console.log(`EVENTS ERROR [${status}]:`, message);
    res.status(status).json({ message });
  }
});

module.exports = router;