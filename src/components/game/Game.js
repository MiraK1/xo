/** @format */

import React, { Component } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import { Redirect } from "react-router-dom";
import "./Game.css";
// "https://mirak-xoapp.herokuapp.com/"
// "http://192.168.0.102:5000"
let socket;

class Game extends Component {
	constructor(props) {
		super(props);
		this.state = {
			ENDPOINT: "https://mirak-xoapp.herokuapp.com/",
			name: "",
			game: "",
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
		const { name, game } = queryString.parse(this.props.location.search);

		socket = io(this.state.ENDPOINT);
		this.preprocessing({ name, game });
		socket.on("Update", async (Game) => {
			// Game = JSON.parse(Game);
			this.update(Game);
			// this.checkIfWin(this.state.played, this.state.turn);
		});
	}

	componentWillUnmount() {
		socket.emit("disconnect");
		socket.off();
	}

	preprocessing = async ({ name, game }) => {
		await this.setState({
			name: name.toUpperCase(),
			game: game.toLowerCase(),
		});
		socket.emit(
			"join",
			{ name: this.state.name, game: this.state.game },
			async (error) => {
				if (error) {
					alert(error);
					await this.setState({
						error: true,
					});
				} else {
					console.log("success");
				}
			},
		);
	};

	checkIfWin = (lst, turn) => {
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

		let possibility;
		const classList = ["", "", "", "", "", "", "", "", ""];
		for (let i = 0; i < 8; i++) {
			possibility = possibleWin[i];
			possibility = possibility.map((i) => i - 1);
			let list = possibility.map((item) =>
				lst.indexOf(item) === -1 ? -1 : lst.indexOf(item) % 2,
			);

			if (
				(list.indexOf(1) === -1 || list.indexOf(0) === -1) &&
				list.indexOf(-1) === -1
			) {
				possibility.forEach((i) => {
					if (turn) {
						classList[i] = "green";
					} else {
						classList[i] = "red";
					}
				});
				this.setState({
					classList,
				});
				return true;
			}
		}
		return false;
	};

	update = async (Game) => {
		if (this.state.game === Game.game.toLowerCase()) {
			let user = "";
			Game.users.forEach((User) => {
				if (User.username !== this.state.name) {
					user = User.username;
				}
			});
			const played = Game.moves;
			if (played.length === 0) {
				await this.setState({
					turn: true,
					classList: ["", "", "", "", "", "", "", "", ""],
				});
			}
			const playedIcon = ["", "", "", "", "", "", "", "", ""];
			this.checkIfWin(played, this.state.turn);
			if (this.state.whenToPlay === played.length) {
				await this.setState({
					turn: true,
				});
			}
			played.forEach((value, index) => {
				playedIcon[value] = this.state.Icon[index % 2];
			});
			await this.setState({
				user,
				played,
				playedIcon,
			});
		}
	};

	clickOn = (Move) => {
		if (
			this.state.played.indexOf(Move - 1) === -1 &&
			this.state.played.length < 9 &&
			this.state.turn === true &&
			this.state.user !== "" &&
			!this.checkIfWin(this.state.played, this.state.turn)
		) {
			socket.emit(
				"sendMove",
				{ Move: Move - 1, name: this.state.name, game: this.state.game },
				async () => {
					await this.setState({
						turn: false,
						whenToPlay: this.state.played.length + 1,
					});
				},
			);
		}
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
						<h6>Game Code :{this.state.game}</h6>
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
						<h6>Game Code :{this.state.game}</h6>
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
