const defaultOptions = {
  emptyLineBefore: 'always',
  order: 'flexible',
};

module.exports = () => [
  {
    groupName: 'Positioning',
    properties: require('./groups/positioning'),
    ...defaultOptions,
  },
  {
    groupName: 'Display Model',
    properties: require('./groups/display-model'),
    ...defaultOptions,
  },
  {
    groupName: 'Box Model',
    properties: require('./groups/box-model'),
    ...defaultOptions,
  },
  {
    groupName: 'Typography',
    properties: require('./groups/typography'),
    ...defaultOptions,
  },
  {
    groupName: 'Visual',
    properties: require('./groups/visual'),
    ...defaultOptions,
  },
  {
    groupName: 'Animation',
    properties: require('./groups/animation'),
    ...defaultOptions,
  },
  {
    groupName: 'Misc',
    properties: require('./groups/misc'),
    ...defaultOptions,
  },
];
