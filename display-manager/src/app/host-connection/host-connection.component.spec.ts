import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostConnectionComponent } from './host-connection.component';
import { HostConnectionService } from './host-connection.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('HostConnectionComponent', () => {
  let component: HostConnectionComponent;
  let fixture: ComponentFixture<HostConnectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [HostConnectionComponent],
    imports: [],
    providers: [HostConnectionService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
