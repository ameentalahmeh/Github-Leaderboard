const express = require('express');
const getGithubRepoLeaderboardController = require('./controllers/getRepoLeaderboardController');

// Create Express Router
const router = express.Router();

// Github leaderboard Endpoint
router.get('/api/github-leaderboard', getGithubRepoLeaderboardController);

module.exports = router;
