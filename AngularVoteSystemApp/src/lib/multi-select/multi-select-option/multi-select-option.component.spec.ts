import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiSelectOptionComponent } from './multi-select-option.component';
import { MultiSelectService } from '../multi-select.service';

describe('MultiSelectOptionComponent', () => {
  let component: MultiSelectOptionComponent;
  let fixture: ComponentFixture<MultiSelectOptionComponent>;
  let service: MultiSelectService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiSelectOptionComponent],
      providers: [MultiSelectService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSelectOptionComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(MultiSelectService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
