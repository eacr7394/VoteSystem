### [coreui-pro-angular-admin-template](https://coreui.io/angular/) changelog


---

#### `4.5.4`

update to:
- `Angular 16.1`
- `TypeScript 4.9.5`
- `@coreui/angular-pro ~4.5.4`
- `@coreui/angular-chartjs ~4.5.2`
- `@coreui/icons-angular ~4.5.2`

- refactor: remove deprecated ngx-perfect-scrollbar, use `ngx-scrollbar` instead

---

#### `4.4.0`

- chore(dependencies): update
- refactor: fallbacks for getStyle()
- refactor(smart-table): header text-truncate example
- refactor(date-range-picker): selectAdjacentDays, showAdjacentDays example
- fix(dark-theme): accordion-button, alert btn-close, badges 
- fix(full-calendar): add themeSystem to calendarOptions
- fix(google-maps): apiKey type 

---

#### `4.5.2`

- chore(dependencies): update to `Angular 16.1`

---

#### `4.5.0`

- chore(dependencies): update to `Angular 16`
- refactor: remove deprecated ngx-perfect-scrollbar, use `ngx-scrollbar` instead
- fix: getStyle() add nullish check
- refactor(toasters): use takeUntilDestroyed() operator

---

#### `4.3.13`

- docs(LICENSE): add missing license info
- chore(dependencies): update

---

#### `4.3.12`

- chore(dependencies): update

---

#### `4.3.11`

- chore(dependencies): update `@angular/*` to version `^15.2.7`
- standalone components:
  - chore(dependencies): update `@coreui/angular-pro` to version `~4.4.3`
  - chore(dependencies): update `@coreui/angular-chartjs` to version `~4.4.1`
  - chore(dependencies): update `@coreui/icons-angular` to version `~4.4.1`
- fix(widgets): breakpoints
- feat(date-picker): closeOnSelect example
- feat(date-range-picker): closeOnSelect example

---

#### `4.3.10`

- chore(dependencies): update `@angular/*` to version `^15.2.4`
- chore(dependencies): update `@coreui/angular` to version `~4.3.17`
- chore(dependencies): update `@coreui/angular-chartjs` to version `~4.3.17`
- chore(dependencies): update `@coreui/icons-angular` to version `~4.3.17`
- chore(dependencies): update `@coreui/icons` to version `^3.0.1`
- chore(dependencies): update `@coreui/charts` to version `^3.1.1`
- chore(dependencies): update `@coreui/utils` to version `^2.0.1`

imports update required :boom: :exclamation:
- from `import {getStyle, ...} from '@coreui/utils/src`
- to `import  {getStyle, ...} from '@coreui/utils` 

---

#### `4.3.9`

- chore: dependencies update
- fix(widgets): add missing pointBackgroundColor

---

#### `4.3.0`

update to:
- `Angular 15`
- `TypeScript 4.8`
- `RxJS 7.5`
- `FullClaendar 6.0`

---
- chore(full-calendar): update @fullcalendar/* to v6.0.0
  - chore(angular.json): remove @fullcalendar/* css styles
  - refactor(full-calendar-ng): move `CalendarOptions` and `plugins` from module to the component
  - see:
    - [v6 Release Notes and Upgrade Guide](https://fullcalendar.io/docs/upgrading-from-v5)
    - [Angular-specific Changes](https://fullcalendar.io/docs/upgrading-from-v5#angular-specific-changes)

---
- refactor(AppComponent): change selector to `app-root`
- refactor(smart-table): extract card-body div for smooth collapse animation
- fix(pages): add missing dark-theme classes

