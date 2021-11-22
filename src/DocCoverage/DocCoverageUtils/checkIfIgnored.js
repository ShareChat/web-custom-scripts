const isIgnored = (fileData) =>
  fileData.startsWith('/* !Doc Coverage Ignore */');
module.exports = isIgnored;
