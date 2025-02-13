import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ScContextService } from '../sc-context-service/sc-context.service';
import { LogoutService } from '../sc-logout-service/logout.service';

import { ScAccountInformationComponent } from './sc-account-information.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ScAccountInformationComponent', () => {
  let component: ScAccountInformationComponent;
  let fixture: ComponentFixture<ScAccountInformationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [ScAccountInformationComponent],
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScAccountInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user account profile name and portrait', () => {
    let scContextService = TestBed.inject(ScContextService);
    scContextService.context$.next({ User: { Profile: { FullName: 'test name', Portrait: 'portrait' } } });
    component.ngOnInit();
    fixture.detectChanges();
    let userNameEl = fixture.debugElement.query(By.css('.user-wrapper'));
    let userPortraitEl = fixture.nativeElement.querySelector('img');
    expect(userNameEl.nativeElement.textContent).toBe('test name');
    expect(userPortraitEl.attributes.src.nodeValue).toBe('portrait');
  });

  it('should call logout method when logout button is clicked', () => {
    let scContextService = TestBed.inject(ScContextService);
    scContextService.context$.next({ User: { Profile: { FullName: 'test name', Portrait: 'portrait' } } });
    let logoutService = TestBed.inject(LogoutService);
    spyOn(logoutService, 'logout');
    component.onLogout();
    fixture.detectChanges();
    expect(logoutService.logout).toHaveBeenCalled();
  });
});
