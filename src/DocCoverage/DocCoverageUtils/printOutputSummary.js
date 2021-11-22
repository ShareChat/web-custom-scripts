const generateConsoleTable = (title, data) => {
  console.log(`-----------${title}------------`);
  const transformed = data.reduce((acc, { myId, ...x }) => {
    acc[myId] = x;
    return acc;
  }, {});
  console.table(transformed);
};

const printOutputSummary = (data) => {
  const { jsdocCoverage, storyBookCoverage, totalCoverage } = data;

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

  generateConsoleTable('Storybook Coverage', [
    {
      myId: 'totalComponents',
      title: 'Number of Components',
      value: storyBookCoverage.totalComponents,
    },
    {
      myId: 'componentsWithStories',
      title: 'Components with Stories',
      value: storyBookCoverage.componentsWithStories,
    },
    {
      myId: 'storybookCoverage',
      title: 'Coverage Percentage',
      value: `${storyBookCoverage.storybookCoveragePercent}%`,
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

  console.log('Note: A detailed json is generated in doc-coverage directory');
  console.log('\n###########################################################');
};

module.exports = printOutputSummary;
