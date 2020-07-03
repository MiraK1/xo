/** @format */

import React, { Component } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import { Redirect } from "react-router-dom";
import "./Game.css";

let socket;

class Game extends Component {
	constructor(props) {
		super(props);
		this.state = {
			ENDPOINT: "https://mirak-xoapp.herokuapp.com/",
			name: "",
			codeGame: "",
			user: "",
			played: [],
			playedIcon: ["", "", "", "", "", "", "", "", ""],
			classList: ["", "", "", "", "", "", "", "", ""],
			turn: true,
			My: false,
			count: 0,
			whenToPlay: 0,
			Icon: ["X", "O"],
			error: false,
			win: false,
			ListWin: [],
		};
	}
	componentDidMount() {
		const { name, codeGame } = queryString.parse(this.props.location.search);
		socket = io(this.state.ENDPOINT);
		this.preprocessing({ name, codeGame });
		socket.on("Move", ({ Move }) => {
			if (!this.checkIfWin(this.state.played)) {
				this.update(Move);
			}
		});
		socket.on("UserJoined", async (users) => {
			users = users.filter((user) => {
				return user.name.toLowerCase() !== this.state.name.toLowerCase();
			});
			const op = users[0];
			if (op) {
				this.setState({
					user: op.name.toUpperCase(),
				});
			}
		});
		socket.on("UserLeft", async (users) => {
			await this.setState({
				user: "",
			});
		});
	}

	preprocessing = async ({ name, codeGame }) => {
		await this.setState({
			name: name.toUpperCase(),
			codeGame: codeGame.toLowerCase(),
		});

		socket.emit("join", { name, codeGame }, async (error) => {
			if (error) {
				alert(error);
				await this.setState({
					error: true,
				});
			}
		});
	};

	update = async (Move) => {
		const played = [...this.state.played, Move];
		const playedIcon = [...this.state.playedIcon];
		playedIcon[Move - 1] = this.state.Icon[played.length % 2];
		let turn;
		if (this.state.whenToPlay === played.length && this.state.turn === false) {
			turn = true;
		} else if (this.state.turn === true) {
			turn = true;
		} else {
			turn = false;
		}
		await this.setState({
			played,
			playedIcon,
			count: this.state.count + 1,
			turn,
		});
		this.checkIfWin(this.state.played);
	};

	clickOn = async (Move) => {
		if (
			this.state.played.indexOf(Move) === -1 &&
			this.state.played.length < 9 &&
			this.state.turn === true &&
			this.state.user !== "" &&
			!this.checkIfWin(this.state.played)
		) {
			socket.emit("sendMove", Move, () => {});
			await this.setState({
				turn: false,
				whenToPlay: this.state.played.length + 2,
			});
		}
	};

	checkIfWin = (lst) => {
		const possibleWin = [
			[1, 2, 3],
			[4, 5, 6],
			[7, 8, 9],
			[1, 4, 7],
			[2, 5, 8],
			[3, 6, 9],
			[1, 5, 9],
			[3, 5, 7],
		];

		let win = false;
		let possibility;
		for (let i = 0; i < 8; i++) {
			possibility = possibleWin[i];
			let list = possibility.map((item) =>
				lst.indexOf(item) === -1 ? -1 : lst.indexOf(item) % 2,
			);

			if (
				(list.indexOf(1) === -1 || list.indexOf(0) === -1) &&
				list.indexOf(-1) === -1
			) {
				const classList = [...this.state.classList];
				possibility.forEach((item) => {
					classList[item - 1] = "green";
				});
				this.setState({
					classList,
					win,
					ListWin: possibility,
				});

				return true;
			}
		}
		return win;
	};

	render() {
		if (this.state.error) {
			return <Redirect to='/' />;
		}
		return (
			<div className='outerContainer'>
				<div className='playerContainer'>
					<div className='profile'>
						<div className='head'></div>
						<div className='body'></div>
					</div>
					<div className='play1'>
						<h5>Name : {this.state.name}</h5>
						<h6>Game Code :{this.state.codeGame}</h6>
					</div>
				</div>
				<div className='game'>
					<div className='row'>
						<div
							className={`col ${this.state.classList[1 - 1]}`}
							onClick={() => this.clickOn(1)}>
							{this.state.playedIcon[1 - 1]}
						</div>
						<div
							className={`col ${this.state.classList[2 - 1]}`}
							onClick={() => this.clickOn(2)}>
							{this.state.playedIcon[2 - 1]}
						</div>
						<div
							className={`col ${this.state.classList[3 - 1]}`}
							onClick={() => this.clickOn(3)}>
							{this.state.playedIcon[3 - 1]}
						</div>
					</div>
					<div className='row'>
						<div
							className={`col ${this.state.classList[4 - 1]}`}
							onClick={() => this.clickOn(4)}>
							{this.state.playedIcon[4 - 1]}
						</div>
						<div
							className={`col ${this.state.classList[5 - 1]}`}
							onClick={() => this.clickOn(5)}>
							{this.state.playedIcon[5 - 1]}
						</div>
						<div
							className={`col ${this.state.classList[6 - 1]}`}
							onClick={() => this.clickOn(6)}>
							{this.state.playedIcon[6 - 1]}
						</div>
					</div>
					<div className='row'>
						<div
							className={`col ${this.state.classList[7 - 1]}`}
							onClick={() => this.clickOn(7)}>
							{this.state.playedIcon[7 - 1]}
						</div>
						<div
							className={`col ${this.state.classList[8 - 1]}`}
							onClick={() => this.clickOn(8)}>
							{this.state.playedIcon[8 - 1]}
						</div>
						<div
							className={`col ${this.state.classList[9 - 1]}`}
							onClick={() => this.clickOn(9)}>
							{this.state.playedIcon[9 - 1]}
						</div>
					</div>
				</div>
				<div className='playerContainer'>
					<div className='play2'>
						<h5>Name : {this.state.user}</h5>
						<h6>Game Code :{this.state.codeGame}</h6>
					</div>
					<div className='profile'>
						<div className='head'></div>
						<div className='body'></div>
					</div>
				</div>
			</div>
		);
	}
}
export default Game;
