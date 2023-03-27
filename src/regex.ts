const characterRegex = /^[A-Z]+(\s*:|:)/;
const didascalieRegex = /^([^\(\)]+)\s*\([^)]*\)\s*:/
const ensembleRegex = /([A-Za-z]+)\s+et\s+([A-Za-z]+)\s*:/
const parenthesesRegex = /\((.*?)\)/

export {characterRegex, didascalieRegex, ensembleRegex, parenthesesRegex}