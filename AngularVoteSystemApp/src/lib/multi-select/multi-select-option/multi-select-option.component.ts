import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  inject,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgIf } from '@angular/common';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { FocusableOption, FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
import { Subject } from 'rxjs';
import { combineLatestWith, delay, distinctUntilChanged, filter, tap } from 'rxjs/operators';

import { MultiSelectService } from '../multi-select.service';

@Component({
  selector: 'c-multi-select-option',
  templateUrl: './multi-select-option.component.html',
  styleUrls: ['./multi-select-option.component.scss'],
  exportAs: 'cMultiSelectOption',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf]
})
export class MultiSelectOptionComponent implements AfterViewInit, FocusableOption {

  readonly #destroyRef = inject(DestroyRef);

  constructor(
    public readonly elementRef: ElementRef,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly focusMonitor: FocusMonitor,
    private readonly multiSelectService: MultiSelectService
  ) {
    this.setSubscriptions();
  }

  static ngAcceptInputType_disabled: BooleanInput;
  static ngAcceptInputType_selected: BooleanInput;

  readonly #active$ = new Subject<boolean>();
  readonly #selected$ = new Subject<boolean>();
  readonly #value$ = new Subject<any>();

  /**
   * Option style
   * @type ('checkbox' | 'text')
   * @default 'checkbox'
   */
  @Input() optionsStyle: ('checkbox' | 'text') = this.multiSelectService.optionsStyle;

  /**
   * Option label
   * @type string
   * @default undefined
   */
  @Input() label?: string;

  /**
   * Option inner text
   * @type string
   * @default undefined
   */
  @Input() text?: string;

  /**
   * Option visible.
   * @type boolean
   * @default true
   */
  @Input() visible: boolean = true;

  /**
   * Option disabled.
   * @type boolean
   * @default false
   */
  @Input()
  set disabled(value: boolean) {
    this.#disabled = coerceBooleanProperty(value);
  }

  get disabled() {
    return this.#disabled;
  }

  #disabled = false;

  /**
   * Option selected.
   * @type boolean
   * @default false
   */
  @Input()
  set selected(value: (boolean | undefined)) {
    const selected = coerceBooleanProperty(value);
    if (this.#selected !== selected) {
      this.#selected = selected;
      this.#selected$.next(selected);
    }
  }

  get selected() {
    return this.#selected;
  }

  #selected = false;

  /**
   * Emits option selected change
   * @type boolean
   */
  @Output() readonly selectedChange = new EventEmitter<boolean>();

  /**
   * Option value.
   * @type string
   * @default undefined
   */
  @Input()
  set value(value: string) {
    if (this.#value !== value) {
      this.#value = value;
      this.#value$.next(value);
    }
  }

  get value() {
    return this.#value;
  }

  #value!: string;

  @ViewChild('contentDiv') private contentDiv?: ElementRef;
  public hasContent = true;

  #dropdownVisible = false;

  @Input()
  set active(value: (boolean | undefined)) {
    const active = coerceBooleanProperty(value) && this.visible && !this.disabled;
    if (this.#active !== active) {
      this.#active = active;
      this.#active$.next(active);
    }
  }

  get active() {
    return this.#active && this.visible;
  }

  #active = false;

  #focused = false;

  @Output() readonly focusChange = new EventEmitter<MultiSelectOptionComponent>();

  @Input()
  @HostBinding('role')
  private get role() {
    return 'option';
  }

  @HostBinding('class')
  get hostClasses() {
    return {
      'form-multi-select-option': true,
      'form-multi-selected': this.selected,
      [`form-multi-select-option-with-${this.optionsStyle}`]: !!this.optionsStyle,
      disabled: this.disabled,
      'd-none': !this.visible,
      active: this.active,
      focused: this.#focused
    };
  }

  @HostBinding('attr.tabindex')
  private get tabIndex() {
    // return this.disabled || !this._active ? -1 : 0;
    return (this.disabled || !this.visible) ? -1 : this.#tabIndex;
  }

  private set tabIndex(tabindex) {
    this.#tabIndex = tabindex;
  }

  #tabIndex: number = -1;

  @HostBinding('attr.disabled')
  @HostBinding('attr.aria-disabled')
  private get ariaDisabled() {
    return this.disabled || null;
  }

  @HostBinding('attr.aria-selected')
  private get ariaSelected() {
    return this.#ariaSelected;
  }

  private set ariaSelected(selected) {
    setTimeout(() => {
      this.#ariaSelected = selected || undefined;
    });
  }

  #ariaSelected: boolean | undefined = undefined;

  @HostListener('keydown', ['$event'])
  onKeyDown($event: KeyboardEvent): void {
    if (['Space'].includes($event.code)) {
      $event.preventDefault();
    }
    if (['Tab'].includes($event.code)) {
      $event.preventDefault();
    }
  }

  @HostListener('blur')
  private onBlur() {
    this.#focused = false;
  }

  @HostListener('focus')
  private onFocus() {
    this.#focused = true;
  }

  @HostListener('keyup', ['$event'])
  private onKeyUp($event: KeyboardEvent): void {
    if (this.#dropdownVisible) {
      if (['Enter', 'Space'].includes($event.code)) {
        $event.stopImmediatePropagation();
        $event.preventDefault();
        this.selected = this.disabled ? this.selected : !this.selected;
        this.focus('keyboard');
      }
    }
  }

  @HostListener('click', ['$event'])
  private onClick($event: MouseEvent): void {
    $event.stopPropagation();
    this.selected = this.disabled ? this.selected : !this.selected;
    this.focus('mouse');
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.hasContent = !!this.contentDiv?.nativeElement.childNodes.length;
      if (!this.hasContent) {
        this.changeDetectorRef.markForCheck();
      }
    });

    if (this.text === undefined) {
      const innerText = this.elementRef.nativeElement.textContent.trim() || this.elementRef.nativeElement.innerText.trim();
      this.text = innerText || this.value?.trim() || '...';
    }

    if (this.label === undefined) {
      this.label = this.text?.trim() || '...';
    }

    if (this.value === undefined) {
      this.value = this.label?.trim() || '...';
    }

    setTimeout(() => {
      this.selected = this.multiSelectService.selectionModel.isSelected(this.value) || this.selected;
    });
  }

  /** Get the label for this element which is required by the FocusableOption interface. */
  getLabel(): string {
    return <string>(this.label ?? this.value);
  }

  focus(origin: FocusOrigin = 'program'): void {
    if (this.#dropdownVisible && !this.disabled) {
      this.focusMonitor.focusVia(this.elementRef.nativeElement, origin, { preventScroll: false });
      this.multiSelectService.focusChange(this);
      this.changeDetectorRef.markForCheck();
      this.focusChange.emit(this);
    }
  }

  private setSubscriptions() {

    this.multiSelectService.multiSelectVisible$
      .pipe(
        takeUntilDestroyed()
      )
      .subscribe(visible => {
        this.#dropdownVisible = visible;
      });

    this.#selected$
      .pipe(
        tap(selected => {
          if (selected) {
            if (this.value && !this.multiSelectService.selectionModel?.isSelected(this.value)) {
              this.multiSelectService.selectionModel?.select(this.value);
            }
          } else {
            if (this.value && this.multiSelectService.selectionModel?.isSelected(this.value)) {
              this.multiSelectService.selectionModel?.deselect(this.value);
            }
          }
        }),
        // delay(0),
        combineLatestWith(this.#value$),
        takeUntilDestroyed()
      )
      .subscribe(([selected, value]) => {
        if (selected) {
          if (!this.multiSelectService.selectionModel?.isSelected(this.value)) {
            this.multiSelectService.selectionModel?.select(this.value);
          }
        } else {
          if (this.multiSelectService.selectionModel?.isSelected(this.value)) {
            this.multiSelectService.selectionModel?.deselect(this.value);
          }
        }
        this.ariaSelected = selected;
        this.selectedChange.emit(selected);
        this.changeDetectorRef.markForCheck();
      });

    setTimeout(() => {
      this.multiSelectService.selectionModel.changed
        .pipe(
          filter(change => {
            return change.added.includes(this.value) || change.removed.includes(this.value);
          }),
          tap(change => {
            this.#selected = change.added.includes(this.value);
            this.changeDetectorRef.markForCheck();
          }),
          takeUntilDestroyed(this.#destroyRef)
        )
        .subscribe();
    });

    this.multiSelectService.multiSelectFocus$
      .pipe(
        distinctUntilChanged(),
        takeUntilDestroyed()
      )
      .subscribe((option) => {
        this.active = this.value === option.value;
      });

    this.#active$
      .pipe(
        distinctUntilChanged(),
        delay(0),
        takeUntilDestroyed()
      )
      .subscribe(active => {
        this.tabIndex = active ? 0 : -1;
      });

    this.#value$
      .pipe(
        distinctUntilChanged(),
        delay(0),
        takeUntilDestroyed()
      )
      .subscribe(value => {
        this.#selected = this.multiSelectService.selectionModel?.isSelected(value) || this.selected || false;
      });
  }
}
