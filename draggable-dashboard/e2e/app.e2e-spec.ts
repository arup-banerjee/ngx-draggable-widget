import { DragabbleDashboardPage } from './app.po';

describe('dragabble-dashboard App', () => {
  let page: DragabbleDashboardPage;

  beforeEach(() => {
    page = new DragabbleDashboardPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
