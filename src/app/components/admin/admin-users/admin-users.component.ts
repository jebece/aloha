import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ClientService } from '../../../services/client/client.service';
import { UserService } from '../../../services/user/user.service';
import { FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from '../../../services/auth/user';
import { LoginService } from '../../../services/auth/login.service';
import { JwtDecoderService } from '../../../services/jwt-decoder/jwt-decoder.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css'
})
export class AdminUsersComponent implements OnInit{
  userLoginOn: boolean = false;
  user?: User;
  decodedToken: any;
  unautorized: boolean = true;
  users: any = [];
  clients: any = [];
  admins: any = [];
  selectedClientId: number | null = null;
  page: number = 1;
  showRows: boolean = false;
  clientsFilter: any = { name: '' };
  order: string = 'name';
  reverse: boolean = false;

  adminUsersError: string = '';
  adminUsersForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    surname: ['', [Validators.required, Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
    password: ['', Validators.required]
  });

  adminUsersAdminForm = this.formBuilder.group({
    adminName: ['', [Validators.required, Validators.maxLength(50)]],
    adminSurname: ['', [Validators.required, Validators.maxLength(50)]],
    adminEmail: ['', [Validators.required, Validators.email]],
    adminPhone: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
    adminPassword: ['', Validators.required]
  });

  private jwtDecoderService = inject(JwtDecoderService);

  constructor(private loginService: LoginService, private formBuilder: FormBuilder, private clientService: ClientService, private router: Router, private spinner: NgxSpinnerService, private userService: UserService, private toastr: ToastrService) {}

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
    this.clientService.getClients().subscribe(
      (data) => {
        this.users = data;
        if (Array.isArray(this.users) && this.users.length > 0) {
          this.clients = this.users.filter((user: any) => user.role === 'CLIENT');
          this.admins = this.users.filter((user: any) => user.role === 'ADMIN');
        }
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
  }


  setOrder(columnName: string) {
    if(this.order === columnName) {
      this.reverse = !this.reverse;
    }else {
      this.reverse = false;
    }
    this.order = columnName;
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
          this.adminUsersError = 'Ya existe un cliente con el email especificado';
        }
      );
    }
  }
  
  deleteClient() {
    if (this.selectedClientId !== null) {

      this.clientService.deleteClient(this.selectedClientId).subscribe({
        next: (userData) => {
          console.log(userData);
        },
        error: (errorData) => {
          console.log(errorData);
          this.adminUsersError = "Error al eliminar el cliente. Inténtalo de nuevo.";
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

  createAdmin() {
    if (this.adminUsersAdminForm.valid) {
      let adminName = this.adminUsersAdminForm.get('adminName')?.value;
      let adminSurname = this.adminUsersAdminForm.get('adminSurname')?.value;
      let adminEmail = this.adminUsersAdminForm.get('adminEmail')?.value;
      let adminPhone = this.adminUsersAdminForm.get('adminPhone')?.value;
      let adminRole = 'ADMIN';
      let adminPassword = this.adminUsersAdminForm.get('adminPassword')?.value;

      const adminData = {
        name: adminName!,
        surname: adminSurname!,
        email: adminEmail!,
        phone: adminPhone!,
        role: adminRole!,
        password: adminPassword!
      };
  
      this.clientService.createClient(adminData).subscribe(
        (response) => {
          console.log('Administrador añadido correctamente:', response);
          this.adminUsersAdminForm.reset();
          this.router.navigate(['admin-users']).then(() => {
            window.location.reload();
          });
        },
        (error) => {
          console.error('Error al añadir administrador:', error);
          this.adminUsersError = 'Ya existe un administrador con el email especificado';
        }
      );
    }
  }

  deleteAdmin() {
    if (this.selectedClientId !== null) {
      const id = this.selectedClientId;

      this.clientService.deleteClient(id).subscribe({
        next: (userData) => {
          console.log(userData);
        },
        error: (errorData) => {
          console.log(errorData);
          this.adminUsersError = "Error al eliminar el administrador. Inténtalo de nuevo.";
        },
        complete: () => {
          console.info('Borrado completo');
          this.router.navigate(['admin-users']).then(() => {
            window.location.reload();
          });
        }
      });
    } else {
      console.error('Administrador no seleccionado');
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

  get password() {
    return this.adminUsersForm.controls.password;
  }

  get adminName() {
    return this.adminUsersAdminForm.controls.adminName;
  }

  get adminSurname() {
    return this.adminUsersAdminForm.controls.adminSurname;
  }

  get adminPhone() {
    return this.adminUsersAdminForm.controls.adminPhone;
  }

  get adminEmail() {
    return this.adminUsersAdminForm.controls.adminEmail;
  }

  get adminPassword() {
    return this.adminUsersAdminForm.controls.adminPassword;
  }
   
}
