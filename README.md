# React.js - Snake-like Game Experiment

**How To Play**

Run `npm install && npm run start`.

Control the snake with standard W/A/S/D controls (you may need to click the game to gain focus).

**About**

Since I was 15 years old I've had this idea to develop a Snake-like game where everything on-screen was represented by a 2-dimensional array, thereby abstracting logic and data manipulation from the view.

It may not be the best way to develop a game like this (Canvas would probably be better), but after reading about the Virtual DOM in React.js I couldn't wait to finally give this concept a go!

Everything contained in the game grid is stored in a 2-dimensional array, which is then easily translated into div elements with corresponding css classes in the DOM. This is all thanks to the way React.js handles DOM manipulation.

**Improvements**

This is my first ever React.js project, so naturually there are improvements I would make if I had the time:

1. Separate collision detection into another function. (limitations with React.js's built-in state management made this difficult, but there is probably a way if using Redux or something similar.)
2. Mutate and return object clones rather than mutating directly. (E.g. in spawnFruit(grid) - Javascript shamelessly passes arguments by reference, so I didn't see the point in adding overhead by copying objects on every game tick when I could mutate them directly. However on second thought this is a much better design pattern.)
3. General refactoring to ensure best separation of concerns. (E.g. moving Snake into separate component rather than having as part of Game component.)