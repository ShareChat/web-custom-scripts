# Documentation Coverage Plugin

## Install

```

To be published on npm for now follow the following steps to run -

  1. clone the repo - git clone git@github.com:ShareChat/web-custom-scripts.git
  2. cd web-custom-scripts
  3. npm install . -g (If getting permission errors try -> sudo npm install . -g). Now the script can be used globally.
  4. Go to the project directory for which coverage is to be calculated.
  5. Create a .doccoverage.json file in the root of the project.
  6. For help on the config file created in step 5, refer 'Config Help' section
  7. Run the command "doc" in the terminal in root directory to get coverage.
  8. A folder called doc-coverage is created in the root. It contains a detailed coverage report.

```

## Config Help

```

Config refers to the json that need to be added in .doccoverage.json file. Following are the available keys with description.

  1. source - Path to the source folder.
  2. excludedPaths - Array of Path regex to be ignored while calculating JSDoc Coverage.
  3. excludedComponentPaths - Array of Path regex to be ignored while calculating Component File Coverage(inside components folder).
   * Example - if only index files are to be considered for stories, add "^((?!index.js).)*$" in the array. This ignores all files except index.
  4. foldersWithComponentFiles - Array of folder names containing all UI components.
  5. storiesFolderPath - Path to the stories folder to be provided if it is outside the source folder.
  6. ecmaVersion - ECMA Script Version (required for parsing into ast), by default latest is used.
  7. framework - framework used (currently react, vue and svelte are supported), by default react.

```

## Ignore a Component File

```
  If a particular Component file is to be ignored and a genric path regex to exclude cannot be created -
  Add '/* !Doc Coverage Ignore */' as the first line in the file.

  Example of a situation when one might need to ignore a file -
  A small Component file with no props, for which niether storybook nor proptype is required.

```

## Sample Config

```javascript
{
	"source": "./src",
	"excludedPaths": ["/assets/", "/components/","/containers/", "/__test__/", "/config./"],
	"excludedComponentPaths": ["/__test__/", "^((?!index.js).)*$"],
	"foldersWithComponentFiles": ["components", "containers"],
	"storiesFolderPath": "./stories",
  "framework": "svelte"
}

```

## Default Config

```
If no config is provided, the following is used as the default config

{
        source: './src',
        excludedPaths: [
          '/assets/',
          '/components/',
          '/containers/',
          '/__test__/',
          '/config./',
          '__snapshots__',
        ],
        excludedComponentPaths: ['/__test__/'],
        foldersWithComponentFiles: ['components', 'containers'],
        storiesFolderPath: './stories',
 }

```

## Results Summary in console

```

Refer the following image link for example.
https://user-images.githubusercontent.com/92925973/142974147-12e32043-8102-4b81-914b-0a1ae5b7b3c8.png

   We get 4 tables in the console -

   1. JSDoc Coverage - For Non Component files. The script looks for leading JSDoc comments for all top level blocks of a file.
      ( 1 scope = 1 top level block/function )

   2. Component File Coverage - A Component File is considered fully documented if it is either imported in atleast one '.stories' file or has prop types defined.
      We get 2 scores in this table -
      	1. Fully Covered Files - Fully documented files / Total files
	2. PropTypes Coverage - num of prop types / total props

   3. Completely Covered File - combined score of JSDoc and Component (Fully Covered Files)

   4. Total Coverage - combined score of JSDoc and Component (PropTypes Coverage)

```

## Detailed Coverage Report

```
 A file called docCoverageReport.json is created under a directory called doc-coverage which contains the file wise coverage.

 Apart from giving the same information as the tables in console it has 2 extra keys -
 1. fileWiseCoverageJSDoc - Object with file path as the key.
    Example:
    "/Users/shivanisehgal/Desktop/pwa-sharechat/src/firebase-messaging-amp.sw.js": {
            "funcCoverage": {
                "urlB64ToUint8Array": false,
                "onMessageReceivedSubscriptionState": true,
                "onMessageReceivedSubscribe": true,
                "onMessageReceivedUnsubscribe": true,
                "broadcastReply": true,
                "persistSubscriptionLocally": true
            },
            "fileCoverage": "83.33%"
        },

 2. fileWiseCoverageComponent - Object with file path as the key.
    Example:
    "/Users/shivanisehgal/Desktop/pwa-sharechat/src/components/molecules/IndefiniteLoading/index.js": {
            "hasStory": false,
            "hasAllPropTypes": false,
            "componentType": "Functional",
            "missingPropTypes": [
                "error",
                "timedOut",
                "pastDelay"
            ],
            "coverage": 25
    }


```

## Important Note

```
To get an accurate proptypes coverage, avoid rest operator for props where ever possible.
Currently this syntax is not identified by the parser => {props.something}.

The curly braces used to evaluate a JavaScript expression are read as an object by the parser
and hence is not able to give us the property name.
```
