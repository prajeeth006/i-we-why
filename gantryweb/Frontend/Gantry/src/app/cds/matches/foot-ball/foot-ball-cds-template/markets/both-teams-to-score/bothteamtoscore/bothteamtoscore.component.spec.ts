import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BothteamtoscoreComponent } from './bothteamtoscore.component';

describe('BothteamtoscoreComponent', () => {
  let component: BothteamtoscoreComponent;
  let fixture: ComponentFixture<BothteamtoscoreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BothteamtoscoreComponent]
    });
    fixture = TestBed.createComponent(BothteamtoscoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
