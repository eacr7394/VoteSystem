import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';

import { MultiSelectService } from '../multi-select.service';
import { IOption } from '../multi-select.type';

@Component({
  selector: 'c-multi-select-tag',
  templateUrl: './multi-select-tag.component.html',
  styleUrls: ['./multi-select-tag.component.scss'],
  standalone: true,
  imports: [NgIf, AsyncPipe]
})
export class MultiSelectTagComponent {

  constructor(
    private multiSelectService: MultiSelectService
  ) { }

  public multiselectVisible$ = this.multiSelectService.multiSelectVisible$;

  @Input() option?: IOption;

  @Input() disabled: boolean = true;
  @Input() label?: string;
  @Input() value?: any;

  @Output() remove = new EventEmitter<IOption>();

  @HostBinding('class')
  get hostClasses() {
    return {
      'form-multi-select-tag': true
    };
  }

  handleRemove($event: MouseEvent): void {
    $event.stopPropagation();
    if (this.value) {
      this.remove.emit(this.value);
    }
  }

}
