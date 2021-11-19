# elea

This is a little tool designed to prototype evolutionary algorithms, get an intuition for runtimes or for teaching EAs to students.

## Run

- install nodeJS with npm
- run `npm i` to install the dependencies
- run `npm run start` to run the application

You can find the application at `localhost:1234` propably.

## Write new blocks
Steps:
1. Think of all the connections you need and build your block in the [block factory](https://blockly-demo.appspot.com/static/demos/blockfactory/index.html): 
2. Copy the json definition into the `newblocks.js` or similar JS file and include it
3. Also copy the JS code stub from the factory into this JS file.
4. Add the block to the toolbox in any category via its name (roughly in lines 5-150 in index.html). You should now be able to see it in the toolbox and use it.
5. In order to actually do something, you need to replace the generated code with actual code. I essence, you need to return valid JS code in a string (ES5). Since debugging parsing errors is rather hard in this environment I suggest to try atomic expressions you want to use in [this live demo](https://neil.fraser.name/software/JS-Interpreter/). Anything that does not work there will not work in blockly either. Goodbye arrow-functions and other syntactic sugar of ES6!
6. You should now have a working block 🎉

Additional things to consider:
Variables and functions could collide with user defined objects. Blockly can handle this for you, if you let it. You need to ask for valid names etc. In its current state, the documentation is barely understandable and does not prominently mention all necessary functions, I find the predefined open source blocks much more helpful: https://github.com/google/blockly/blob/master/generators/javascript/math.js
