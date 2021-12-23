const generateConsoleTable = (title, data) => {
  console.log(`-----------${title}------------`);
  const transformed = data.reduce((acc, { myId, ...x }) => {
    acc[myId] = x;
    return acc;
  }, {});
  console.table(transformed);
};

const printOutputSummary = (data) => {
  const { jsdocCoverage, ComponentFileCoverage, totalCoverage } = data;

  console.log('\n###########################################################');
  console.log('Note: A detailed json is generated in doc-coverage directory');

  console.log(
    'Note: Component Files refer to Component files for react and .vue/.svelte files for vue and svelte respectively'
  );

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

  generateConsoleTable('Components File Coverage', [
    {
      myId: 'totalComponents',
      title: 'Total Component Files',
      value: ComponentFileCoverage.totalComponents,
    },

    {
      myId: 'componentsWithStoriesOrPropTypes',
      title: 'Fully Documented Component Files',
      value: ComponentFileCoverage.componentsWithStoriesOrPropTypes,
    },
    {
      myId: 'componentsWithStories',
      title: 'Components with stories',
      value: ComponentFileCoverage.componentsWithStories,
    },
    {
      myId: 'storyBookCoveragePercent',
      title: 'Storybook Coverage percent',
      value: `${ComponentFileCoverage.storyBookCoveragePercent}%`,
    },
    {
      myId: 'fullyDocumentedFileCoverage',
      title: 'Fully documented files / Total files',
      value: `${ComponentFileCoverage.storyBookOrPropTypesCoveragePercent}%`,
    },
    {
      myId: 'propTypesCoverage',
      title: 'num of prop types / total props',
      value: `${ComponentFileCoverage.propTypesCoveragePercent}%`,
    },
  ]);

  generateConsoleTable(
    'Total Coverage - combined score of JSDoc and Component Files',
    [
      {
        myId: 'JSFilesWithFullyDocumented',
        title: 'JS Files + Fully Documented Components',
        value: `${totalCoverage.jsDocWithFullyDoc}%`,
      },
      {
        myId: 'JSFilesWithStorybook',
        title: 'JS Files + Components with Stories',
        value: `${totalCoverage.jsDocWithStorybook}%`,
      },
      {
        myId: 'JSFilesWithPropTypes',
        title: 'JS Files + Prop Types Coverage',
        value: `${totalCoverage.jsDocWithPropTypesCoverage}%`,
      },
    ]
  );

  console.log('\n###########################################################');
};

module.exports = printOutputSummary;
