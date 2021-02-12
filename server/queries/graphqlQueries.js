const { GraphQLClient, gql } = require('graphql-request');

module.exports = (accessToken) => {

    // Base GraphQL API Endpoint
    const URL = "https://api.github.com/graphql"

    // Create The GraphQL Client
    const graphQLClient = new GraphQLClient(URL, {
        headers: {
            authorization: `Bearer ${accessToken}`,
        },
    });

    // Create GraphQL Queries
    return {
        getRepoCollaboratorsQuery: async (repoOwner, repoName) => {
            
            // Create Repo Collaboraters array
            let repoCollaborators = []

            // The query that gets repo collaborators
            const getRepoCollaboratorsQuery = gql`
                query($repoOwner: String!, $repoName: String!) {
                    repository(owner: $repoOwner, name: $repoName) {
                        collaborators {
                            nodes {
                                id
                                login
                                name
                                url
                            }
                        }
                    }
                }`;

            // Query Variables
            const queryVariables = { repoOwner, repoName }

            // Make Graphql call
            const queryResult = await graphQLClient.request(getRepoCollaboratorsQuery, queryVariables);

            // Get Collaborators from query result
            if (queryResult.repository.collaborators.nodes) {
                repoCollaborators = queryResult.repository.collaborators.nodes
            }

            return repoCollaborators
        },

        getCollaboratorsUpdatesQuery: async (repoOwner, repoName, collaboratorId) => {

            // Create Repo Collaboraters Updates array
            let collaboratorsUpdates = []

            // The query that gets collaborator updates
            const getCollaboratorsUpdatesQuery = gql`
            query($repoOwner: String!, $repoName: String!, $collaboratorId: String!) {
                repository(owner: $repoOwner, name: $repoName) {
                    ref(qualifiedName: "master") {
                        target {
                            ... on Commit {
                                history(author: {id: $collaboratorId}) {
                                    nodes {
                                        additions
                                        deletions
                                    }
                                }
                            }
                        }
                    }
                }
            }`;

            // Query Variables
            const queryVariables = { repoOwner, repoName, collaboratorId }

            // Make Graphql call
            const queryResult = await graphQLClient.request(getCollaboratorsUpdatesQuery, queryVariables);

            // Get collaborators updates from query result
            if (queryResult.repository.ref.target.history.nodes) {
                collaboratorsUpdates = queryResult.repository.ref.target.history.nodes
            }

            return collaboratorsUpdates
        }
    }
}