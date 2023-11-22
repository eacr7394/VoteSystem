import { Injectable } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject, Subject } from 'rxjs';
import { MultiSelectOptionComponent } from './multi-select-option/multi-select-option.component';

@Injectable()
export class MultiSelectService {

  public optionsStyle: 'checkbox' | 'text' = 'checkbox';

  selectionModel!: SelectionModel<any>;

  setSelectionModel(multiple = true, initiallySelectedValues: string[] = []) {
    this.selectionModel = new SelectionModel<any>(multiple);
  }

  private readonly multiSelectVisible = new BehaviorSubject<boolean>(false);
  readonly multiSelectVisible$ = this.multiSelectVisible.asObservable();

  toggleVisible(visible: boolean): void {
    this.multiSelectVisible.next(visible);
  }

  private readonly multiSelectFocus = new Subject<MultiSelectOptionComponent>();
  readonly multiSelectFocus$ = this.multiSelectFocus.asObservable();

  focusChange(option: MultiSelectOptionComponent) {
    this.multiSelectFocus.next(option);
  }

}

