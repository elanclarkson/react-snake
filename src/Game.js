import React, { Component } from 'react';

import Settings from './Settings.js';
import Grid from './Grid.js';

const EMPTY_CLASS = 'empty';
const SNAKE_HEAD_CLASS = 'head';
const SNAKE_BODY_CLASS = 'body';
const SNAKE_TAIL_CLASS = 'tail';
const FRUIT_CLASS = 'fruit';

const GAME_SPEED_SLOW = 150;
const GAME_SPEED_NORMAL = 100;
const GAME_SPEED_FAST = 50;
const GAME_SPEED_INSANE = 20;

const initialState = {
	grid: Array(Settings.gridSize[1]).fill(Array(Settings.gridSize[0]).fill(EMPTY_CLASS)),
	snake: [
		[Settings.gridSize[1] / 2 - 1, 5], // Head
		[Settings.gridSize[1] / 2 - 1, 4]
	],
	direction: 'right',
	snakeDirection: 'right', // There is a delay between the specified direction above and the direction the snake is going in
	score: 0,
	gameOver: false
};

let gameSpeed = GAME_SPEED_NORMAL;

class Game extends Component {

	constructor(props) {
		super(props);

		this.state = initialState;
	}

	componentDidMount() {
		document.title = "Snake - ReactJS";
		this.start();
	}

	render() {
		return (
			<div id="game" className={this.state.gameOver ? 'game-over' : ''}>
				<div>
					<h3>Score: {this.state.score}</h3>
				</div>

				<Grid grid={this.state.grid} score={this.state.score} onRestart={() => this.handleRestart()} />

				<div>
					Game Speed:
					&nbsp;
					<select onChange={e => this.handleGameSpeedChange(e)} value={gameSpeed}>
						<option value={GAME_SPEED_SLOW}>Slow</option>
						<option value={GAME_SPEED_NORMAL}>Normal</option>
						<option value={GAME_SPEED_FAST}>Fast</option>
						<option value={GAME_SPEED_INSANE}>Insane</option>
					</select>
				</div>
			</div>
		);
	}

	handleGameSpeedChange(event) {
		gameSpeed = event.target.value;
		event.target.blur(); // Prevent accidentally changing again
	}

	// Sets direction on state according to direction keys pressed
	// Does nothing if attempting to go in opposite direction (and hence bring snake back on itself)
	// Prevents snake from going back on itself if player turns snake around faster than the gameSpeed interval
	// by comparing to the snake's current direction rather than the last direction the player tried to go in
	handleKeyDown(e) {
		//e.preventDefault(); // prevent the default action (scroll / move caret)

		switch(e.which) {
	        case 65: //case 37: // left
	        	if (this.state.snakeDirection !== 'right') {
	        		this.setState({direction: 'left'});
	        	}
	        break;

	        case 87: //case 38: // up
	        	if (this.state.snakeDirection !== 'down') {
	        		this.setState({direction: 'up'});
	        	}
	        break;

	        case 68: //case 39: // right
	        	if (this.state.snakeDirection !== 'left') {
	        		this.setState({direction: 'right'});
	        	}
	        break;

	        case 83: //case 40: // down
	       		if (this.state.snakeDirection !== 'up') {
	        		this.setState({direction: 'down'});
	        	}
	        break;

	        default: return; // exit this handler for other keys
	    }
	}

	start() {
		// Bind key presses
		document.addEventListener('keydown', e => this.handleKeyDown(e), false);

		this.setState(previousState => {
			let grid = JSON.parse(JSON.stringify(previousState.grid));
			this.spawnFruit(grid);

			return {
				grid: grid
			};
		});

		// Kick off tick recursion function
		this.tick()
	}

	handleRestart() {
		this.setState(initialState, this.start);
	}

	tick() {

		// Will be false if player loses
		this.updateSnakePosition();

		// Rerender
		// Don't need to manually rerender because setState will do this within updateSnakePosition
		// this.render();

		// Carry on if game isn't over
		if (!this.state.gameOver) {
			// Recursion
			setTimeout(() => this.tick(), gameSpeed);
		}

	}

	spawnFruit(grid) {
		let x, y;

		do {
			x = getRandomInt(0, Settings.gridSize[1] - 1);
			y = getRandomInt(0, Settings.gridSize[0] - 1);
		} while (grid[x][y] !== EMPTY_CLASS);

		grid[x][y] = 'fruit';
	}

	updateSnakePosition() {

		this.setState(previousState => {
			let grid = JSON.parse(JSON.stringify(previousState.grid));
			let snake = JSON.parse(JSON.stringify(previousState.snake));
			let score = previousState.score;
			let gameOver = previousState.gameOver;
			let snakeDirection = previousState.snakeDirection;

			let shouldSpawnFruit = false;

			// Loop through snake pieces
			for (var i = 0; i < snake.length; i++) {

				let type = SNAKE_BODY_CLASS;

				// Empty old snake position if the game isn't over and it isn't the head class
				// This check is to allow the snake head to 'overlap' with the tail momentarily since it moves before the tail does
				if (!gameOver && grid[snake[i][0]][snake[i][1]] !== SNAKE_HEAD_CLASS) {
					grid[snake[i][0]][snake[i][1]] = EMPTY_CLASS;
				}

				// Store previous position in the next two array slots
				snake[i][2] = snake[i][0];
				snake[i][3] = snake[i][1];

				// Move head
				if (i === 0) {

					// Move snake head according to current direction
					switch (previousState.direction) {
						case 'left':
							snake[i][1]--;
						break;
						case 'up':
							snake[i][0]--;
						break;
						case 'right':
							snake[i][1]++;
						break;
						case 'down':
							snake[i][0]++;
						break;

						default: snake[1]++;
					}

					type = SNAKE_HEAD_CLASS;
					snakeDirection = previousState.direction;
				}
				// Move tail / body
				else {
					// Move snake tail/body in place of the previous position of the snake piece it is connected to
					snake[i][0] = snake[i - 1][2];
					snake[i][1] = snake[i - 1][3];

					if (i === snake.length - 1) {
						type = SNAKE_TAIL_CLASS;
					}
				}

				// Cycle snake if exceeding map dimensions

				// Right
				if (snake[i][1] === Settings.gridSize[0]) {
					snake[i][1] = 0;
				}

				// Left
				if (snake[i][1] === -1) {
					snake[i][1] = Settings.gridSize[0] - 1;
				}

				// Top
				if (snake[i][0] === -1) {
					snake[i][0] = Settings.gridSize[1] - 1;
				}

				// Bottom
				if (snake[i][0] === Settings.gridSize[1]) {
					snake[i][0] = 0;
				}

				// Handle collisions
				// Count a collision if the snake head is attempting to go into a space which isn't empty OR which is the tail
				// This is to allow the head to 'overlap' with the tail momentarily since it moves before the tail does
				if (i === 0 && (grid[snake[i][0]][snake[i][1]] !== EMPTY_CLASS || grid[snake[i][0]][snake[i][1]] === SNAKE_TAIL_CLASS)) {
					switch (grid[snake[i][0]][snake[i][1]]) {

						case FRUIT_CLASS:
							// Add snake tail
							snake.push([
								snake[snake.length - 1][2],
								snake[snake.length - 1][3]
							]);

							// Spawn more fruit
							shouldSpawnFruit = true;

							// Increment score
							score++;
						break;
						case SNAKE_TAIL_CLASS:
							// Carry on because the tail will move by the end of this loop
						break;

						// Game over if collision is with the snake body
						default:
							gameOver = true;
						break;
					}
				}

				// Set new snake position in grid if the game isn't over
				if (!gameOver) {
					grid[snake[i][0]][snake[i][1]] = type;
				}

			}

			// Spawn fruit after grid has finished changing
			if (shouldSpawnFruit) {
				this.spawnFruit(grid);
			}

			// Update state
			return {
				grid: grid,
				snake: snake,
				snakeDirection: snakeDirection,
				score: score,
				gameOver: gameOver
			};
		});

	}

}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 * https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default Game;