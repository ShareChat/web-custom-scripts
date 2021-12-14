const { docIgnoreComment, frameworks } = require('../Constants/constants');

const isIgnored = (fileData, framework) => {
  if (framework === frameworks.SVELTE) {
    const arrOfLines = fileData.split('\n');
    const lineWithScriptTag = arrOfLines.indexOf('<script>');
    return arrOfLines[lineWithScriptTag + 1] === docIgnoreComment;
  }
  return fileData.startsWith(docIgnoreComment);
};
module.exports = isIgnored;
