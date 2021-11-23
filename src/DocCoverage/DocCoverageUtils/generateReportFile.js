const fs = require('fs-extra');

const generateReportFile = (astHash, componentsCoverage, data) => {
  const output = {
    ...data,
    fileWiseCoverageJSDOC: astHash,
    fileWiseCoverageJSX: componentsCoverage,
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
