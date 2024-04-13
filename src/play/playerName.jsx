import React from "react";

import './playerName.css'

export function PlayerName({ userName, userIcon}) {
    const icon = "https://robohash.org/" + userIcon + ".png";

    return (
        <div className="playAreaPlayer">
            <img className="userIcon playerIcon" src={icon} />
            <span className="playAreaName">{userName}</span>
        </div>
    );
}