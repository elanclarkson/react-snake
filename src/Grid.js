import React, { Component } from 'react';

class Grid extends Component {
	render() {

		// Map rows
		const grid = this.props.grid.map((row, index) => {
			
			// Map cols
			const cols = row.map((col, index) => {
				return (
					<div className={`col ${col}`} key={index}></div>
				);
			});

			// Returm rows with cols
			return (
				<div className="row" key={index}>
					{cols}
				</div>
			);
		});

		return (
			<div id="grid">
				<div id="game-over-container">
					<div>
						<h2>Game Over</h2>
						<p>Your Score:</p>
						<h1>{this.props.score}</h1>
						<button type="button" onClick={() => this.props.onRestart()}>Restart</button>
					</div>
				</div>
				{grid}
			</div>
		);
	}
}

export default Grid;