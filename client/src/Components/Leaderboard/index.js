import React from "react";
import { ListGroup } from 'react-bootstrap';
import "./Leaderboard.css";


const Leaderboard = (props) => {

    let { items } = props;

    return (
        <ListGroup>
            {
                items && items.map((item, idx) => {
                    return (
                        <ListGroup.Item key={idx}>
                            <h6>{(idx + 1) + "."}</h6>
                            <img src={item.url + ".png"} alt={item.login + " avator"} />
                            <h6>{item.name ? item.name : item.login}</h6>
                            <div className="UpdatesContainer">
                                <p>
                                    <span className="additions">{item.additions + " additions"}</span>
                                    <span> + </span>
                                    <span className="deletions">{item.deletions + " deletions"}</span>
                                </p>
                                <p className="updates">
                                    = {item.updates + " updates"}
                                </p>

                            </div>
                        </ListGroup.Item>
                    )
                })
            }
        </ListGroup>
    )
}

export default Leaderboard;