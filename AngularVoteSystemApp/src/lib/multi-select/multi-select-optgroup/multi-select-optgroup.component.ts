import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  HostBinding,
  Input,
  OnChanges,
  QueryList,
  SimpleChanges
} from '@angular/core';
import { NgIf } from '@angular/common';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';

import { MultiSelectOptionComponent } from '../multi-select-option/multi-select-option.component';
import { MultiSelectOptgroupLabelComponent } from './multi-select-optgroup-label.component';

@Component({
  selector: 'c-multi-select-optgroup',
  templateUrl: './multi-select-optgroup.component.html',
  styleUrls: ['./multi-select-optgroup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MultiSelectOptgroupLabelComponent, NgIf]
})
export class MultiSelectOptgroupComponent implements AfterContentInit, OnChanges {

  static ngAcceptInputType_disabled: BooleanInput;

  @Input() label?: string;

  @Input()
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
  }

  get disabled(): boolean {
    return this._disabled;
  }

  private _disabled: boolean = false;

  @ContentChildren(MultiSelectOptionComponent, { descendants: true }) multiSelectOptions!: QueryList<MultiSelectOptionComponent>;

  @HostBinding('class') get hostClasses() {
    return {
      'form-multi-select-options': true
    };
  }

  ngAfterContentInit(): void {
    this.updateMultiSelectOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['disabled']) {
      this.updateMultiSelectOptions();
    }
  }

  private updateMultiSelectOptions() {
    this.multiSelectOptions?.forEach((option) => {
      option.disabled = this.disabled || option.disabled;
    });
  }
}
