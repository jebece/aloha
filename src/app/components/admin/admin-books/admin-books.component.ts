import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService } from '../../../services/booking/booking.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-admin-books',
  templateUrl: './admin-books.component.html',
  styleUrl: './admin-books.component.css'
})
export class AdminBooksComponent {
  books: any;
  selectedBookId: number | null = null;
  page: number = 1;
  showRows: boolean = false;
  booksFilter: any = { client: { email: '' }};
  order: string = 'client.email';
  reverse: boolean = false;

  adminBooksError: string = '';

  constructor(private router: Router, private spinner: NgxSpinnerService, private bookingService: BookingService) {}

  ngOnInit(): void {
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
          this.adminBooksError = errorData;
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
