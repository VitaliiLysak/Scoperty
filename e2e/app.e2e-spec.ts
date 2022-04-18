import { ImmoatlasPage } from './app.po';

describe('Scoperty App', () => {
  let page: ImmoatlasPage;

  beforeEach(() => {
    page = new ImmoatlasPage();
  });

  // FIXME: At the moment is serving as an example
  xit('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
