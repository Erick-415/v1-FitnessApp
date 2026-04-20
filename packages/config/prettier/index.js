/** @type {import('prettier').Config} */
module.exports = {
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  printWidth: 100,
  bracketSameLine: false,
  importOrder: [
    '^react$',
    '^react-native$',
    '<THIRD_PARTY_MODULES>',
    '^@eazyfitness/(.*)$',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
