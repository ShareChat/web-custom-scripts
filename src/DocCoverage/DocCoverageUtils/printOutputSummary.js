const generateConsoleTable = (title, data) => {
  console.log(`-----------${title}------------`);
  const transformed = data.reduce((acc, { myId, ...x }) => {
    acc[myId] = x;
    return acc;
  }, {});
  console.table(transformed);
};

const printOutputSummary = (data) => {
  const {
    jsdocCoverage,
    JSXFileCoverage,
    totalCoverage,
    completelyCoveredFiles,
  } = data;

  console.log('###########################################################\n');

  generateConsoleTable('JsDoc Coverage', [
    {
      myId: 'totalScope',
      title: 'Total Scopes',
      value: jsdocCoverage.expectedCount,
    },
    {
      myId: 'documentedScopes',
      title: 'Documented Scopes',
      value: jsdocCoverage.actualCount,
    },
    {
      myId: 'coveragePercentage',
      title: 'Coverage Percentage',
      value: `${jsdocCoverage.coveragePercent}%`,
    },
  ]);

  generateConsoleTable('JSX File Coverage', [
    {
      myId: 'totalComponents',
      title: 'Total JSX Files',
      value: JSXFileCoverage.totalComponents,
    },

    {
      myId: 'componentsWithStoriesOrPropTypes',
      title: 'Fully Documented JSX Files',
      value: JSXFileCoverage.componentsWithStoriesOrPropTypes,
    },
    {
      myId: 'componentsWithStories',
      title: 'Components with stories',
      value: JSXFileCoverage.componentsWithStories,
    },
    {
      myId: 'storyBookCoveragePercent',
      title: 'Storybook Coverage percent',
      value: `${JSXFileCoverage.storyBookCoveragePercent}%`,
    },
    {
      myId: 'fullyDocumentedFileCoverage',
      title: 'Fully documented files / Total files',
      value: `${JSXFileCoverage.storyBookOrPropTypesCoveragePercent}%`,
    },
    {
      myId: 'propTypesCoverage',
      title: 'num of prop types / total props',
      value: `${JSXFileCoverage.propTypesCoverage}%`,
    },
  ]);

  generateConsoleTable(
    'Completely Covered Files - combined score of JSDoc and JSX (Fully Covered Files)',
    [
      {
        myId: 'numOfFiles',
        title: 'Total Scopes',
        value: completelyCoveredFiles.totalExpectedCount,
      },
      {
        myId: 'numOfFilesDocumented',
        title: 'Documented Scopes',
        value: completelyCoveredFiles.totalActualCount,
      },
      {
        myId: 'storybookCoverage',
        title: 'Coverage Percentage',
        value: `${completelyCoveredFiles.totalCoveragePercent}`,
      },
    ]
  );

  generateConsoleTable(
    'Total Coverage - combined score of JSDoc and JSX (PropTypes Coverage)',
    [
      {
        myId: 'numOfFiles',
        title: 'Total Scopes',
        value: totalCoverage.totalExpectedCount,
      },
      {
        myId: 'numOfFilesDocumented',
        title: 'Documented Scopes',
        value: totalCoverage.totalActualCount,
      },
      {
        myId: 'storybookCoverage',
        title: 'Coverage Percentage',
        value: `${totalCoverage.totalCoveragePercent}`,
      },
    ]
  );

  console.log('Note: A detailed json is generated in doc-coverage directory');
  console.log('\n###########################################################');
};

module.exports = printOutputSummary;
