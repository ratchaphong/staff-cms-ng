import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceBlocker } from './device-blocker';

describe('DeviceBlocker', () => {
  let component: DeviceBlocker;
  let fixture: ComponentFixture<DeviceBlocker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceBlocker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceBlocker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
