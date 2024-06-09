# Project Title

This project is a Vue.js application that visualizes a graph using the v-network-graph library and provides a solver for logical expressions. It is hosted at [resolutionsolver.mayzelf.xyz](http://resolutionsolver.mayzelf.xyz).

## Files

### Graph.vue

This Vue component is responsible for rendering a graph. It uses the v-network-graph library to visualize nodes and edges. The layout of the graph can be changed between "Top to Bottom" and "Left to Right" using a dropdown menu.

### solver.ts

This TypeScript file contains the logic for solving logical expressions. It provides a `solve` function that takes a user input string, validates it, and then processes it to find a solution. The solution is returned as an array of strings or a string message if the input format is incorrect.

## Usage

To use this application, simply input your logical expression into the provided input field and click the "Solve" button. The solution will be displayed in the output area. You can also visualize the logical expression as a graph by clicking the "Visualize" button.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
