const groupsCreator = require('./stylelint/groups-creator');

module.exports = {
  plugins: [
    'stylelint-order',
  ],
  rules: {
    'declaration-empty-line-before': null, // INFO: Deactivate this rule, see https://github.com/hudochenkov/stylelint-order/issues/29
    'order/properties-order': groupsCreator(),
  },
};
