const createRepoLeaderboard = (repo_url) => {
    return repo_url
}

module.exports = async (req, res) => {
    try {

        // Extract Repo URL from request query parameters.
        let { repo_url } = req.query;

        // Create Leaderboard
        let repo_leaderboard = await createRepoLeaderboard(repo_url);

        // Create and send the response
        res.json({
            success: true,
            leaderboard: repo_leaderboard
        })
    } catch (error) {

        // Error catch and send to client.
        res.json({
            success: false,
            error: error.message
        });
    }
}
