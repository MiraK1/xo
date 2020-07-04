/** @format */

import React, { useState } from "react";
import { Link } from "react-router-dom";

import "./Join.css";
const Join = () => {
	const [name, setName] = useState("");
	const [game, setGame] = useState("");

	return (
		<div className='container'>
			<div className='joinOuterContainer'>
				<div className='joinInnerContainer'>
					<h1 className='heading'>M7GE</h1>
					<div>
						<input
							placeholder='Name'
							className=''
							type='text'
							onChange={(event) => setName(event.target.value)}
						/>
					</div>
					<div>
						<input
							placeholder='game'
							className=''
							type='text'
							onChange={(event) => setGame(event.target.value)}
						/>
					</div>
					<button>
						<Link
							className='Link'
							onClick={(event) =>
								!name || !game ? event.preventDefault() : null
							}
							to={`/game?name=${name}&game=${game}`}>
							Sign In
						</Link>
					</button>
				</div>
			</div>
		</div>
	);
};

export default Join;
