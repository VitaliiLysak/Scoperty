module.exports = [
  // jpeg
  { width: '3840px', rename: { suffix: '_3840' }, format: 'jpeg' },
  { width: '1920px', rename: { suffix: '_1920' }, format: 'jpeg' },
  { width: '1440px', rename: { suffix: '_1440' }, format: 'jpeg' },
  { width: '768px', rename: { suffix: '_768' }, format: 'jpeg' },

  // webp
  { width: '3840px', rename: { suffix: '_3840', extname: '.webp' }, format: 'webp' },
  { width: '1920px', rename: { suffix: '_1920', extname: '.webp' }, format: 'webp' },
  { width: '1440px', rename: { suffix: '_1440', extname: '.webp' }, format: 'webp' },
  { width: '768px', rename: { suffix: '_768', extname: '.webp' }, format: 'webp' },
];
