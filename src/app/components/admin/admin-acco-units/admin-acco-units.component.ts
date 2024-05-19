import { Component } from '@angular/core';
import { AccoUnitService } from '../../../services/acco-unit/acco-unit.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AccommodationService } from '../../../services/accommodation/accommodation.service';

@Component({
  selector: 'app-admin-acco-units',
  templateUrl: './admin-acco-units.component.html',
  styleUrl: './admin-acco-units.component.css'
})
export class AdminAccoUnitsComponent {
  accommodations: any;
  accoUnits: any;
  selectedAccoUnitId: number | null = null;
  page: number = 1;

  adminAccoUnitsError: string = '';
  adminAccoUnitsForm = this.formBuilder.group({
    accommodationId: ['', Validators.required],
    description: ['', [Validators.required, Validators.maxLength(250)]],
    address: ['', [Validators.required, Validators.maxLength(100)]],
    location: ['', [Validators.required, Validators.maxLength(50)]]
  });

  adminAccoUnitsEditForm = this.formBuilder.group({
    editName: ['', [Validators.required, Validators.maxLength(50)]],
    editDescription: ['', [Validators.required, Validators.maxLength(250)]],
    editAddress: ['', [Validators.required, Validators.maxLength(100)]],
    editLocation: ['', [Validators.required, Validators.maxLength(50)]]
  });

  constructor(private accoUnitService: AccoUnitService, private formBuilder: FormBuilder, private router: Router, private spinner: NgxSpinnerService, private accommodationService: AccommodationService) {}
  
  ngOnInit(): void {
    this.accommodationService.getAccommodations().subscribe(
      (data) => {
        this.accommodations = data;
      },
      (error) => {
        console.error('Error al obtener los alojamientos', error);
      }
    );
    this.accoUnitService.getAccoUnits().subscribe(
      (data) => {
        this.accoUnits = data;
      },
      (error) => {
        console.error('Error al obtener las unidades de alojamiento', error);
      }
    );
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 500);
  }

  createAccoUnit() {
    if (this.adminAccoUnitsForm.valid) {
      let name = this.adminAccoUnitsForm.get('name')?.value;
      let description = this.adminAccoUnitsForm.get('description')?.value;
      let address = this.adminAccoUnitsForm.get('address')?.value;
      let location = this.adminAccoUnitsForm.get('location')?.value;
  
      const accoUnitData = {
        name: name!,
        description: description!,
        address: address!,
        location: location!
      };
  
      this.accoUnitService.createAccoUnit(accoUnitData).subscribe(
        (response) => {
          console.log('Alojamiento creado correctamente:', response);
          this.adminAccoUnitsForm.reset();
          this.router.navigate(['admin-acco-units']).then(() => {
            window.location.reload();
          });
        },
        (error) => {
          console.error('Error al crear alojamiento:', error);
          this.adminAccoUnitsError = 'Error al crear la unidad de alojamiento. Por favor, inténtalo de nuevo.';
        }
      );
    }
  }

  editAccoUnit() {
    if (this.adminAccoUnitsEditForm.valid) {
      let editName = this.adminAccoUnitsEditForm.get('editName')?.value;
      let editDescription = this.adminAccoUnitsEditForm.get('editDescription')?.value;
      let editAddress = this.adminAccoUnitsEditForm.get('editAddress')?.value;
      let editLocation = this.adminAccoUnitsEditForm.get('editLocation')?.value;

      const accommodationData = {
        id: this.selectedAccoUnitId!,
        name: editName!,
        description: editDescription!,
        address: editAddress!,
        location: editLocation!
      };
      console.log(this.selectedAccoUnitId!);
      this.accoUnitService.updateAccoUnit(accommodationData).subscribe(
        (response) => {
          console.log('Unidad de alojamiento modificada correctamente:', response);
          this.adminAccoUnitsEditForm.reset();
          this.router.navigate(['admin-acco-units']).then(() => {
            window.location.reload();
          });
        },
        (error) => {
          console.error('Error al modificar la unidad de alojamiento:', error);
          this.adminAccoUnitsError = 'Error al modificar al alojamiento. Por favor, inténtalo de nuevo.';
        }
      );
    }
  }

  deleteAccoUnit() {
    if (this.selectedAccoUnitId !== null) {
      const deleteData: any = {
        id: this.selectedAccoUnitId
      };

      this.accoUnitService.deleteAccoUnit(deleteData).subscribe({
        next: (userData) => {
          console.log(userData);
        },
        error: (errorData) => {
          console.log(errorData);
          this.adminAccoUnitsError = errorData;
        },
        complete: () => {
          console.info('Borrado completo');
          this.router.navigate(['admin-acco-units']).then(() => {
            window.location.reload();
          });
        }
      });
    } else {
      console.error('Alojamiento no seleccionado');
    }
  }

  selectAccoUnitId(id: number) {
    this.selectedAccoUnitId = id;
    this.loadAccoUnitData();
  }

  get accommodationIn() {
    return this.adminAccoUnitsForm.controls.accommodationId;
  }
  get description() {
    return this.adminAccoUnitsForm.controls.description;
  }
  get address() {
    return this.adminAccoUnitsForm.controls.address;
  }
  get location() {
    return this.adminAccoUnitsForm.controls.location;
  }

  get editName() {
    return this.adminAccoUnitsEditForm.controls.editName;
  }
  get editDescription() {
    return this.adminAccoUnitsEditForm.controls.editDescription;
  }
  get editAddress() {
    return this.adminAccoUnitsEditForm.controls.editAddress;
  }
  get editLocation() {
    return this.adminAccoUnitsEditForm.controls.editLocation;
  }

  loadAccoUnitData() {
    if (this.selectedAccoUnitId !== null) {
      const selectedAccoUnit = this.accoUnits.find((accoUnit: any) => accoUnit.id === this.selectedAccoUnitId);
      if (selectedAccoUnit) {
        this.adminAccoUnitsEditForm.patchValue({
          editName: selectedAccoUnit.name,
          editDescription: selectedAccoUnit.description,
          editAddress: selectedAccoUnit.address,
          editLocation: selectedAccoUnit.location
        });
      }
    }
  }
}
