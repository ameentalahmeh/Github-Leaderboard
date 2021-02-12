import React, { useState, Fragment } from "react";
import axios from "axios";
import { Navbar } from 'react-responsive-navbar-overlay';
import { CircularProgress } from '@material-ui/core';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

import Template from "../../Components/Template";
import Leaderboard from "../../Components/Leaderboard";

import './HomePage.css';

const MainView = () => {

    // States
    let [repoUrl, setRepoUrl] = useState(null);

    const [accessToken, setAccessToken] = useState(null);
    const [isTokenSetted, setIsTokenSetted] = useState(null);

    const [leaderboard, setleaderboard] = useState(null);
    const [isLeaderboardFetching, setIsleaderboardFetching] = useState(null);

    const [requestError, setRequestError] = useState(null);
    const [serverError, setServerError] = useState(null);


    // Functions

    const getLeaderbroad = (event) => {

        event.preventDefault()
        setRequestError(null);
        setIsleaderboardFetching(true);

        // Check if token exist 
        if (!localStorage.getItem("Token")) {
            setIsTokenSetted(false)

            // Send The request 
        } else {
            axios
                .get(`/api/github-leaderboard/?repoUrl=${repoUrl}&accessToken=${accessToken}`)
                .then(({ data }) => {
                    setIsleaderboardFetching(false)
                    if (data.success) {
                        setleaderboard(data.leaderboard)
                    } else {
                        setRequestError(data.error)
                    }
                })
                .catch((err) => {
                    setServerError(err.message)
                })
        }
    }

    const saveToken = (event) => {
        event.preventDefault();
        localStorage.setItem("Token", accessToken)
        setIsTokenSetted(true);
    }

    return (
        <Fragment>
            {
                serverError ?
                    <h1>
                        {serverError}
                    </h1>
                    :
                    <div>
                        {
                            !isTokenSetted ?
                                <Popup open={true} closeOnDocumentClick={false} position="right center">
                                    <Template
                                        onSubmitFun={saveToken}
                                        id="accessTokenInput"
                                        placeholder="Enter your github access token"
                                        onChangeFun={setAccessToken}
                                        btnLabel="Save Token"
                                    />
                                </Popup>
                                :
                                null
                        }
                        <Navbar
                            brand="Leaderboard"
                            links={[]}
                            backgroundColor="#2196f3" />

                        <Template
                            onSubmitFun={getLeaderbroad}
                            id="repoUrlInput"
                            placeholder="Enter the github repo link"
                            onChangeFun={setRepoUrl}
                            btnLabel="Generate Leaderboard"
                        />

                        {
                            requestError ?
                                <h5 color="red">{requestError}</h5>
                                :
                                null
                        }

                        {
                            isLeaderboardFetching ?
                                <CircularProgress />
                                :
                                leaderboard ?
                                    <Leaderboard items={leaderboard} />
                                    :
                                    null
                        }

                    </div>
            }

        </Fragment >
    );
}

export default MainView;