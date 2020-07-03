/** @format */

import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Join from "./components/join/Join";
import Game from "./components/game/Game";

const App = () => (
	<Router>
		<Route path='/' exact component={Join} />
		<Route path='/game' exact component={Game} />
	</Router>
);

export default App;
