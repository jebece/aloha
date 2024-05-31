import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService } from '../../../services/booking/booking.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from '../../../services/auth/login.service';
import { User } from '../../../services/auth/user';
import { UserService } from '../../../services/user/user.service';
import { JwtDecoderService } from '../../../services/jwt-decoder/jwt-decoder.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-books',
  templateUrl: './admin-books.component.html',
  styleUrl: './admin-books.component.css'
})
export class AdminBooksComponent implements OnInit{
  userLoginOn: boolean = false;
  user?: User;
  decodedToken: any;
  unautorized: boolean = true;
  books: any;
  selectedBookId: number | null = null;
  page: number = 1;
  showRows: boolean = false;
  booksFilter: any = { client: { email: '' }};
  order: string = 'client.email';
  reverse: boolean = false;

  adminBooksError: string = '';

  private jwtDecoderService = inject(JwtDecoderService);
  
  constructor(private loginService: LoginService, private userService: UserService, private router: Router, private spinner: NgxSpinnerService, private bookingService: BookingService, private toastr: ToastrService) {}

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
    this.bookingService.getBookings().subscribe(
      (data) => {
        this.books = data;
        if (Array.isArray(this.books) && this.books.length > 0) {
          this.showRows = true;
        }
      },
      (error) => {
        console.error('Error al obtener las reservas', error);
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
          this.adminBooksError = "Error al eliminar la reserva. Inténtalo de nuevo.";
        },
        complete: () => {
          console.info('Borrado completo');
          this.router.navigate(['admin-books']).then(() => {
            window.location.reload();
          });
        }
      });
    } else {
      console.error('Alojamiento no seleccionado');
    }
  }

  selectBookId(id: number) {
    this.selectedBookId = id;
  }
}
