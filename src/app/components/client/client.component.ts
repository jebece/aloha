import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user/user.service';
import { User } from '../../services/auth/user';
import { JwtDecoderService } from '../../services/jwt-decoder/jwt-decoder.service';
import { updateRequest } from '../../services/client/updateRequest';
import { ClientService } from '../../services/client/client.service';
import { Router } from '@angular/router';
import { deleteRequest } from '../../services/client/deleteRequest';
import { LoginService } from '../../services/auth/login.service';
import { LoginRequest } from '../../services/auth/loginRequest';
import { switchMap } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { BookingService } from '../../services/booking/booking.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  clientError: string = '';
  clientForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    surname: ['', [Validators.required, Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]]
  });
  confirmError: string = '';
  confirmForm = this.formBuilder.group({
    password: ['', Validators.required]
  });

  user?: User;
  errorMessage: string = '';
  decodedToken: any;
  clientId?: number;
  clientPassword?: string;
  books: any ;
  selectedBookId: number | null = null;
  page: number = 1;
  showRows: boolean = false;
  booksFilter: any = { accommodationUnit: { accommodation: { name: '' } }};
  order: string = 'accommodationUnit.accommodation.name';
  reverse: boolean = false;

  private jwtDecoderService = inject(JwtDecoderService);

  constructor(private formBuilder: FormBuilder, private userService: UserService, private clientService: ClientService, private router:Router, private loginService:LoginService, private spinner: NgxSpinnerService, private bookingService: BookingService) {}

  ngOnInit(): void {
    this.userService.getUser().subscribe({
      next: (userData) => {
        this.user = userData;
        if (this.user && this.user.token) {
          this.decodedToken = this.jwtDecoderService.decodeToken(this.user.token);
        }
        if (this.decodedToken.name) {
          this.clientForm.get('name')?.setValue(this.decodedToken.name);
        }
        if (this.decodedToken.surname) {
          this.clientForm.get('surname')?.setValue(this.decodedToken.surname);
        }
        if (this.decodedToken.email) {
          this.clientForm.get('email')?.setValue(this.decodedToken.email);
        }
        if (this.decodedToken.phone) {
          this.clientForm.get('phone')?.setValue(this.decodedToken.phone);
        }
        if (this.decodedToken.id) {
          this.clientId = this.decodedToken.id;
        }
        if (this.decodedToken.id) {
          this.clientId = this.decodedToken.id;
          this.getBookings();
        }
      },
      error: (errorData) => {
        this.errorMessage = errorData;
      },
      complete: () => {
        console.info('Petición completada');
      }
    });
  
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 500);
  }
  
  setOrder(columnName: string) {
    if(this.order === columnName) {
      this.reverse = !this.reverse;
    }else {
      this.reverse = false;
    }
    this.order = columnName;
  }

  formSubmit() {
    if (this.clientId !== undefined) {
      if (this.confirmForm.valid) {
        const loginData: LoginRequest = {
          email: this.decodedToken.email ?? '',
          password: this.confirmForm.get('password')?.value ?? ''
        };
  
        this.loginService.login(loginData).pipe(
          switchMap(() => {
            const updateData: updateRequest = {
              name: this.clientForm.get('name')?.value ?? '',
              surname: this.clientForm.get('surname')?.value ?? '',
              email: this.clientForm.get('email')?.value ?? '',
              phone: this.clientForm.get('phone')?.value ?? '',
              password: this.confirmForm.get('password')?.value ?? ''
            };
            return this.clientService.updateClient(this.clientId!, updateData);
          }),
          switchMap(() => {
            const updateLoginData: LoginRequest = {
              email: this.clientForm.get('email')?.value ?? '',
              password: this.confirmForm.get('password')?.value ?? ''
            };
            return this.loginService.login(updateLoginData);
          })
        ).subscribe({
          next: (userData) => {
            console.log('Token updated successfully:', userData);
          },
          error: (errorData) => {
            console.log(errorData);
            this.clientError = errorData;
          },
          complete: () => {
            console.info('Registro completo');
            this.clientForm.reset();
            this.router.navigate(['client']).then(() => {
              window.location.reload();
            });
          }
        });
      } else {
        console.error('El formulario de confirmación no es válido');
      }
    } else {
      console.error('clientId es undefined');
    }
  }

  deleteClient() {
    if (this.clientId !== undefined) {
      const deleteData: deleteRequest = {
        id: this.clientId
      };

      this.clientService.deleteClient(deleteData).subscribe({
        next: (userData) => {
          console.log(userData);
        },
        error: (errorData) => {
          console.log(errorData);
          this.clientError = errorData;
        },
        complete: () => {
          console.info('Borrado completo');
          this.logout();
          this.router.navigate(['']);
          this.clientForm.reset();
        }
      });
    } else {
      console.error('clientId es undefined');
    }
  }

  getBookings() {
    if (this.clientId !== undefined) {
      this.bookingService.getBookingByClientId(this.clientId).subscribe({
        next: (bookingData) => {
          this.books = bookingData;
          console.log(this.books);
          if (Array.isArray(this.books) && this.books.length > 0) {
            this.showRows = true;
          } else {
            this.showRows = false;
          }
        },
        error: (errorData) => {
          console.error(errorData);
        }
      });
    } else {
      console.error('clientId es undefined');
    }
  }

  diferenciaEnDias(books: any): number {
    const fechaInicio = new Date(books.checkIn);
    const fechaFin = new Date(books.checkOut);

    fechaInicio.setHours(0, 0, 0, 0);
    fechaFin.setHours(0, 0, 0, 0);

    const unDia = 1000 * 60 * 60 * 24;
    const diferenciaEnMs = Math.abs(fechaFin.getTime() - fechaInicio.getTime());

    return Math.round(diferenciaEnMs / unDia);
  }

  selectBookId(id: number) {
    this.selectedBookId = id;
  }

  deleteBook() {
    if (this.selectedBookId !== null) {
      const deleteData: any = {
        id: this.selectedBookId
      };

      this.bookingService.deleteBooking(deleteData).subscribe({
        next: (userData) => {
          console.log(userData);
        },
        error: (errorData) => {
          console.log(errorData);
          this.clientError = errorData;
        },
        complete: () => {
          console.info('Borrado completo');
          this.router.navigate(['client']).then(() => {
            window.location.reload();
          });
        }
      });
    } else {
      console.error('Reserva no seleccionada');
    }
  }

  get name() {
    return this.clientForm.controls.name;
  }

  get surname() {
    return this.clientForm.controls.surname;
  }

  get phone() {
    return this.clientForm.controls.phone;
  }

  get email() {
    return this.clientForm.controls.email;
  }

  get password() {
    return this.confirmForm.controls.password;
  }

  logout(): void {
    this.loginService.logout();
  }

  
}
