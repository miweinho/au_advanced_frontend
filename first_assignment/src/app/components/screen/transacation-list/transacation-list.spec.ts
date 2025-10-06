import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransacationList } from './transacation-list';

describe('TransacationList', () => {
  let component: TransacationList;
  let fixture: ComponentFixture<TransacationList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransacationList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransacationList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
