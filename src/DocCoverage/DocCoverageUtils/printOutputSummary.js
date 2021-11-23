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
    storyBookOrPropTypesCoverage,
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
      title: 'Number of Components',
      value: storyBookOrPropTypesCoverage.totalComponents,
    },
    {
      myId: 'componentsWithStoriesOrPropTypes',
      title: 'Documeted Components',
      value: storyBookOrPropTypesCoverage.componentsWithStoriesOrPropTypes,
    },
    {
      myId: 'storybookOrPropTypeCoverage',
      title: 'Coverage Percentage',
      value: `${storyBookOrPropTypesCoverage.storyBookOrPropTypesCoveragePercent}%`,
    },
  ]);

  generateConsoleTable('Total Coverage', [
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
      value: totalCoverage.totalCoveragePercent,
    },
  ]);

  generateConsoleTable('Completely Covered Files', [
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
      value: completelyCoveredFiles.totalCoveragePercent,
    },
  ]);

  console.log('Note: A detailed json is generated in doc-coverage directory');
  console.log('\n###########################################################');
};

module.exports = printOutputSummary;
