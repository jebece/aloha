import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ClientService } from '../../../services/client/client.service';
import { FormBuilder, Validators } from '@angular/forms';
import { deleteRequest } from '../../../services/client/deleteRequest';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css'
})
export class AdminUsersComponent {
  clients: any;
  selectedClientId: number | null = null;

  adminUsersError: string = '';
  adminUsersForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    surname: ['', [Validators.required, Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
    role: ['', Validators.required],
    password: ['', Validators.required]
  });

  adminUsersEditForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    surname: ['', [Validators.required, Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]]
  });

  constructor(private formBuilder: FormBuilder, private clientService: ClientService, private router: Router) {}

  ngOnInit(): void {
    this.clientService.getClients().subscribe(
      (data) => {
        this.clients = data;
      },
      (error) => {
        console.error('Error al obtener a los clientes', error);
      }
    );
  }


  createClient() {
    if (this.adminUsersForm.valid) {
      let name = this.adminUsersForm.get('name')?.value;
      let surname = this.adminUsersForm.get('surname')?.value;
      let email = this.adminUsersForm.get('email')?.value;
      let phone = this.adminUsersForm.get('phone')?.value;
      let role = this.adminUsersForm.get('role')?.value;
      let password = this.adminUsersForm.get('password')?.value;
  
      const userData = {
        name: name!,
        surname: surname!,
        email: email!,
        phone: phone!,
        role: role!,
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
      let name = this.adminUsersEditForm.get('name')?.value;
      let surname = this.adminUsersEditForm.get('surname')?.value;
      let email = this.adminUsersEditForm.get('email')?.value;
      let phone = this.adminUsersEditForm.get('phone')?.value;

      const userData = {
        name: name!,
        surname: surname!,
        email: email!,
        phone: phone!
      };

      this.clientService.updateClient(this.selectedClientId!, userData).subscribe(
        (response) => {
          console.log('Usuario modificado correctamente:', response);
          this.adminUsersEditForm.reset();
          this.router.navigate(['admin-users']).then(() => {
            window.location.reload();
          });
        },
        (error) => {
          console.error('Error al modificar al usuario:', error);
          this.adminUsersError = 'Error al modificar al usuario. Por favor, inténtalo de nuevo.';
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

  get role() {
    return this.adminUsersForm.controls.role;
  }

  get password() {
    return this.adminUsersForm.controls.password;
  }
}
