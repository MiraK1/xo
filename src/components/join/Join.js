/** @format */

import React, { useState } from "react";
import { Link } from "react-router-dom";

import "./Join.css";
const Join = () => {
	const [name, setName] = useState("");
	const [codeGame, setCodeGame] = useState("");

	return (
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
						placeholder='codeGame'
						className=''
						type='text'
						onChange={(event) => setCodeGame(event.target.value)}
					/>
				</div>
				<Link
					className='Link'
					onClick={(event) =>
						!name || !codeGame ? event.preventDefault() : null
					}
					to={`/game?name=${name}&codeGame=${codeGame}`}>
					<button className='' type='submit'>
						Sign In
					</button>
				</Link>
			</div>
		</div>
	);
};

export default Join;
