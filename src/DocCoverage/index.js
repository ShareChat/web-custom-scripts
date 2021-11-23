#! /usr/bin/env node

const StorybookCoverage = require('./DocCoverageUtils/storybookCoverage');
const PropTypesCoverage = require('./DocCoverageUtils/propTypesCoverage');
const walk = require('../Utils/walk');
const printOutputSummary = require('./DocCoverageUtils/printOutputSummary');
const generateReportFile = require('./DocCoverageUtils/generateReportFile');
const generateAst = require('./DocCoverageUtils/generateAst');
const generateAstWithComments = require('./DocCoverageUtils/generateAstWithComments');
const getCoveragePercentage = require('./DocCoverageUtils/getCoveragePercentage');

class DocumentationCoverage {
  static getFunctionCount(response) {
    let expectedCount = 0;
    let actualCount = 0;

    Object.keys(response).forEach((property) => {
      const obj = response[property].funcCoverage;
      Object.keys(obj).forEach((innerProperty) => {
        expectedCount += 1;
        if (obj[innerProperty] === true) {
          actualCount += 1;
        }
      });
    });
    return {
      expectedCount,
      actualCount,
    };
  }

  static generateReport(config) {
    let astHash = {};
    let actualCount = 0;
    let expectedCount = 0;
    let componentsMap = {};
    let totalComponents = 0;
    let numOfProps = 0;
    let numOfPropTypesDefined = 0;

    const isExcluded = (filePath, excludedPaths) => {
      if (excludedPaths && excludedPaths.length > 0) {
        for (let i = 0; i < excludedPaths.length; i += 1) {
          if (filePath.match(excludedPaths[i])) {
            return true;
          }
        }
      }
      return false;
    };

    walk(config.source, (filePath) => {
      let isJSXFile = false;
      // Find total scopes(expectCount) and documented scopes(actualCount) in non JSX files
      if (!isExcluded(filePath, config.excludedPaths)) {
        // generates ast doc

        const response = generateAstWithComments(filePath, config);

        if (response) {
          astHash = {
            ...astHash,
            ...response,
          };
          const resultObj = this.getFunctionCount(response);
          expectedCount += resultObj.expectedCount;
          actualCount += resultObj.actualCount;
        }
      }

      // Populate components Map with all JSX file paths
      config.foldersWithJSXFiles.forEach((folder) => {
        if (filePath.match(`/${folder}/`)) {
          isJSXFile = true;
        }
      });
      if (
        isJSXFile &&
        !isExcluded(filePath, config.excludedComponentPaths)
        // &&
        // filePath ===
        //   '/Users/shivanisehgal/Desktop/pwa-sharechat/src/components/molecules/ObserveIntersection/index.js'
      ) {
        const astObject = generateAst(filePath, config);
        if (astObject !== null) {
          const [isClassComponent, totalProps, missingPropTypes] =
            PropTypesCoverage.getMissingPropTypes(astObject);
          const totalPropsLength = totalProps.length;
          const missingPropTypesLength = missingPropTypes
            ? missingPropTypes.length
            : null;

          numOfProps += totalPropsLength;
          numOfPropTypesDefined += totalPropsLength - missingPropTypesLength;

          componentsMap[filePath] = {
            hasStory: false,
            hasAllPropTypes:
              missingPropTypesLength !== null
                ? missingPropTypesLength === 0
                : false,
            componentType: isClassComponent ? 'Class Based' : 'Functional',
            // props: totalProps,
            missingPropTypes:
              totalPropsLength && totalPropsLength !== missingPropTypesLength
                ? missingPropTypes
                : 'No PropTypes Found',
            coverage: totalPropsLength
              ? getCoveragePercentage(
                  totalPropsLength - missingPropTypesLength,
                  totalPropsLength
                )
              : 0,
          };
        }
      }
      totalComponents = Object.keys(componentsMap).length;

      // if story files are inside src folder
      if (!config.storiesFolderPath || config.storiesFolderPath === '') {
        componentsMap = StorybookCoverage.removeFilesWithStories(
          filePath,
          componentsMap
        );
      }
    });

    walk(config.storiesFolderPath, (filePath) => {
      componentsMap = StorybookCoverage.removeFilesWithStories(
        filePath,
        componentsMap
      );
    });

    const componentsWithStoriesOrPropTypes = Object.values(
      componentsMap
    ).filter(
      (component) =>
        component.hasStory || component.missingPropTypes?.length === 0
    ).length;
    const storyBookOrPropTypesCoveragePercent =
      totalComponents === 0
        ? 0
        : getCoveragePercentage(
            componentsWithStoriesOrPropTypes,
            totalComponents
          );

    const coveragePercent = getCoveragePercentage(actualCount, expectedCount);

    const summary = {
      jsdocCoverage: {
        expectedCount,
        actualCount,
        coveragePercent,
      },
      storyBookOrPropTypesCoverage: {
        totalComponents,
        componentsWithStoriesOrPropTypes,
        storyBookOrPropTypesCoveragePercent,
      },
      totalCoverage: {
        totalExpectedCount: numOfProps + expectedCount,
        totalActualCount: numOfPropTypesDefined + actualCount,
        totalCoveragePercent: getCoveragePercentage(
          numOfPropTypesDefined + actualCount,
          numOfProps + expectedCount
        ),
      },
      completelyCoveredFiles: {
        totalExpectedCount: totalComponents + expectedCount,
        totalActualCount: componentsWithStoriesOrPropTypes + actualCount,
        totalCoveragePercent: getCoveragePercentage(
          componentsWithStoriesOrPropTypes + actualCount,
          totalComponents + expectedCount
        ),
      },
    };

    generateReportFile(astHash, componentsMap, summary);
    printOutputSummary(summary);
  }
}
module.exports = DocumentationCoverage;
