// Because this file references protractor, you'll need to have it as a project
// dependency to use 'protractor/globals'. Here is the full list of imports:
//
// import {browser, element, by, By, $, $$, ExpectedConditions}
//   from 'protractor/globals';
//
// The jasmine typings are brought in via DefinitelyTyped ambient typings.
import {browser, element, by} from 'protractor';

describe('helloworld', () => {
  beforeEach(() => {
    browser.get('https://qa2.gantry.coral.co.uk/en/gantry/helloworld');
    browser.sleep(5000);
  });

  it('should greet with Hello First Screen', () => 
  {
      let greeting = element(by.xpath("//body//root//gn-hello-world")); 
      greeting.getText().then(text => {
        expect(text).toEqual('Hello First Screen');
      });
  });
});
