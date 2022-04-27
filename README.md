# elea
[![Netlify Status](https://api.netlify.com/api/v1/badges/97afa409-81fc-468e-abfc-5d06578b1dd6/deploy-status)](https://app.netlify.com/sites/hpi-elea/deploys) ![github actions](https://github.com/hpi-elea/elea/actions/workflows/lint.yml/badge.svg)

This is a little tool designed to prototype evolutionary algorithms, get an intuition for runtimes or for teaching EAs to students.

## Run

- install nodeJS with npm
- run `npm i` to install the dependencies
- run `npm run start` to run the application

You can find the application at `localhost:1234` propably.

## More commands for developer

- run `npm run lint` to show current linting errors and warnings
- run `npm run prettier` to fix formating errors

## Write new blocks

Steps:

1. Think of all the connections you need and build your block in the [block factory](https://blockly-demo.appspot.com/static/demos/blockfactory/index.html):
2. Copy the json definition into the `static/blockDefinition/normalBlocks.js` or similar JS file and include it. Add a `tooltip` to the block and `comment`s to the input to help our users understand your block. If you want to do type-checking, make sure to add the type of your input and output as described in the [blockly documentation](https://developers.google.com/blockly/guides/create-custom-blocks/variables#typed_variable_blocks). Use the `Array`-type to request a population and `Individual` to request an individual from the population.
3. Also copy the JS code stub from the factory into this JS file.
4. Add the block to the toolbox in any category via its name (roughly in lines 200-450 in workspace.html). You should now be able to see it in the toolbox and use it.
5. In order to actually do something, you need to replace the generated code with actual code. I essence, you need to return valid JS code in a string (ES5). Since debugging parsing errors is rather hard in this environment I suggest to try atomic expressions you want to use in [this live demo](https://neil.fraser.name/software/JS-Interpreter/). Anything that does not work there will not work in blockly either. Goodbye arrow-functions and other syntactic sugar of ES6!
6. You should now have a working block 🎉

Additional things to consider:
Variables and functions could collide with user defined objects. Blockly can handle this for you, if you let it. You need to ask for valid names etc. In its current state, the documentation is barely understandable and does not prominently mention all necessary functions, I find the predefined open source blocks much more helpful: https://github.com/google/blockly/blob/master/generators/javascript/math.js

![blockly](https://developers.google.cn/blockly/images/logos/logo_knockout.png)
