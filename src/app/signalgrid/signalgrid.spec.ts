import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Signalgrid } from './signalgrid';

describe('Signalgrid', () => {
  let component: Signalgrid;
  let fixture: ComponentFixture<Signalgrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Signalgrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Signalgrid);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
