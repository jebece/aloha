import { Component, OnInit, inject } from '@angular/core';
import { AccoUnitService } from '../../../services/acco-unit/acco-unit.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AccommodationService } from '../../../services/accommodation/accommodation.service';
import { CategoryService } from '../../../services/category/category.service';
import { ServiceService } from '../../../services/service/service.service';
import { User } from '../../../services/auth/user';
import { LoginService } from '../../../services/auth/login.service';
import { AccoUnitServiceService } from '../../../services/acco-unit-service/acco-unit-service.service';
import { JwtDecoderService } from '../../../services/jwt-decoder/jwt-decoder.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-admin-acco-units',
  templateUrl: './admin-acco-units.component.html',
  styleUrl: './admin-acco-units.component.css'
})
export class AdminAccoUnitsComponent {
  userLoginOn: boolean = false;
  user?: User;
  decodedToken: any;
  unautorized: boolean = true;
  accommodations: any;
  accoUnits: any;
  accoUnitsServices: any;
  accoUnitServices: any = [];
  categories: any;
  services: any;
  selectedAccoUnitId: number | null = null;
  page: number = 1;
  showRows: boolean = false;
  accoUnitFilter: any = { accommodation: { name: '' } };
  order: string = 'accommodation.name';
  reverse: boolean = false;

  adminAccoUnitsError: string = '';
  adminAccoUnitsForm = this.formBuilder.group({
    accommodationId: ['', Validators.required],
    categoryId: ['', Validators.required],
    price: ['', Validators.required],
    number: ['', Validators.required],
    capacity: ['', Validators.required],
    selectedServices: [[], Validators.required]
  });

  adminAccoUnitsEditForm = this.formBuilder.group({
    editAccommodationId: ['', Validators.required],
    editCategoryId: ['', Validators.required],
    editPrice: ['', Validators.required],
    editNumber: ['', Validators.required],
    editCapacity: ['', Validators.required],
    editSelectedServices: [[], Validators.required]
  });

  private jwtDecoderService = inject(JwtDecoderService);

  constructor(private loginService: LoginService, private userService: UserService, private accoUnitService: AccoUnitService, private categoryService: CategoryService, private serviceService: ServiceService, private formBuilder: FormBuilder, private router: Router, private spinner: NgxSpinnerService, private accommodationService: AccommodationService, private accoUnitServiceService: AccoUnitServiceService, private toastr: ToastrService) {}
  
  ngOnInit(): void {
    this.loginService.currentUserLoginOn.subscribe({
      next: (userLoginOn) => {
        this.userLoginOn = userLoginOn;
      }
    });
    if(this.userLoginOn) {
    this.userService.getUser().subscribe({
      next: (userData) => {
        this.user = userData;
        if (this.user && this.user.token) {
          this.decodedToken = this.jwtDecoderService.decodeToken(this.user.token);
        }
        if (this.decodedToken.role === 'ADMIN') {
          this.unautorized = false;
        }
      }
    });
    }
    if (this.unautorized) {
      this.router.navigate(['login']);
      this.toastr.error('Inicia sesión como administrador', 'Acceso restringido', { timeOut: 2000, toastClass: 'ngx-toastr custom-toast', positionClass: 'toast-bottom-right' });
    } else {
    this.accommodationService.getAccommodations().subscribe(
      (data) => {
        this.accommodations = data;
      },
      (error) => {
        console.error('Error al obtener los alojamientos', error);
      }
    );
    this.categoryService.getCategories().subscribe(
      (data) => {
        this.categories = data;
      },
      (error) => {
        console.error('Error al obtener las categorías', error);
      }
    );
    this.serviceService.getServices().subscribe(
      (data) => {
        this.services = data;
      },
      (error) => {
        console.error('Error al obtener los servicios', error);
      }
    );
    this.accoUnitService.getAccoUnits().subscribe(
      (data) => {
        this.accoUnits = data;
        if (Array.isArray(this.accoUnits) && this.accoUnits.length > 0) {
          this.showRows = true;
          this.accoUnitServiceService.getAccoUnitServices().subscribe(
            (data) => {
              this.accoUnitsServices = data;
                this.accoUnits.forEach((unit: any) => {
                this.accoUnitServices[unit.id] = [];
              });

              this.accoUnitsServices.forEach((unitService: any) => {
                if (this.accoUnitServices[unitService.accommodationUnit.id]) {
                  this.accoUnitServices[unitService.accommodationUnit.id].push(unitService.service.name);
                }
              });
            },
            (error) => {
              console.error('Error al obtener los servicios de las unidades de alojamiento', error);
            }
          );
        }
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
  }

  setOrder(columnName: string) {
    if(this.order === columnName) {
      this.reverse = !this.reverse;
    }else {
      this.reverse = false;
    }
    this.order = columnName;
  }

  createAccoUnit() {
    if (this.adminAccoUnitsForm.valid) {
      let accommodationId= this.adminAccoUnitsForm.get('accommodationId')?.value;
      let categoryId= this.adminAccoUnitsForm.get('categoryId')?.value;
      let price= this.adminAccoUnitsForm.get('price')?.value;
      let number= this.adminAccoUnitsForm.get('number')?.value;
      let capacity= this.adminAccoUnitsForm.get('capacity')?.value;
      let selectedServices= this.adminAccoUnitsForm.get('selectedServices')?.value ?? [];
      let accoUnitId: number | null = null;
  
      const accoUnitData = {
        price: price!,
        number: number!,
        capacity: capacity!,
        accommodation: {
         id: accommodationId! 
        },
        category: {
          id: categoryId!
        },
      };
  
      this.accoUnitService.createAccoUnit(accoUnitData).subscribe(
        (response) => {
          console.log('Unidad de alojamiento creada correctamente:', response);
          this.accoUnitService.getAccoUnits().subscribe(
            (data) => {
              this.accoUnits = data;
              for (let i = 0; i < this.accoUnits.length; i++) {
                if (this.accoUnits[i].price == price && this.accoUnits[i].number == number && this.accoUnits[i].capacity == capacity && this.accoUnits[i].accommodation.id == accommodationId && this.accoUnits[i].category.id == categoryId) {
                  accoUnitId = this.accoUnits[i].id;
                  break;
                }
              }
              if (selectedServices.length > 0) {
                for (let i = 0; i < selectedServices.length; i++) {
                  const accoUnitServiceData = {
                    accommodationUnit: {
                      id: accoUnitId,
                      accommodation: {
                        id: accommodationId,
                      },
                      category: {
                        id: categoryId
                      }
                    },
                    service: {
                      id: selectedServices[i]
                    }
                  };
                  this.accoUnitServiceService.createAccoUnitService(accoUnitServiceData).subscribe(
                    (response) => {
                      console.log('Servicio de unidad de alojamiento insertado correctamente:', response);
                      this.adminAccoUnitsForm.reset();
                      this.router.navigate(['admin-acco-units']).then(() => {
                        window.location.reload();
                      });
                    },
                    (error) => {
                      console.error('Error al insertar el servicio de la unidad de alojamiento:', error);
                    }
                  );
                }
              }
            },
            (error) => {
              console.error('Error al obtener las unidades de alojamiento', error);
            }
          );

        },
        (error) => {
          console.error('Error al crear la unidad de alojamiento:', error);
          this.adminAccoUnitsError = 'Error al crear la unidad de alojamiento. Inténtalo de nuevo.';
        }
      );


    }
  }

  editAccoUnit() {
    if (this.adminAccoUnitsEditForm.valid) {
      let editAccommodationId = this.adminAccoUnitsEditForm.get('editAccommodationId')?.value;
      let editCategoryId = this.adminAccoUnitsEditForm.get('editCategoryId')?.value;
      let editPrice = this.adminAccoUnitsEditForm.get('editPrice')?.value;
      let editNumber = this.adminAccoUnitsEditForm.get('editNumber')?.value;
      let editCapacity = this.adminAccoUnitsEditForm.get('editCapacity')?.value;
      let editSelectedServices = this.adminAccoUnitsEditForm.get('editSelectedServices')?.value ?? [];
      let accoUnitId: number | null = null;
  
      const accommodationData = {
        id: this.selectedAccoUnitId!,
        price: editPrice!,
        number: editNumber!,
        capacity: editCapacity!,
        accommodation: {
          id: editAccommodationId!
        },
        category: {
          id: editCategoryId!
        }
      };
      this.accoUnitService.updateAccoUnit(accommodationData).subscribe(
        (response) => {
          console.log('Unidad de alojamiento modificada correctamente:', response);
          this.accoUnitService.getAccoUnits().subscribe(
            (data) => {
              this.accoUnits = data;
              for (let i = 0; i < this.accoUnits.length; i++) {
                if (this.accoUnits[i].price == editPrice && this.accoUnits[i].number == editNumber && this.accoUnits[i].capacity == editCapacity && this.accoUnits[i].accommodation.id == editAccommodationId && this.accoUnits[i].category.id == editCategoryId) {
                  accoUnitId = this.accoUnits[i].id;
                  break;
                }
              }
              this.accoUnitServiceService.getAccoUnitServicesByAccoUnitId(accoUnitId).subscribe(
                (data) => {
                  this.accoUnitsServices = data;
                  for (let i = 0; i < this.accoUnitsServices.length; i++) {
                    if (this.accoUnitsServices[i].accommodationUnit.id == accoUnitId) {     
                      this.accoUnitServiceService.deleteAccoUnitService(this.accoUnitsServices[i].id).subscribe(
                        (response) => {
                          console.log('Servicio de unidad de alojamiento eliminado correctamente:', response);
                        },
                        (error) => {
                          console.error('Error al eliminar el servicio de la unidad de alojamiento:', error);
                        }
                      );
                    }
                  }
                },
                (error) => {
                  console.error('Error al obtener los servicios de las unidades de alojamiento', error);
                },
                () => {
                  if (editSelectedServices.length > 0) {
                    for (let i = 0; i < editSelectedServices.length; i++) {
                      const accoUnitServiceData = {
                        accommodationUnit: {
                          id: accoUnitId,
                          accommodation: {
                            id: editAccommodationId,
                          },
                          category: {
                            id: editCategoryId
                          }
                        },
                        service: {
                          id: editSelectedServices[i]
                        }
                      };
                      this.accoUnitServiceService.editAccoUnitService(accoUnitServiceData).subscribe(
                        (response) => {
                          console.log('Servicio de unidad de alojamiento modificado correctamente:', response);
                        },
                        (error) => {
                          console.error('Error al modificar el servicio de la unidad de alojamiento:', error);
                        }
                      );
                    }
                  }
                  this.adminAccoUnitsEditForm.reset();
                  this.router.navigate(['admin-acco-units']).then(() => {
                    window.location.reload();
                  });
                }
              );
            },
            (error) => {
              console.error('Error al obtener las unidades de alojamiento', error);
            }
          );
        },
        (error) => {
          console.error('Error al modificar la unidad de alojamiento:', error);
          this.adminAccoUnitsError = 'Error al modificar al alojamiento. Inténtalo de nuevo.';
        }
      );
    }
  }
  

  deleteAccoUnit() {
    if (this.selectedAccoUnitId !== null) {
      const id = this.selectedAccoUnitId;


      this.accoUnitService.deleteAccoUnit(id).subscribe({
        next: (userData) => {
          console.log(userData);
        },
        error: (errorData) => {
          console.log(errorData);
          this.adminAccoUnitsError = "Error al eliminar la unidad de alojamiento. Inténtalo de nuevo.";
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

  get accommodationId() {
    return this.adminAccoUnitsForm.controls.accommodationId;
  }
  get categoryId() {
    return this.adminAccoUnitsForm.controls.categoryId;
  }
  get price() {
    return this.adminAccoUnitsForm.controls.price;
  }
  get number() {
    return this.adminAccoUnitsForm.controls.number;
  }

  get capacity() {
    return this.adminAccoUnitsForm.controls.capacity;
  }
  get selectedServices() {
    return this.adminAccoUnitsForm.controls.selectedServices;
  }

  get editAccommodationId() {
    return this.adminAccoUnitsEditForm.controls.editAccommodationId;
  }
  get editCategoryId() {
    return this.adminAccoUnitsEditForm.controls.editCategoryId;
  }
  get editPrice() {
    return this.adminAccoUnitsEditForm.controls.editPrice;
  }
  get editNumber() {
    return this.adminAccoUnitsEditForm.controls.editNumber;
  }
  get editCapacity() {
    return this.adminAccoUnitsEditForm.controls.editCapacity;
  }
  get editSelectedServices() {
    return this.adminAccoUnitsEditForm.controls.editSelectedServices;
  }

  loadAccoUnitData() {
    if (this.selectedAccoUnitId !== null) {
      const selectedAccoUnit = this.accoUnits.find((accoUnit: any) => accoUnit.id === this.selectedAccoUnitId);
      if (selectedAccoUnit) {
        this.adminAccoUnitsEditForm.patchValue({
          editAccommodationId: selectedAccoUnit.accommodation.id,
          editCategoryId: selectedAccoUnit.category.id,
          editPrice: selectedAccoUnit.price,
          editNumber: selectedAccoUnit.number,
          editCapacity: selectedAccoUnit.capacity
        });
      }
    }
  }
}
