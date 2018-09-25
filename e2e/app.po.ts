import { browser, by, element } from 'protractor';

export class Page {

  navigateTo(destination) {
    return browser.get(destination);
  }

  getTitle() {
    return browser.getTitle();
  }

  getPageOneTitleText() {

    let el =
    element(by.tagName('ion-navbar'))
      .element(by.tagName('ion-title'))
    ;

    return (el.getText());
  }
}
