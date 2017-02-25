import { Idea23Page } from './app.po';

describe('idea23 App', function() {
  let page: Idea23Page;

  beforeEach(() => {
    page = new Idea23Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
