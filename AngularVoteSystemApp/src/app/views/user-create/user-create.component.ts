import { Component } from '@angular/core';
import { UserCreateService } from './user-create.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  templateUrl: 'user-create.component.html',
  styleUrls: ['user-create.component.scss']
})
export class UserCreateComponent {

  title = 'Crear Propietario';

  protected email: string = "";
  protected name: string = "";
  protected lastname: string = "";
  protected unitId: string = "";

  protected errorMessage: string = "";
  protected error: boolean = false;

  private allOptions: any[] = [];

  options = this.allOptions;

  onSearch(term: string) {
    this.options = this.allOptions.filter(option =>
      option.number.toLowerCase().includes(term.toLowerCase())
    );
  }


  async ngOnInit(): Promise<void> {
    this.allOptions = await this.getUnits();
    this.onSearch('');
    if (this.allOptions.length > 0) {
      this.unitId = this.allOptions[0].id; 
    }
    this.cdr.detectChanges();
  }


  constructor(private userCreateService: UserCreateService, private cdr: ChangeDetectorRef) { }

  createUser(): void {
  }

  async getUnits(): Promise<any[]> {

    const units: any[] = [];

    (await this.userCreateService.getUnits()).forEach((item: []) => {
      item.forEach((item: any) => {
        let obj = { id: item.id, number: String(item.number) };
        units.push(obj);
      });
    });

    return units;
  }
}
