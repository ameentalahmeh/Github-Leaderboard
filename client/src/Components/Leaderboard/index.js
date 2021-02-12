import React from "react";
import { ListGroup } from 'react-bootstrap';



const Leaderboard = (props) => {

    let { items } = props;

    return (
        <ListGroup style={{ width: "90%" }}>
            {
                items && items.map((item, idx) => {
                    return (
                        <ListGroup.Item
                            key={idx}
                        >
                            <h6>{(idx + 1) + "."}</h6>
                            <img src={item.avatorUrl} alt={item.login + " avator"} />
                            <h6>{item.name ? item.name : item.login}</h6>
                            <div className="UpdatesContainer">
                                <p className="additions">{item.additions + " additions"}</p>
                                <p className="" color="red">{item.deletions + " deletions"}</p>
                                <p className = "" color="black">{item.updates + " updates"}</p>

                            </div>
                        </ListGroup.Item>
                    )
                })
            }
        </ListGroup>
    )
}

export default Leaderboard;