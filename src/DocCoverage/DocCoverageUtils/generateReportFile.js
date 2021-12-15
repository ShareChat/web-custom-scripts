const fs = require('fs-extra');

const generateReportFile = (astHash, framework, componentsCoverage, data) => {
  const key = `fileWiseCoverage${
    framework ? framework.charAt(0).toUpperCase() + framework.slice(1) : 'JSX'
  }`;
  const output = {
    ...data,
    fileWiseCoverageJSDOC: astHash,
    [key]: componentsCoverage,
  };

  const dir = './doc-coverage';

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  fs.writeFile(
    `${dir}/docCoverageReport.json`,
    JSON.stringify(output, null, 4),
    'utf8'
  );
};

module.exports = generateReportFile;
