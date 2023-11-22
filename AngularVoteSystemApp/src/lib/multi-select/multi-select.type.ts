import { EventEmitter } from '@angular/core';

export type SearchFn = ((option: IOption, searchValue: string) => boolean)

export interface IMultiSelect {
  cleaner?: boolean;
  multiple?: boolean;
  options?: IOption[];
  optionsMaxHeight?: (number | string | 'auto');
  optionsStyle?: (string | 'checkbox' | 'text');
  placeholder?: string;
  search?: boolean | 'external' | SearchFn;
  searchValue?: string;
  searchValueChange?: EventEmitter<string>;
  searchNoResultsLabel?: string;
  selectAll?: boolean;
  selectAllLabel?: string;
  selectionType?: ('counter' | 'tags' | 'text');
  selectionTypeCounterText?: string;
  value?: string | string[];
  valueChange?: EventEmitter<string | string[]>;
  virtualScroller?: boolean;
  visibleItems?: number;
  visible?: boolean;
  visibleChange?: EventEmitter<boolean>;
}

export type TOptions = IOption[];

export interface IOption {
  disabled?: boolean;
  id?: string;
  label?: string;
  options?: TOptions;
  order?: number;
  selected?: boolean;
  text?: string;
  value: string;
  visible?: boolean;
}

export interface IMultiSelectOptions {
  handleOptionClick?: (option: IOption) => void;
  options?: IOption[];
  optionsMaxHeight?: number | string;
  optionsStyle?: 'checkbox' | 'text';
  searchNoResultsLabel?: string;
}
