# Documentation Coverage Plugin

## Install

~~~

To be published on npm for now follow the following steps to run -

  1. clone the repo - git clone git@github.com:ShareChat/web-custom-scripts.git
  2. cd web-custom-scripts
  3. npm install . -g (If getting permission errors try -> sudo npm install . -g). Now the script can be used globally.
  4. Go to the project directory for which coverage is to be calculated.
  5. Create a .doccoverage.json file in the root of the project.
  6. For help on the config file created in step 5, refer 'Config Help' section
  7. Run the command "doc" in the terminal in root directory to get coverage.
  8. A folder called doc-coverage is created in the root. It contains a detailed coverage report.

~~~


## Config Help

~~~

Config refers to the json that need to be added in .doccoverage.json file. Following are the available keys with description.

  1. source - Path to the source folder.
  2. excludedPaths - Array of Path regex to be ignored while calculating JSDoc Coverage.
  3. excludedComponentPaths - Array of Path regex to be ignored while calculating Storybook Coverage(inside components folder).
   * Example - if only index files are to be considered for stories, add "^((?!index.js).)*$" in the array. This ignores all files except index.
  4. componentsFolderName - Name of the folder containing all UI components.
  5. storiesFolderPath - Path to the stories folder to be provided if it is outside the source folder.
  6. ecmaVersion - ECMA Script Version used in the project, by default 2020.

~~~

## Sample Config

```javascript
{
	"source": "./src",
	"excludedPaths": ["/assets/", "/components/",""/containers/"", "/__test__/", "/config./"],
	"excludedComponentPaths": ["/__test__/", "^((?!index.js).)*$"],
	"componentsFolderName": "components",
	"testFolderName": "__test__",
	"storiesFolderPath": "./stories"
}

```
