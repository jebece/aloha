import { Component, OnInit, inject } from '@angular/core';
import { AccommodationService } from '../../../services/accommodation/accommodation.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from '../../../services/auth/user';
import { LoginService } from '../../../services/auth/login.service';
import { UserService } from '../../../services/user/user.service';
import { JwtDecoderService } from '../../../services/jwt-decoder/jwt-decoder.service';
import { ToastrService } from 'ngx-toastr';
import { UploadService } from '../../../services/upload/upload.service';
import { ImageService } from '../../../services/image/image.service';

@Component({
  selector: 'app-admin-accommodations',
  templateUrl: './admin-accommodations.component.html',
  styleUrl: './admin-accommodations.component.css'
})
export class AdminAccommodationsComponent implements OnInit {
  userLoginOn: boolean = false;
  user?: User;
  decodedToken: any;
  unautorized: boolean = true;
  accommodations: any;
  accommodationsChecking: any;
  selectedAccommodationId: number | null = null;
  accommodationIdFind: number | null = null;
  page: number = 1;
  showRows: boolean = false;
  accommodationFilter: any = { name: '' };
  order: string = 'name';
  reverse: boolean = false;
  files: File[] = [];
  showSpinner: boolean = false;

  adminAccommodationsError: string = '';
  adminAccommodationsForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    description: ['', [Validators.required, Validators.minLength(255), Validators.maxLength(1000)]],
    address: ['', [Validators.required, Validators.maxLength(100)]],
    location: ['', [Validators.required, Validators.maxLength(50)]]
  });

  adminAccommodationsEditForm = this.formBuilder.group({
    editName: ['', [Validators.required, Validators.maxLength(50)]],
    editDescription: ['', [Validators.required, Validators.minLength(255), Validators.maxLength(1000)]],
    editAddress: ['', [Validators.required, Validators.maxLength(100)]],
    editLocation: ['', [Validators.required, Validators.maxLength(50)]]
  });

  private jwtDecoderService = inject(JwtDecoderService);

  constructor(private loginService: LoginService, private userService: UserService, private accommodationService: AccommodationService, private formBuilder: FormBuilder, private router: Router, private spinner: NgxSpinnerService, private toastr: ToastrService, private uploadService: UploadService, private imageService: ImageService) { }

  ngOnInit(): void {
    this.loginService.currentUserLoginOn.subscribe({
      next: (userLoginOn) => {
        this.userLoginOn = userLoginOn;
      }
    });
    if (this.userLoginOn) {
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
  }

  setOrder(columnName: string) {
    if (this.order === columnName) {
      this.reverse = !this.reverse;
    } else {
      this.reverse = false;
    }
    this.order = columnName;
  }

  createAccommodation() {
    if (this.adminAccommodationsForm.valid) {
      if (this.files.length > 0) {
        this.showSpinner = true;
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
            this.accommodationService.getAccommodations().subscribe(
              (data) => {
                this.accommodationsChecking = data;
                for (let i = 0; i < this.accommodationsChecking.length; i++) {
                  if (this.accommodationsChecking[i].name == name && this.accommodationsChecking[i].description == description && this.accommodationsChecking[i].address == address && this.accommodationsChecking[i].location == location) {
                    this.accommodationIdFind = this.accommodationsChecking[i].id;
                  }
                }
                if (this.accommodationIdFind !== null) {
                  this.uploadImages(this.accommodationIdFind);
                }
              },
              (error) => {
                console.error('Error al obtener los alojamientos', error);
              }
            );
          },
          (error) => {
            console.error('Error al crear alojamiento:', error);
            this.adminAccommodationsError = 'Error al crear el alojamiento. Inténtalo de nuevo.';
          }
        );
      } else {
        this.adminAccommodationsError = 'Debes subir al menos una imagen';
      }
    }
  }

  editAccommodation() {
    if (this.adminAccommodationsEditForm.valid) {
      if (this.files.length > 0) {
        this.showSpinner = true;
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
        this.accommodationService.updateAccommodation(accommodationData).subscribe(
          (response) => {
            console.log('Alojamiento modificado correctamente:', response);
            this.imageService.deleteImagesByAccommodationId(this.selectedAccommodationId!).subscribe(
              (response) => {
                console.log('Imágenes eliminadas correctamente:', response);
                this.uploadImages(this.selectedAccommodationId!);
              },
              (error) => {
                console.error('Error al eliminar las imágenes:', error);
              }
            );
          },
          (error) => {
            console.error('Error al modificar al alojamiento:', error);
            this.adminAccommodationsError = 'Error al modificar al alojamiento. Inténtalo de nuevo.';
          }
        );
      }else{
        this.adminAccommodationsError = 'Debes subir al menos una imagen';
      }
    }
  }

  deleteAccommodation() {
    if (this.selectedAccommodationId !== null) {
      const id = this.selectedAccommodationId;

      this.accommodationService.deleteAccommodation(id).subscribe({
        next: (userData) => {
          console.log(userData);
        },
        error: (errorData) => {
          console.log(errorData);
          this.adminAccommodationsError = "Error al eliminar el alojamiento. Inténtalo de nuevo.";
        },
        complete: () => {
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

  onSelect(event: any) {
    if (this.files.length + event.addedFiles.length > 12) {
      console.log('Se ha excedido el límite máximo de 12 imágenes.');
      this.adminAccommodationsError = 'Se ha excedido el límite máximo de 12 imágenes.';
      return;
    }

    this.files.push(...event.addedFiles);
  }

  onRemove(event: any) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  uploadImages(accommodationId: number) {
    if (this.files.length > 0) {
      this.files.forEach((file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'aloha-images');
        formData.append('cloud_name', 'djddmwtoy');
        this.uploadService.uploadImg(formData).subscribe(
          (response) => {
            const url = response.url;
            const imageData = {
              url: url,
              accommodation: {
                id: accommodationId
              }
            };
            this.imageService.createImage(imageData).subscribe(
              (response) => {
                console.log('Imagen subida correctamente:', response);
              },
              (error) => {
                console.error('Error al subir la imagen:', error);
              }
            );
          },
          (error) => {
            console.error('Error al subir la imagen:', error);
          }
        );
      });
    }
    this.router.navigate(['admin-accommodations']).then(() => {
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    });
  }
}
