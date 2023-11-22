import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  DestroyRef,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  HostListener,
  inject,
  Input,
  IterableDiffer,
  IterableDiffers,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  Renderer2,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewContainerRef
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe, I18nPluralPipe, NgClass, NgForOf, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FocusableOption, FocusKeyManager, FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
import { BooleanInput, coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { combineLatestWith, debounceTime, delay, distinctUntilChanged, filter, map, take, tap } from 'rxjs/operators';
import { Modifier, ModifierArguments, Options } from '@popperjs/core';

import { DropdownComponent, DropdownMenuDirective, DropdownToggleDirective } from '../../dropdown';
import { ElementCoverComponent } from '../../element-cover';
import { TemplateIdDirective } from '../../shared';
import { IMultiSelect, IOption, SearchFn } from '../multi-select.type';
import { MultiSelectService } from '../multi-select.service';
import { MultiSelectOptionComponent } from '../multi-select-option/multi-select-option.component';
import { MultiSelectNativeSelectComponent } from '../multi-select-native-select/multi-select-native-select.component';
import { MultiSelectTagComponent } from '../multi-select-tag/multi-select-tag.component';
import { MultiSelectSearchDirective } from './multi-select-search.directive';

interface IPluralMap {
  [k: string]: string;
}

// @ts-ignore
export const observeReferenceModifier: Modifier<string, any> = {
  name: 'observeReferenceModifier', enabled: true, phase: 'main', fn({ state }) {},

  effect: ({ state, instance }: ModifierArguments<Options>) => {
    const RO_PROP = '__popperjsRO__';
    const { reference } = state.elements;

    // @ts-ignore
    reference[RO_PROP] = new ResizeObserver((entries) => {
      instance.update();
    });

    // @ts-ignore
    reference[RO_PROP].observe(reference);
    return () => {
      // @ts-ignore
      reference[RO_PROP].disconnect();
      // @ts-ignore
      delete reference[RO_PROP];
    };
  }
};

@Component({
  selector: 'c-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss'],
  exportAs: 'cMultiSelect',
  providers: [
    MultiSelectService,
    {
      provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MultiSelectComponent), multi: true
    }
  ],
  standalone: true,
  imports: [
    AsyncPipe,
    I18nPluralPipe,
    NgClass,
    NgIf,
    NgForOf,
    NgStyle,
    NgTemplateOutlet,
    CdkFixedSizeVirtualScroll,
    CdkVirtualScrollViewport,
    CdkVirtualForOf,
    FormsModule,
    MultiSelectTagComponent,
    MultiSelectOptionComponent,
    MultiSelectSearchDirective,
    DropdownComponent,
    DropdownToggleDirective,
    DropdownMenuDirective,
    ElementCoverComponent
  ]
})
export class MultiSelectComponent implements IMultiSelect, ControlValueAccessor, AfterViewInit, OnChanges, OnDestroy, OnInit {

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private ngZone: NgZone,
    private changeDetectorRef: ChangeDetectorRef,
    private viewContainerRef: ViewContainerRef,
    private focusMonitor: FocusMonitor,
    private multiSelectService: MultiSelectService,
    private iterableDiffers: IterableDiffers
  ) {
    this.differ = this.iterableDiffers.find(this.#value).create();
  }

  private destroyRef = inject(DestroyRef);

  private readonly differ!: IterableDiffer<any>;

  static ngAcceptInputType_allowCreateOptions: BooleanInput;
  static ngAcceptInputType_disabled: BooleanInput;
  static ngAcceptInputType_loading: BooleanInput;
  static ngAcceptInputType_multiple: BooleanInput;
  static ngAcceptInputType_virtualScroller: BooleanInput;

  readonly #destroy$ = new Subject<void>();
  readonly #optionsReady$ = new Subject<boolean>();
  readonly optionsArray$ = new BehaviorSubject<IOption[]>([]);
  readonly #options: Map<any, IOption> = new Map();
  readonly optionsSelected$ = new BehaviorSubject<IOption[]>([]);
  readonly optionsSelected: Map<any, IOption> = new Map();
  readonly value$ = new BehaviorSubject<string[]>([]);

  onChange = (value: any) => {};
  onTouched = () => {};

  writeValue(value: (string | string[])): void {
    if (value?.length > 0) {
      this.value = Array.isArray(value) ? [...value] : [value];
    } else {
      this.value = Array(0);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * Allow users to create options if they are not in the list of options.
   * @type boolean
   * @default false
   * @since 4.5.2
   */
  @Input()
  set allowCreateOptions(value: boolean) {
    this.#allowCreateOptions = coerceBooleanProperty(value);
  }

  get allowCreateOptions(): boolean {
    return this.#allowCreateOptions;
  }

  #allowCreateOptions: boolean = false;

  /**
   * Enables selection cleaner element
   * @type boolean
   * @default true
   */
  @Input() cleaner = true;

  /**
   * Disables multi-select component
   * @type boolean
   * @default false
   */
  @Input() set disabled(value: boolean) {
    if (this._disabled !== value) {
      this._disabled = coerceBooleanProperty(value);
      this.setFocusMonitor(!value);
    }
  }

  get disabled(): boolean {
    return this._disabled;
  }

  private _disabled = false;

  /**
   * Add loading spinner and reduced opacity.
   * @type boolean
   * @default false
   * @since 4.5.2
   */
  @Input()
  set loading(value: boolean) {
    this.#loading = coerceBooleanProperty(value);
  }

  get loading(): boolean {
    return this.#loading;
  }

  #loading: boolean = false;

  /**
   * Specifies that multiple options can be selected at once
   * @type boolean
   * @default false
   */
  @Input() set multiple(value: boolean) {
    this._multiple = coerceBooleanProperty(value);
  }

  get multiple(): boolean {
    return this._multiple;
  }

  private _multiple = false;

  /**
   * Hidden native select form
   * @type string
   * @default ''
   */
  @Input() nativeFormId = '';

  /**
   * Hidden native select id
   * @type string
   * @default ''
   */
  @Input() nativeId = '';

  /**
   * Hidden native select name
   * @type string
   * @default ''
   */
  @Input() nativeName = '';

  /**
   * List of option elements
   * @type IOption[]
   * @default []
   */
  @Input()
  set options(options: IOption[]) {
    if (Array.isArray(options)) {
      this.makeOptions(options);
    }
  }

  get options() {
    return [...this.#options.values()];
  }

  /**
   * Sets maxHeight of options list in px
   * @type (string | number)
   * @default 'auto'
   */
  @Input() optionsMaxHeight = 'auto';

  /**
   * Sets option style
   * @type 'checkbox' | 'text'
   * @default 'checkbox'
   */
  @Input()
  set optionsStyle(value: 'checkbox' | 'text') {
    this.multiSelectService.optionsStyle = value ?? 'checkbox';
  }

  /**
   * Specifies a short hint that is visible in the search input
   * @type string
   * @default 'Select...'
   */
  @Input() placeholder = 'Select...';

  /**
   * Enables search input element
   * @type boolean | SearchFn | 'external'
   * @default true
   */
  @Input() search: (boolean | 'external' | SearchFn) = true;

  /**
   * Sets the label for no results when filtering
   * @type string
   * @default 'no items'
   */
  @Input() searchNoResultsLabel = 'no items';

  /**
   * Sets initial search string
   * @type string
   * @default ''
   */
  @Input()
  set searchValue(value) {
    if (this._searchValue !== value.trimStart()) {
      this._searchValue = value.trimStart();
      this.visible = !!this.searchValue.length ? true : this.visible;
      this.filterOptions(this.searchValue);
      this.inputElementSize();
      this.searchValueChange.emit(this._searchValue);
    }
  }

  get searchValue() {
    return this._searchValue;
  }

  private _searchValue: string = '';

  /**
   * Emits searchValue string for external filtering
   * @type string
   */
  @Output() readonly searchValueChange = new EventEmitter<string>();

  /**
   * Enables select all button
   * @type boolean
   * @default true
   */
  @Input() selectAll = true;

  /**
   * Sets the select all button label
   * @type string
   * @default 'Select all options'
   */
  @Input() selectAllLabel = 'Select all options';

  /**
   * Selection type
   * @type 'counter' | 'tags' | 'text'
   * @default 'tags'
   */
  @Input() selectionType: 'counter' | 'tags' | 'text' = 'tags';

  /**
   * Counter selection label value
   * @type string
   * @default 'item(s) selected'
   */
  @Input() selectionTypeCounterText: string = 'item(s) selected';

  /**
   * Counter selection label plural map for I18nPluralPipe
   * @type IPluralMap
   * @default { '=1': 'item selected', 'other': 'items selected' }
   */
  @Input() selectionTypeCounterTextPluralMap?: IPluralMap = { '=1': 'item selected', 'other': 'items selected' };

  /**
   * Size the component small or large.
   * @type 'sm' | 'lg' | undefined
   */
  @Input() size?: 'sm' | 'lg';

  /**
   * Initial value of multi-select
   * @type string | string[]
   */
  @Input() set value(value: string | string[]) {
    const newValue = Array.isArray(value) ? [...value] : [value ?? undefined];
    if (this.differ) {
      const changes = this.differ.diff(newValue);
      if (changes) {
        this.#value = [...newValue];
        this.value$.next([...newValue]);
        this.onChange(this.value);
        // this.valueChange.emit(this.value);
      }
    }
  }

  get value() {
    const value = this.multiSelectService.selectionModel?.selected ?? [...this.#value];
    return this.multiple ? [...value] : value?.toString() ?? undefined;
  }

  #value: string[] = [];

  /**
   * Emits valueChange
   * @type string | string[]
   */
  @Output() readonly valueChange = new EventEmitter<string | string[]>();

  /**
   * Toggle visual validation feedback.
   * @type boolean | undefined
   * @default undefined
   */
  @Input() valid?: boolean;

  /**
   * Enable virtual scroller for options list.
   * @type boolean
   * @default false
   */
  @Input()
  set virtualScroller(value: boolean) {
    this._virtualScroller = coerceBooleanProperty(value);
  }

  get virtualScroller() {
    return this._virtualScroller;
  }

  private _virtualScroller = false;

  /**
   * Amount of visible options, if set - overwrites optionsMaxHeight
   * @type number
   * @default 8
   */
  @Input()
  set visibleItems(value) {
    this._visibleItems = coerceNumberProperty(value || 8);
    this.optionsMaxHeight = ((this.itemSize * this._visibleItems) + 16).toString();
  }

  get visibleItems() {
    return this._visibleItems;
  }

  private _visibleItems = 8;

  /**
   * The size of the option item in the list (in pixels).
   * @type number
   * @default 40
   */
  @Input() itemSize: number = 40;

  /**
   * Min width of the options list (in pixels).
   * @type number
   * @default 196
   */
  @Input() itemMinWidth: number = 196;

  /**
   * Toggle the visibility of the dropdown select component.
   * @type boolean
   * @default false
   */
  @Input() set visible(value: boolean) {
    const visible = coerceBooleanProperty(value);
    if (visible !== this._visible) {
      this._visible = visible;
      this.multiSelectService.toggleVisible(visible);
      if (!visible) {
        // this.searchValue = '';
      }
    }
  }

  get visible() {
    return this._visible;
  }

  private _visible = false;

  /**
   * Emits visibleChange
   * @type boolean
   */
  @Output() readonly visibleChange = new EventEmitter<boolean>();

  /**
   * Optional popper Options object
   * @type Partial<Options>
   */
  @Input('popperOptions') popperjsOptions: Partial<Options> = {
    strategy: 'fixed', modifiers: [observeReferenceModifier, {
      name: 'offset', options: {
        offset: () => this.selectionType === 'tags' && this.optionsSelected.size ? [-2, 8] : [-12, 12]
      }
    }]
  };

  isDropdownVisible = false;

  get selectedOptions() {
    return [...this.optionsSelected.values()];
  }

  get selectedOptionsText() {
    return this.selectedOptions.map(option => option.label).join(', ');
  }

  get counterText() {
    return `${this.selectedOptions.length} ${this.selectionTypeCounterText}`;
  }

  get counterTextType(): string {
    return typeof this.selectionTypeCounterTextPluralMap ?? typeof this.selectionTypeCounterText;
  };

  private focusMonitorSubscription!: Subscription;

  @ContentChildren(MultiSelectOptionComponent, { descendants: true }) multiSelectOptionsContent!: QueryList<MultiSelectOptionComponent>;
  @ViewChildren(MultiSelectOptionComponent) multiSelectOptionsView!: QueryList<MultiSelectOptionComponent>;
  @ViewChildren('scrollViewport') scrollViewportView!: QueryList<CdkVirtualScrollViewport>;
  @ViewChild('options') optionsElementRef!: ElementRef;

  protected scrollViewport!: CdkVirtualScrollViewport;

  protected templates: { [id: string]: TemplateRef<any> } = {};
  @ContentChildren(TemplateIdDirective, { descendants: true }) contentTemplates!: QueryList<TemplateIdDirective>;

  private listKeyManager!: FocusKeyManager<MultiSelectOptionComponent>;

  @ViewChild('inputElement') inputElement!: ElementRef;
  @ViewChild('dropdownMenu') dropdownMenu!: ElementRef;
  @ViewChild(DropdownComponent, { read: ElementRef }) dropdown!: ElementRef;
  @ViewChild(DropdownToggleDirective, { read: ElementRef }) dropdownToggle!: ElementRef;

  @HostBinding('class')
  get hostClasses() {
    return {
      disabled: this.disabled
    };
  }

  get multiselectClasses() {
    return {
      'form-multi-select': true,
      'form-multi-select-selection-tags': this.selectionType === 'tags' && this.optionsSelected.size > 0,
      [`form-multi-select-${this.size}`]: !!this.size,
      'form-multi-select-with-cleaner': this.cleaner,
      show: this.visible,
      disabled: this.disabled,
      'is-valid': this.valid === true,
      'is-invalid': this.valid === false
    };
  }

  @HostBinding('attr.aria-multiselectable')
  private get ariaMultiSelectable() {
    return this.multiple;
  }

  @HostBinding('attr.aria-expanded')
  private get ariaExpanded() {
    return this.visible;
  }

  @HostBinding('attr.tabindex')
  private get tabIndex() {
    return this._tabIndex;
  }

  private set tabIndex(value) {
    setTimeout(() => {
      this._tabIndex = this.disabled || this.search ? -1 : value === null ? null : 0;
    });
  }

  private _tabIndex: number | null = -1;

  @HostListener('keyup', ['$event']) onKeyUp($event: KeyboardEvent): void {
    if (this.disabled) {
      return;
    }
    this.onTouched();
    const targetTagName = ($event.target as HTMLElement).tagName;
    if ($event.key === 'Escape') {
      this.visible = false;
      this.searchValue = '';
      this.setFocus('keyboard', 'onKeyUp');
      return;
    }
    if (['Enter', 'Space', 'ArrowDown'].includes($event.code) && [this.inputElement?.nativeElement, this.elementRef.nativeElement].includes($event.target)) {
      $event.stopPropagation();
      this.visible = true;
      if (!this.search) {
        this.setFocus('keyboard', 'onKeyUp');
      }
      return;
    }

    if (['Tab'].includes($event.key)) {

      if ($event.target === this.elementRef.nativeElement) {
        this.visible = true;
        if (!this.search) {
          this.setFocus('keyboard', 'onKeyUp');
        }
        this.tabTarget = targetTagName;
        return;
      }

      if (this.visible && this.subtreeFocused) {
        if (targetTagName === 'C-MULTI-SELECT-OPTION') {

          if (this.tabTarget === 'C-MULTI-SELECT-OPTION') {
            if ($event.shiftKey && this.listKeyManager.activeItem?.value === this.options.filter(option => option.visible && !option.disabled).slice(0)[0].value) {
              this.setFocus('keyboard', 'onKeyUp');
              this.tabTarget = targetTagName;
              return;
            }

            if (!$event.shiftKey && this.listKeyManager.activeItem?.value === this.options.filter(option => option.visible && !option.disabled).slice(-1)[0].value) {
              this.setFocus('keyboard', 'onKeyUp');
              this.tabTarget = targetTagName;
              this.updateActiveItem(0);
              return;
            }
          }

          if (!this.listKeyManager.activeItem || this.tabTarget !== targetTagName) {
            if (this.activeOption) {
              this.listKeyManager.setActiveItem(this.activeOption);
            } else {
              this.setFirstItemActive();
            }
          } else {
            $event.shiftKey ? this.listKeyManager.setPreviousItemActive() : this.listKeyManager.setNextItemActive();
          }
        }
        this.tabTarget = targetTagName;
        return;
      }
    }
  }

  @HostListener('keydown', ['$event']) onKeyDown($event: KeyboardEvent) {
    const targetTagName = ($event.target as HTMLElement).tagName;
    if ($event.key === 'Enter' && targetTagName === 'INPUT') {
      $event.preventDefault();
    }
    if ($event.key === 'Tab') {
      this.tabTarget = targetTagName;
      return;
    }
    if ($event.key === 'ArrowDown' && targetTagName !== 'C-MULTI-SELECT-OPTION') {
      $event.preventDefault();
      return;
    }
    if ($event.key === 'Escape') {
      this.visible = false;
      this.searchValue = '';
      this.setFocus('keyboard', 'onKeyUp');
      return;
    }
    if (this.disabled) {
      return;
    }
    // avoid setting focus to option while on input element
    if ($event.target === this.inputElement.nativeElement) {
      return;
    }
    if ($event.key !== 'Tab') {
      this.listKeyManager?.onKeydown($event);
    }
  }

  @HostListener('click', ['$event'])
  onClick($event: MouseEvent): void {
    if (this.disabled) {
      return;
    }
    if ([this.dropdown.nativeElement].includes($event.target)) {
      this.visible = !this.visible;
    } else {
      this.visible = true;
    }
    this.onTouched();
    this.setFocus('mouse', 'onClick');
  }

  public visibleOptions = 0;

  get subtreeFocused() {
    return this._subtreeFocused;
  }

  set subtreeFocused(focused: boolean) {
    this._subtreeFocused = this.disabled ? false : focused;
    if (!focused) {
      this.searchValue = '';
    }
    if (!this.virtualScroller) {
      this.visible = focused === false ? false : this.visible;
    }
  }

  private _subtreeFocused = this.focusOrigin(null);

  private nativeSelectRef!: any;

  focusOrigin(origin: FocusOrigin): boolean {
    if (this.disabled) {
      return false;
    }
    return !!origin;
  }

  ngOnInit(): void {

    this.multiSelectService.setSelectionModel(this.multiple);

    this.multiSelectService.selectionModel.changed
      .pipe(
        filter(() => !this.multiple),
        delay(0),
        tap(change => {
          if (change.added.length) {
            // close dropdown for single select (!multiple)
            this.visible = false;
            this.searchValue = '';
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();

    this.multiSelectService.selectionModel.changed
      .pipe(
        // delay(0),
        combineLatestWith(this.#optionsReady$),
        tap(([change, ready]) => {
          const { added, removed } = { ...change };
          // added.forEach(key => {
          //   const value = this.#options.get(key);
          //   if (value) {
          //     this.optionsSelected.set(key, value);
          //   }
          // });
          removed.forEach(value => {
            this.optionsSelected.delete(value);
          });
          this.multiSelectService.selectionModel.selected.forEach(key => {
            const value = this.#options.get(key);
            if (value) {
              this.optionsSelected.set(key, value);
            }
          });

          this.optionsSelected$.next(Array.from(this.optionsSelected.values()));
          this.value = [...this.multiSelectService.selectionModel.selected];

          this.inputElementSize();
          this.updateNativeSelect();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();

    // set initial values
    this.multiSelectService.selectionModel.select(...this.#value);

    this.value$
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(value => {
        if (!value.length) {
          this.clearAllOptions();
          return;
        }

        value.forEach(value => {
          this.multiSelectService.selectionModel.select(value);
        });
      });

    this.value$
      .pipe(
        debounceTime(100),
        tap(value => {
          this.valueChange.emit(this.value);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();

    this.optionsArray$
      .pipe(
        tap(options => {
          this.visibleOptions = options.filter((item) => item.visible).length;
          this.activeOption = null;

          if (this.virtualScroller) {
            this.multiSelectOptionsContent?.forEach(option => {
              option.active = false;
            });
            this.scrollViewport?.setRenderedRange({ start: 0, end: this.visibleItems });
            this.scrollViewport?.scrollToIndex(0);
          } else {
            this.multiSelectOptionsContent?.forEach(option => {
              const found = options.find(item => item.value === option.value);
              option.visible = found?.visible ?? false;
              option.active = false;
            });
            const firstFocusable = this.firstFocusableItem;
            if (firstFocusable) {
              this.updateActiveItem(firstFocusable);
            }
          }
          if (!this.activeOption) {
            setTimeout(() => {
              this.updateActiveItem(0);
            });
          }
          this.multiSelectOptionsContent?.notifyOnChanges();
          // console.log('=> optionsArray$', options.length);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();

    this.tabIndex = 0;
  }

  ngOnDestroy(): void {
    this.#destroy$.next();
    this.#destroy$.complete();
    this.setFocusMonitor(false);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      const valueChanges = changes['value'];
      if (valueChanges.currentValue.length === 0) {
        this.clearAllOptions();
      }
      this.inputElementSize();
    }
  }

  makeOptions(options: IOption[]) {

    if (this.search === 'external' && this.searchValue.length) {
      this.#options.forEach((value, key) => {
        value.visible = false;
      });
    }

    options.forEach(option => {
      const key = option.value;
      const value = {
        value: option.value ?? option.label,
        label: option.label ?? option.value,
        disabled: option.disabled === true,
        visible: this.search === 'external' ? true : option.visible !== false,
        text: option.text ?? option.label ?? option.value,
        selected: option.selected
        // selected: this.multiSelectService.selectionModel.isSelected(option.value),
        // id: option.id
      };
      this.#options.set(key, { ...value });
    });

    this.filterOptions(this.searchValue);

    this.#optionsReady$.next(true);
    // console.log('makeOptions', this.#options.size);
    this.multiSelectOptionsContent?.notifyOnChanges();
  }

  ngAfterViewInit(): void {

    this.setVirtualScroller();

    this.multiSelectOptionsContent?.changes
      .pipe(
        delay(0),
        distinctUntilChanged((previous: QueryList<MultiSelectOptionComponent>, current) => {
          const prev = previous.toArray().map(option => option.value);
          const curr = current.toArray().map(option => option.value);
          return JSON.stringify(prev) === JSON.stringify(curr);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(next => {
        this.visibleOptions = this.multiSelectOptionsContent?.filter((option) => option.visible).length;
        if (this.visibleOptions) {
          this.makeOptions(this.multiSelectOptionsContent.toArray());
        }
      });

    this.visibleOptions = this.multiSelectOptionsContent?.length;
    if (this.visibleOptions) {
      this.multiSelectOptionsContent.notifyOnChanges();
    }

    this.multiselectSubscribe();

    this.setFocusMonitor(!this.disabled);

    this.setListKeyManager();

    this.inputElementSize();

    this.multiSelectOptionsContent.notifyOnChanges();

    setTimeout(() => {
      this.createNativeSelect();
    });

    this.multiSelectService.multiSelectFocus$
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((option: any) => {
          if (this.activeOption?.value !== option.value) {
            this.listKeyManager.setActiveItem(option);
          }
        }
      );
  }

  private tabTarget!: string;

  private multiselectSubscribe(subscribe: boolean = true) {

    this.multiSelectService.multiSelectVisible$
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((visible) => {
        if (this.isDropdownVisible !== visible) {
          this.isDropdownVisible = visible;
          this.visibleChange.emit(visible);
          if (!visible) {
          } else {
            if (this.virtualScroller) {
              this.scrollViewport?.setRenderedRange({ start: 0, end: this.visibleItems });
              this.scrollViewport?.scrollToIndex(0);
            }
          }
          this.multiSelectOptionsContent.notifyOnChanges();
        }
        this.updateActiveItem(0);
      });

  }

  clearAllOptions($event?: MouseEvent) {
    setTimeout(() => {
      const enabledOptions = Array.from(this.optionsSelected.values()).filter(option => !option.disabled).map(option => option.value);
      this.multiSelectService.selectionModel.deselect(...enabledOptions);
    });

    this.searchValue = '';
    if ($event) {
      this.setFocus('program', 'clearAllOptions');
    }
  }

  selectAllOptions() {
    const enabledOptions = Array.from(this.#options.values()).filter(option => option.visible && !option.disabled).map(option => option.value);
    this.multiSelectService.selectionModel.select(...enabledOptions);
    this.inputElementSize();
  }

  handleTagRemove(value: any) {
    this.multiSelectService.selectionModel.deselect(value);
    this.setFocus('program', 'handleTagRemove');
  }

  setFocus(origin: FocusOrigin = 'program', methodName?: string) {
    if (this.disabled) {
      return;
    }
    const element = <HTMLElement>(this.inputElement.nativeElement ?? this.elementRef.nativeElement);
    const preventScroll = origin === 'program';
    this.focusMonitor?.focusVia(element, origin, { preventScroll: preventScroll });
    // console.log('setFocus', origin, methodName, 'preventScroll:', preventScroll, element.tagName);
  }

  filterOptions(value: string) {
    const searchString = value.toLowerCase() ?? '';
    this.#options.forEach((item, index) => {
      if (searchString === '') {
        item.visible = true;
        return;
      }
      if (typeof this.search === 'function') {
        item.visible = this.search(item, searchString);
        return;
      }
      if (this.search === 'external' || !searchString) {
        // item.visible = true;
        return;
      }
      item.visible = item.label?.toLowerCase().includes(searchString) ?? true;
    });
    this.optionsArray$.next(Array.from(this.#options.values()).filter((item) => item.visible));

  }

  createNativeSelect() {
    if (!this.nativeId) {
      return;
    }
    this.viewContainerRef.clear();
    this.nativeSelectRef = this.viewContainerRef.createComponent(MultiSelectNativeSelectComponent);
    this.updateNativeSelect();
  }

  updateNativeSelect() {
    if (!this.nativeSelectRef || !this.nativeId) {
      return;
    }
    const options = Array.from(this.optionsSelected).map(item => {
      const { selected, value, label } = item[1];
      return { selected, value, label };
    });

    this.nativeSelectRef.instance.multiple = this.multiple;
    this.nativeSelectRef.instance.form = this.nativeFormId;
    this.nativeSelectRef.instance.id = this.nativeId;
    this.nativeSelectRef.instance.name = this.nativeName;
    this.nativeSelectRef.instance.options = [...options];
    this.nativeSelectRef.instance.disabled = this.disabled;
    this.nativeSelectRef.instance.changeDetectorRef.markForCheck();
  }

  inputElementSize() {
    setTimeout(() => {
      if (this.inputElement) {
        if ((this.optionsSelected.size > 0 || this.selectionType === 'counter') && !this.inputElement.nativeElement?.disabled) {
          this.renderer.setAttribute(this.inputElement.nativeElement, 'size', (this.searchValue.length + 2).toString());
        } else {
          this.renderer.removeAttribute(this.inputElement.nativeElement, 'size');
        }
      }
    });
  }

  handleSearchKeyDown($event: KeyboardEvent) {
    if (this.searchValue.length || this.optionsSelected.size === 0) {
      return;
    }

    if (['Backspace', 'Delete'].includes($event.key)) {
      $event.stopPropagation();
      const last = this.selectedOptions.filter(option => !option.disabled).pop();
      if (last) {
        this.multiSelectService.selectionModel.deselect(last.value);
      }
    }
  }

  private setFocusMonitor(monitor: boolean) {
    if (monitor && !this.disabled) {
      this.focusMonitorSubscription = this.focusMonitor?.monitor(this.elementRef, true)
        .pipe(
          // to avoid focus lost on speed scrolling with virtualScroll
          debounceTime(100)
        )
        .subscribe((origin) => {
          this.ngZone.run(() => {
            this.subtreeFocused = this.focusOrigin(origin);
            this.changeDetectorRef?.markForCheck();
          });
        });
    } else {
      this.focusMonitor?.stopMonitoring(this.elementRef);
      this.focusMonitorSubscription?.unsubscribe();
    }
  }

  activeOption: (FocusableOption & MultiSelectOptionComponent) | null = null;

  handleScrolledIndexChange(scrolledIndex: number, scrollViewport: CdkVirtualScrollViewport) {

    if (!this.scrollViewport) {
      this.scrollViewport = scrollViewport;
    }

    const availableOptions = this.options.filter(option => option.visible);
    const firstVisibleOption = availableOptions[scrolledIndex];
    const activeOptionIndex = availableOptions.findIndex(option => option.value === this.activeOption?.value);
    const optionsArray = this.multiSelectOptionsContent.toArray();

    if (scrolledIndex > activeOptionIndex) {
      const firstVisibleItem = optionsArray.find(option => option.value === firstVisibleOption?.value);
      if (firstVisibleItem && scrolledIndex) {
        this.listKeyManager.setActiveItem(firstVisibleItem);
      }
      return;
    }

    if (scrolledIndex + this.visibleItems - 2 <= activeOptionIndex) {
      const lastVisibleItem = optionsArray.findIndex(option => option.value === firstVisibleOption.value);
      if (lastVisibleItem > -1) {
        this.listKeyManager.setActiveItem(lastVisibleItem + this.visibleItems - 2);
      }
      return;
    }

  }

  trackByFn(index: number, option: IOption) {
    return option.value;
  }

  handleSearchValueChange(searchValue: string) {
    this.searchValue = searchValue;
    if (!searchValue) {
      this.scrollViewport?.scrollToIndex(0);
      this.multiSelectOptionsContent.notifyOnChanges();
    }
  }

  private setVirtualScroller() {

    if (!this.virtualScroller) {
      return;
    }

    // multiSelectOptionTemplate for virtualScroller
    this.contentTemplates.forEach((child: TemplateIdDirective) => {
      this.templates[child.id] = child.templateRef;
    });

    // if no template found, get defaultMultiSelectOptionTemplate from view
    if (!this.templates['multiSelectOptionTemplate']) {
      this.multiSelectOptionsContent = this.multiSelectOptionsView;
    }

    // multiSelectOptionsContent gets out of order on changes
    // do sort() and reset()
    const indexOfOption = (option: MultiSelectOptionComponent) => {
      return [...option.elementRef.nativeElement.parentElement.children]?.indexOf(option.elementRef.nativeElement);
    };

    const optionsChange$: Observable<QueryList<MultiSelectOptionComponent>> = this.multiSelectOptionsContent.changes;

    const sortedOptions$ = optionsChange$.pipe(
      map(options => options.toArray()),
      filter(options => options.length > 0),
      map(options => options.sort((a, b) => indexOfOption(a) - indexOfOption(b))),
      takeUntilDestroyed(this.destroyRef)
    );

    sortedOptions$
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(sortedOptions => {
        return this.multiSelectOptionsContent.reset(sortedOptions);
      });

    this.scrollViewportView.changes
      .pipe(
        take(1),
        map(changes => changes.toArray()[0]),
        tap((scrollViewport) => {
            if (!this.scrollViewport) {
              this.scrollViewport = scrollViewport;

              const cdkVirtualScrollContentWrapper = this.scrollViewport.getElementRef().nativeElement?.firstElementChild;
              if (cdkVirtualScrollContentWrapper) {

                const style = getComputedStyle(cdkVirtualScrollContentWrapper, null);
                const padding = parseInt(style.getPropertyValue('padding-left') ?? '12px') * 3;

                const observer = new MutationObserver((mutationRecords) => {
                  mutationRecords.forEach(child => {
                    child.addedNodes.forEach(node => {
                      if (node.nodeName === 'C-MULTI-SELECT-OPTION') {
                        const width = (node as HTMLElement).offsetWidth;
                        if (width > this.itemMinWidth) {
                          this.itemMinWidth = width + padding;
                        }
                      }
                    });
                  });
                });

                observer.observe(cdkVirtualScrollContentWrapper, { childList: true });

                this.#destroy$.subscribe(() => {
                  observer.disconnect();
                });
              }
            }
          }
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private setListKeyManager() {

    // run once on multiSelectOptionsContent first set
    this.multiSelectOptionsContent.changes
      .pipe(
        take(1),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(change => {

        this.listKeyManager = new FocusKeyManager(this.multiSelectOptionsContent)
          .withHomeAndEnd()
          .skipPredicate((option) => (option.disabled || !option.visible));

        if (!this._virtualScroller) {
          this.listKeyManager.withTypeAhead(300);
        }

        this.listKeyManager.change
          .pipe(
            takeUntilDestroyed(this.destroyRef)
          )
          .subscribe(change => {
            if (change < 0) {
              this.activeOption ? this.listKeyManager.setActiveItem(this.activeOption) : this.setFirstItemActive();
            }
            if (this.listKeyManager.activeItem) {
              this.listKeyManager.activeItem.active = true;
            }
            this.activeOption = this.listKeyManager.activeItem;
            this.multiSelectOptionsContent.notifyOnChanges();
          });

        if (!this.listKeyManager.activeItem) {
          this.setFirstItemActive();
        }
      });
  }

  get firstFocusableItem() {
    return this.multiSelectOptionsContent?.find(option => option.visible && !option.disabled);
  }

  private setFirstItemActive() {
    const firstFocusableItem = this.firstFocusableItem;
    firstFocusableItem ? this.listKeyManager?.setActiveItem(firstFocusableItem) : this.listKeyManager?.setFirstItemActive();
    this.activeOption = this.listKeyManager?.activeItem ?? null;
  }

  updateActiveItem(index: number): void;

  updateActiveItem<T extends (MultiSelectOptionComponent & FocusableOption)>(item: T): void;

  updateActiveItem(item: any) {
    const firstFocusableItem = this.firstFocusableItem ?? item;
    firstFocusableItem ? this.listKeyManager?.updateActiveItem(firstFocusableItem) : this.listKeyManager?.updateActiveItem(0);
    if (this.listKeyManager?.activeItem) {
      this.multiSelectOptionsContent?.forEach(option => {
        option.active = false;
      });
      this.listKeyManager.activeItem.active = true;
    }
    this.activeOption = this.listKeyManager?.activeItem ?? null;
  }
}
