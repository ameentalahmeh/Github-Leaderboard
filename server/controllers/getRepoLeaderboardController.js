const ghUrlParser = require('parse-github-url');
const graphqlQueries = require('../queries/graphqlQueries');

// Create Repo Leaderboard Function
const createRepoLeaderboard = async (repoUrl, accessToken) => {

    let repoCollaboratorsUpdates = [];

    // Extract Repo Owner & Name.
    let { owner, name } = ghUrlParser(repoUrl);

    // Graphql Queries
    const { getRepoCollaboratorsQuery, getCollaboratorsUpdatesQuery } = graphqlQueries(accessToken)

    // Get Repo Collaborators
    let collaborators = await getRepoCollaboratorsQuery(owner, name)

    // Get Collaborators Updates
    await Promise.all(collaborators.map(async (collaborator) => {
        let collaboratorUpdates = await getCollaboratorsUpdatesQuery(owner, name, collaborator.id)
        collaborator['additions'] = collaboratorUpdates.length > 0 ? collaboratorUpdates.map(update => update.additions).reduce((prev, next) => prev + next) : 0
        collaborator['deletions'] = collaboratorUpdates.length > 0 ? collaboratorUpdates.map(update => update.deletions).reduce((prev, next) => prev + next) : 0
        repoCollaboratorsUpdates.push(collaborator);
    }));

    return repoCollaboratorsUpdates;
}

module.exports = async (req, res) => {
    try {

        // Extract Repo URL from request query parameters.
        let { repoUrl, accessToken } = req.query;

        // Create Leaderboard
        let repoLeaderboard = await createRepoLeaderboard(repoUrl, accessToken);

        // Create and send the response
        res.json({
            success: true,
            leaderboard: repoLeaderboard
        })
    } catch (error) {

        // Error catch and send to client.
        res.json({
            success: false,
            error: error.message
        });
    }
}