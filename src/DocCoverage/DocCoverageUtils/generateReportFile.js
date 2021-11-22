const fs = require('fs-extra');

const generateReportFile = (astHash, componentsCoverage, data) => {
  const output = {
    ...data,
    FileWiseCoverageJSDOC: astHash,
    FileWiseCoverageJSX: componentsCoverage,
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
