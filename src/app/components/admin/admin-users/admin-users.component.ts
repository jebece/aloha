import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ClientService } from '../../../services/client/client.service';
import { FormBuilder, Validators } from '@angular/forms';
import { deleteRequest } from '../../../services/client/deleteRequest';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css'
})
export class AdminUsersComponent {
  clients: any;
  selectedClientId: number | null = null;
  page: number = 1;
  showRows: boolean = false;

  adminUsersError: string = '';
  adminUsersForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    surname: ['', [Validators.required, Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
    password: ['', Validators.required]
  });

  adminUsersEditForm = this.formBuilder.group({
    editName: ['', [Validators.required, Validators.maxLength(50)]],
    editSurname: ['', [Validators.required, Validators.maxLength(50)]],
    editEmail: ['', [Validators.required, Validators.email]],
    editPhone: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]]
  });

  constructor(private formBuilder: FormBuilder, private clientService: ClientService, private router: Router, private spinner: NgxSpinnerService) {}

  ngOnInit(): void {
    this.clientService.getClients().subscribe(
      (data) => {
        this.clients = data;
        if (Array.isArray(this.clients) && this.clients.length > 0) {
          this.showRows = true;
        }
      },
      (error) => {
        console.error('Error al obtener a los clientes', error);
      }
    );

    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 500);
  }


  createClient() {
    if (this.adminUsersForm.valid) {
      let name = this.adminUsersForm.get('name')?.value;
      let surname = this.adminUsersForm.get('surname')?.value;
      let email = this.adminUsersForm.get('email')?.value;
      let phone = this.adminUsersForm.get('phone')?.value;
      let password = this.adminUsersForm.get('password')?.value;
  
      const userData = {
        name: name!,
        surname: surname!,
        email: email!,
        phone: phone!,
        role: 'CLIENT',
        password: password!
      };
  
      this.clientService.createClient(userData).subscribe(
        (response) => {
          console.log('Cliente añadido correctamente:', response);
          this.adminUsersForm.reset();
          this.router.navigate(['admin-users']).then(() => {
            window.location.reload();
          });
        },
        (error) => {
          console.error('Error al añadir cliente:', error);
          this.adminUsersError = 'Error al añadir cliente. Por favor, inténtalo de nuevo.';
        }
      );
    }
  }

  editClient() {
    if (this.adminUsersEditForm.valid) {
      let editName = this.adminUsersEditForm.get('editName')?.value;
      let editSurname = this.adminUsersEditForm.get('editSurname')?.value;
      let editEmail = this.adminUsersEditForm.get('editEmail')?.value;
      let editPhone = this.adminUsersEditForm.get('editPhone')?.value;

      const userData = {
        name: editName!,
        surname: editSurname!,
        email: editEmail!,
        phone: editPhone!
      };
      console.log(this.selectedClientId!);
      this.clientService.updateClient(this.selectedClientId!, userData).subscribe(
        (response) => {
          console.log('Cliente modificado correctamente:', response);
          this.adminUsersEditForm.reset();
          this.router.navigate(['admin-users']).then(() => {
            window.location.reload();
          });
        },
        (error) => {
          console.error('Error al modificar al cliente:', error);
          this.adminUsersError = 'Error al modificar al cliente. Por favor, inténtalo de nuevo.';
        }
      );
    }
  }
  
  deleteClient() {
    if (this.selectedClientId !== null) {
      const deleteData: deleteRequest = {
        id: this.selectedClientId
      };

      this.clientService.deleteClient(deleteData).subscribe({
        next: (userData) => {
          console.log(userData);
        },
        error: (errorData) => {
          console.log(errorData);
          this.adminUsersError = errorData;
        },
        complete: () => {
          console.info('Borrado completo');
          this.router.navigate(['admin-users']).then(() => {
            window.location.reload();
          });
        }
      });
    } else {
      console.error('Cliente no seleccionado');
    }
  }

  selectClientId(id: number) {
    this.selectedClientId = id;
    this.loadClientData();
  }

  get name() {
    return this.adminUsersForm.controls.name;
  }

  get surname() {
    return this.adminUsersForm.controls.surname;
  }

  get phone() {
    return this.adminUsersForm.controls.phone;
  }

  get email() {
    return this.adminUsersForm.controls.email;
  }

  get password() {
    return this.adminUsersForm.controls.password;
  }

  get editName() {
    return this.adminUsersEditForm.controls.editName;
  }

  get editSurname() {
    return this.adminUsersEditForm.controls.editSurname;
  }

  get editPhone() {
    return this.adminUsersEditForm.controls.editPhone;
  }

  get editEmail() {
    return this.adminUsersEditForm.controls.editEmail;
  }

  loadClientData() {
    if (this.selectedClientId !== null) {
      const selectedClient = this.clients.find((client: any) => client.id === this.selectedClientId);
      if (selectedClient) {
        this.adminUsersEditForm.patchValue({
          editName: selectedClient.name,
          editSurname: selectedClient.surname,
          editEmail: selectedClient.email,
          editPhone: selectedClient.phone
        });
      }
    }
  }
   
}
