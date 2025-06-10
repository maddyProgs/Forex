import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Signaldetail } from './signaldetail';

describe('Signaldetail', () => {
  let component: Signaldetail;
  let fixture: ComponentFixture<Signaldetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Signaldetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Signaldetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
