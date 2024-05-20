import { Component } from '@angular/core';
import { AccommodationService } from '../../../services/accommodation/accommodation.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-admin-accommodations',
  templateUrl: './admin-accommodations.component.html',
  styleUrl: './admin-accommodations.component.css'
})
export class AdminAccommodationsComponent {
  accommodations: any;
  selectedAccommodationId: number | null = null;
  page: number = 1;
  showRows: boolean = false;

  adminAccommodationsError: string = '';
  adminAccommodationsForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    description: ['', [Validators.required, Validators.maxLength(250)]],
    address: ['', [Validators.required, Validators.maxLength(100)]],
    location: ['', [Validators.required, Validators.maxLength(50)]]
  });

  adminAccommodationsEditForm = this.formBuilder.group({
    editName: ['', [Validators.required, Validators.maxLength(50)]],
    editDescription: ['', [Validators.required, Validators.maxLength(250)]],
    editAddress: ['', [Validators.required, Validators.maxLength(100)]],
    editLocation: ['', [Validators.required, Validators.maxLength(50)]]
  });

  constructor(private accommodationService: AccommodationService, private formBuilder: FormBuilder, private router: Router, private spinner: NgxSpinnerService) {}
  
  ngOnInit(): void {
    this.accommodationService.getAccommodations().subscribe(
      (data) => {
        this.accommodations = data;
        if (Array.isArray(this.accommodations) && this.accommodations.length > 0) {
          this.showRows = true;
        }
      },
      (error) => {
        console.error('Error al obtener los alojamientos', error);
      }
    );

    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 500);
  }

  createAccommodation() {
    if (this.adminAccommodationsForm.valid) {
      let name = this.adminAccommodationsForm.get('name')?.value;
      let description = this.adminAccommodationsForm.get('description')?.value;
      let address = this.adminAccommodationsForm.get('address')?.value;
      let location = this.adminAccommodationsForm.get('location')?.value;
  
      const accommodationData = {
        name: name!,
        description: description!,
        address: address!,
        location: location!
      };
  
      this.accommodationService.createAccommodation(accommodationData).subscribe(
        (response) => {
          console.log('Alojamiento creado correctamente:', response);
          this.adminAccommodationsForm.reset();
          this.router.navigate(['admin-accommodations']).then(() => {
            window.location.reload();
          });
        },
        (error) => {
          console.error('Error al crear alojamiento:', error);
          this.adminAccommodationsError = 'Error al crear el alojamiento. Por favor, inténtalo de nuevo.';
        }
      );
    }
  }

  editAccommodation() {
    if (this.adminAccommodationsEditForm.valid) {
      let editName = this.adminAccommodationsEditForm.get('editName')?.value;
      let editDescription = this.adminAccommodationsEditForm.get('editDescription')?.value;
      let editAddress = this.adminAccommodationsEditForm.get('editAddress')?.value;
      let editLocation = this.adminAccommodationsEditForm.get('editLocation')?.value;

      const accommodationData = {
        id: this.selectedAccommodationId!,
        name: editName!,
        description: editDescription!,
        address: editAddress!,
        location: editLocation!
      };
      console.log(this.selectedAccommodationId!);
      this.accommodationService.updateAccommodation(accommodationData).subscribe(
        (response) => {
          console.log('Alojamiento modificado correctamente:', response);
          this.adminAccommodationsEditForm.reset();
          this.router.navigate(['admin-accommodations']).then(() => {
            window.location.reload();
          });
        },
        (error) => {
          console.error('Error al modificar al alojamiento:', error);
          this.adminAccommodationsError = 'Error al modificar al alojamiento. Por favor, inténtalo de nuevo.';
        }
      );
    }
  }

  deleteAccommodation() {
    if (this.selectedAccommodationId !== null) {
      const deleteData: any = {
        id: this.selectedAccommodationId
      };

      this.accommodationService.deleteAccommodation(deleteData).subscribe({
        next: (userData) => {
          console.log(userData);
        },
        error: (errorData) => {
          console.log(errorData);
          this.adminAccommodationsError = errorData;
        },
        complete: () => {
          console.info('Borrado completo');
          this.router.navigate(['admin-accommodations']).then(() => {
            window.location.reload();
          });
        }
      });
    } else {
      console.error('Alojamiento no seleccionado');
    }
  }

  selectAccommodationId(id: number) {
    this.selectedAccommodationId = id;
    this.loadAccommodationData();
  }

  get name() {
    return this.adminAccommodationsForm.controls.name;
  }
  get description() {
    return this.adminAccommodationsForm.controls.description;
  }
  get address() {
    return this.adminAccommodationsForm.controls.address;
  }
  get location() {
    return this.adminAccommodationsForm.controls.location;
  }

  get editName() {
    return this.adminAccommodationsEditForm.controls.editName;
  }
  get editDescription() {
    return this.adminAccommodationsEditForm.controls.editDescription;
  }
  get editAddress() {
    return this.adminAccommodationsEditForm.controls.editAddress;
  }
  get editLocation() {
    return this.adminAccommodationsEditForm.controls.editLocation;
  }

  loadAccommodationData() {
    if (this.selectedAccommodationId !== null) {
      const selectedAccommodation = this.accommodations.find((accommodation: any) => accommodation.id === this.selectedAccommodationId);
      if (selectedAccommodation) {
        this.adminAccommodationsEditForm.patchValue({
          editName: selectedAccommodation.name,
          editDescription: selectedAccommodation.description,
          editAddress: selectedAccommodation.address,
          editLocation: selectedAccommodation.location
        });
      }
    }
  }
}
