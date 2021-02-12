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
        collaborator['updates'] = collaborator['additions'] + collaborator['deletions'];
        repoCollaboratorsUpdates.push(collaborator);
    }));

    return repoCollaboratorsUpdates;
}

module.exports = async (req, res) => {
    try {

        // Extract Repo URL from request query parameters.
        let { repoUrl, accessToken } = req.query;

        // Check if repo exist or not
        if (!repoUrl || !repoUrl.trim().length) {
            throw new Error("You must enter a github repo link!")
        } else {
            // Create Leaderboard
            let repoLeaderboard = await createRepoLeaderboard(repoUrl, accessToken);

            // Create and send the response
            res.json({
                success: true,
                leaderboard: repoLeaderboard.sort((c1, c2) => (c1.updates < c2.updates) ? 1 : -1)
            })
        }

    } catch (error) {
        let err = error.message;
        let response = String(err).indexOf("{") != -1 ? JSON.parse(err.slice(String(err).indexOf("{"))).response : err;
        let errMsg = response ?
            response.message ?
                response.message
                :
                response.errors && response.errors.length > 0 ?
                    response.errors[0].message
                    :
                    err
            :
            null

        // Error catch and send to client.
        res.json({
            success: false,
            error: errMsg
        });
    }
}