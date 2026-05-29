const express = require('express');
const axios = require('axios');

const Search = require('../models/Search');
const Favorite = require('../models/Favorite');
const NodeCache = require('node-cache');

const cache = new NodeCache({
  stdTTL: 300,
  checkperiod: 320
});

const OpenAI = require('openai');

const openai = new OpenAI({

  apiKey: process.env.OPENROUTER_API_KEY,

  baseURL: 'https://openrouter.ai/api/v1'
});

const router = express.Router();



const githubHeaders = () => ({
  'User-Agent': 'DevPulse-App',

  ...(process.env.GITHUB_TOKEN && {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
  })
});



// ===============================
// USER API
// ===============================
router.get('/user/:username', async (req, res) => {

  try {

    const { username } = req.params;

    const cacheKey = `user_${username}`;

    const cachedUser = cache.get(cacheKey);

    if (cachedUser) {

      console.log('CACHE HIT USER');

      return res.json(cachedUser);
    }

    await Search.create({
      username
    });

    const response = await axios.get(
      `https://api.github.com/users/${username}`,
      {
        headers: githubHeaders()
      }
    );

    cache.set(cacheKey, response.data);

    res.json(response.data);

  } catch (error) {

    const status =
      error.response?.status || 500;

    const message =
      error.response?.data?.message
      || 'GitHub API failed';

    console.log(
      `USER ERROR [${status}]:`,
      message
    );

    res.status(status).json({
      message
    });
  }
});



// ===============================
// REPOS API
// ===============================
router.get('/repos/:username', async (req, res) => {

  try {

    const { username } = req.params;

    const cacheKey = `repos_${username}`;

    const cachedRepos = cache.get(cacheKey);

    if (cachedRepos) {

      console.log('CACHE HIT REPOS');

      return res.json(cachedRepos);
    }

    const response = await axios.get(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=30`,
      {
        headers: githubHeaders()
      }
    );

    cache.set(cacheKey, response.data);

    res.json(response.data);

  } catch (error) {

    const status =
      error.response?.status || 500;

    const message =
      error.response?.data?.message
      || 'GitHub API failed';

    console.log(
      `REPOS ERROR [${status}]:`,
      message
    );

    res.status(status).json({
      message
    });
  }
});



// ===============================
// EVENTS API
// ===============================
router.get('/events/:username', async (req, res) => {

  try {

    const { username } = req.params;

    const response = await axios.get(
      `https://api.github.com/users/${username}/events/public?per_page=100`,
      {
        headers: githubHeaders()
      }
    );

    const activityMap = {};

    response.data.forEach((event) => {

      const date =
        event.created_at.split('T')[0];

      if (!activityMap[date]) {
        activityMap[date] = 0;
      }

      switch (event.type) {

        case 'PushEvent':

          activityMap[date] +=
            event.payload?.commits?.length || 1;

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

    const status =
      error.response?.status || 500;

    const message =
      error.response?.data?.message
      || 'GitHub API failed';

    console.log(
      `EVENTS ERROR [${status}]:`,
      message
    );

    res.status(status).json({
      message
    });
  }
});




// ===============================
// RECENT SEARCHES API
// ===============================
router.get('/recent/searches', async (req, res) => {

  try {

    const searches = await Search.find()
      .sort({ searchedAt: -1 })
      .limit(5);



    res.json(searches);

  } catch (error) {

    console.log(
      'RECENT SEARCHES ERROR:',
      error.message
    );



    res.status(500).json({
      message: 'Failed to fetch recent searches'
    });
  }
});



// ===============================
// ADD FAVORITE API
// ===============================
router.post('/favorites', async (req, res) => {

  try {

    const {
      username,
      avatar,
      profileUrl,
      userId
    } = req.body;



    const existingFavorite =
      await Favorite.findOne({
        username,
        userId
      });



    if (existingFavorite) {

      return res.status(400).json({
        message: 'Already added to favorites'
      });
    }



    const favorite = await Favorite.create({

      userId,

      username,

      avatar,

      profileUrl
    });



    res.status(201).json(favorite);

  } catch (error) {

    console.log(
      'FAVORITE ERROR:',
      error.message
    );



    res.status(500).json({
      message: 'Failed to save favorite'
    });
  }
});



// ===============================
// GET FAVORITES API
// ===============================
router.get('/favorites', async (req, res) => {

  try {

    const { userId } = req.query;



    const favorites = await Favorite.find({
      userId
    })
    .sort({ addedAt: -1 });



    res.json(favorites);

  } catch (error) {

    console.log(
      'GET FAVORITES ERROR:',
      error.message
    );



    res.status(500).json({
      message: 'Failed to fetch favorites'
    });
  }
});



// ===============================
// DELETE FAVORITE API
// ===============================
router.delete('/favorites/:id', async (req, res) => {

  try {

    const { id } = req.params;



    await Favorite.findByIdAndDelete(id);



    res.json({
      message: 'Favorite removed'
    });

  } catch (error) {

    console.log(
      'DELETE FAVORITE ERROR:',
      error.message
    );



    res.status(500).json({
      message: 'Failed to remove favorite'
    });
  }
});



// ===============================
// AI INSIGHTS API
// ===============================
router.post('/ai-insights', async (req, res) => {

  try {

    const { repos } = req.body;



    const repoSummary = repos
      .slice(0, 10)
      .map((repo) => {

        return `
Repository: ${repo.name}
Language: ${repo.language}
Description: ${repo.description}
Stars: ${repo.stargazers_count}
`;
      })
      .join('\n');



    const prompt = `
Analyze this GitHub developer profile.

Give:
1. Tech stack summary
2. Developer strengths
3. Project quality observation
4. Suggested improvement

Keep response concise and professional.

GitHub repositories:
${repoSummary}
`;



    const completion = await openai.chat.completions.create({

  model: 'openai/gpt-3.5-turbo',

  messages: [
    {
      role: 'user',
      content: prompt
    }
  ]
});



const text =
  completion.choices[0].message.content;



    console.log(
      'AI RESPONSE:',
      text
    );



    res.json({
      insights: text
    });

  } catch (error) {

    console.log(
      'AI INSIGHTS ERROR:',
      error.message
    );



    res.status(500).json({
      message: 'Failed to generate insights'
    });
  }
});



module.exports = router;