const isIgnored = (fileData, framework) => {
  if (framework === 'svelte') {
    const arrOfLines = fileData.split('\n');
    const lineWithScriptTag = arrOfLines.indexOf('<script>');
    return arrOfLines[lineWithScriptTag + 1] === '/* !Doc Coverage Ignore */';
  }
  return fileData.startsWith('/* !Doc Coverage Ignore */');
};
module.exports = isIgnored;
