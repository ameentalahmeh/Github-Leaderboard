import React, { useState, Fragment } from "react";
import axios from "axios";
import { Navbar } from 'react-responsive-navbar-overlay';
import { MarkGithubIcon } from "@primer/octicons-react";
import { CircularProgress } from '@material-ui/core';
import Popup from 'reactjs-popup';

import Template from "../../Components/Template";
import Leaderboard from "../../Components/Leaderboard";

import 'reactjs-popup/dist/index.css';
import './HomePage.css';

const MainView = () => {

    // States
    const [repoUrl, setRepoUrl] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [leaderboard, setLeaderboard] = useState(null);

    const [openModel, setOpenModel] = useState(false);
    const [isLeaderboardFetching, setIsleaderboardFetching] = useState(false);

    const [requestError, setRequestError] = useState(null);
    const [serverError, setServerError] = useState(null);


    // Functions

    const updateStates = () => {
        setIsleaderboardFetching(!!localStorage.getItem("Token"));
        setRequestError(null);
        setLeaderboard(null);
    }

    const getLeaderbroad = (event) => {
        event.preventDefault();
        updateStates();
        if (localStorage.getItem("Token")) {
            axios
                .get(`/api/github-leaderboard/?repoUrl=${repoUrl}&accessToken=${localStorage.getItem("Token")}`)
                .then(({ data }) => {
                    setIsleaderboardFetching(false)
                    if (data.success) {
                        setLeaderboard(data.leaderboard)
                    } else {
                        setRequestError(data.error)
                    }
                })
                .catch((err) => {
                    setServerError(err.message)
                })
        } else {
            setOpenModel(true);
        }
    }

    const saveToken = (event) => {
        event.preventDefault();
        updateStates();
        setOpenModel(false);
        localStorage.setItem("Token", accessToken);
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
                        <MarkGithubIcon className="GithubIcon" size={50} />
                        <Navbar
                            brand="Leaderboard"
                            links={[]}
                            backgroundColor="#2196f3"
                        />

                        <Template
                            onSubmitFun={getLeaderbroad}
                            id="repoUrlInput"
                            placeholder="Enter the github repo link"
                            onChangeFun={setRepoUrl}
                            btnLabel="Generate Leaderboard"
                        />

                        {
                            requestError ?
                                <h5>{requestError}</h5>
                                :
                                null
                        }

                        {
                            openModel ?
                                <Popup open={true} onClose={() => setOpenModel(false)} position="top center">
                                    <Template
                                        onSubmitFun={saveToken}
                                        id="accessTokenInput"
                                        placeholder="Enter your github access token"
                                        onChangeFun={setAccessToken}
                                        btnLabel="Save Token"
                                        formtext={["You need the Access Token if don't have, create ", <a href="https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token">one</a>]}
                                    />
                                </Popup>
                                :
                                isLeaderboardFetching && !leaderboard ?
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