import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { User } from '../../services/auth/user';
import { JwtDecoderService } from '../../services/jwt-decoder/jwt-decoder.service';
import { UserService } from '../../services/user/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from '../../services/auth/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AccoUnitService } from '../../services/acco-unit/acco-unit.service';
import { BookingService } from '../../services/booking/booking.service';
import { ToastrService } from 'ngx-toastr';
import { CardService } from '../../services/card/card.service';
import { ClientCardService } from '../../services/client-card/client-card.service';


@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrl: './pay.component.css'
})
export class PayComponent implements OnInit {
  payError: string = '';
  payForm = this.formBuilder.group({
    owner: ['', Validators.required],
    cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
    cardExpiration: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\/[0-9]{2}$')]],
    cvc: ['', [Validators.required, Validators.pattern('^[0-9]{3}$')]],
  })

  userLoginOn: boolean = false;
  user?: User;
  decodedToken: any;
  unautorized: boolean = true;
  errorMessage: string = '';
  clientId?: number;
  existCard: any = true;
  cardId: any;
  clientCards: any;
  show: boolean = false;
  selectedCardId: number | null = null;

  private jwtDecoderService = inject(JwtDecoderService);

  accoUnit?: any;
  bookStart?: Date;
  bookEnd?: Date;
  bookPeople?: number;
  id: number = 0;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private spinner: NgxSpinnerService, private loginService: LoginService, private router: Router, private route: ActivatedRoute, private accoUnitService: AccoUnitService, private bookingService: BookingService, private toastr: ToastrService, private cardService: CardService, private clientCardService: ClientCardService) {
    this.userLoginOn = false;
  }

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
        if (this.decodedToken.role === 'CLIENT') {
          this.unautorized = false;
        }
      }
    });
    }
    if (this.unautorized) {
      this.router.navigate(['login']);
      this.toastr.error('Debes iniciar sesión como cliente', 'Acceso restringido', { timeOut: 2000, toastClass: 'ngx-toastr custom-toast', positionClass: 'toast-bottom-right' });
    } else {
      this.userService.getUser().subscribe({
        next: (userData) => {
          this.user = userData;
          if (this.user && this.user.token) {
            this.decodedToken = this.jwtDecoderService.decodeToken(this.user.token);
          }
          if (this.decodedToken.id) {
            this.clientId = this.decodedToken.id;
            this.cardService.getCardsByClientId(this.clientId).subscribe(
              (data) => {
                this.clientCards = data;
                if (Array.isArray(this.clientCards) && this.clientCards.length > 0) {
                  this.show = true;
                }
              },
              (error) => {
                console.error('Error al obtener las tarjetas del cliente', error);
              }
            );
          }
        },
        error: (errorData) => {
          this.errorMessage = errorData;
        },
        complete: () => {
          this.spinner.show();
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        }
      });
    }
    this.route.queryParams.subscribe(params => {
      this.bookStart = params['bookStart'];
      this.bookEnd = params['bookEnd'];
      this.bookPeople = +params['bookPeople'];
      this.id = +params['id'];
    });

    this.accoUnitService.getAccoUnitById(this.id).subscribe(
      (data) => {
        this.accoUnit = data;
      },
      (error) => {
        console.error('Error al obtener la unidad de alojamiento', error);
      }
    );
  }

  get owner() {
    return this.payForm.controls.owner;
  }

  get cardNumber() {
    return this.payForm.controls.cardNumber;
  }

  get cardExpiration() {
    return this.payForm.controls.cardExpiration;
  }

  get cvc() {
    return this.payForm.controls.cvc;
  }

  diferenciaEnDias(): number {
    const fechaInicio = this.bookStart ? new Date(this.bookStart) : null;
    const fechaFin = this.bookEnd ? new Date(this.bookEnd) : null;

    if (fechaInicio && !isNaN(fechaInicio.getTime())) {
      fechaInicio.setHours(0, 0, 0, 0);
    }
    if (fechaFin && !isNaN(fechaFin.getTime())) {
      fechaFin.setHours(0, 0, 0, 0);
    }

    const unDia = 1000 * 60 * 60 * 24; // Milisegundos en un día
    const diferenciaEnMs = fechaFin && fechaInicio ? Math.abs(fechaFin.getTime() - fechaInicio.getTime()) : 0;

    return Math.round(diferenciaEnMs / unDia);
  }

  createBooking() {
    if (this.payForm.valid) {
      const bookingData = {
        checkIn: this.bookStart,
        checkOut: this.bookEnd,
        accommodationUnit: {
          id: this.accoUnit.id,
          accommodation: {
            id: this.accoUnit.accommodation.id
          },
          category: {
            id: this.accoUnit.category.id
          }
        },
        client: {
          id: this.clientId
        },
      }
      this.bookingService.createBooking(bookingData).subscribe(
        (data) => {
          const cardData = {
            number: this.cardNumber.value,
            expirationDate: this.cardExpiration.value,
            cvv: this.cvc.value,
            owner: this.owner.value
          }
          this.cardService.existCard(cardData).subscribe(
            exist => {
              this.existCard = (exist as { exists: boolean }).exists;
              if (!this.existCard) {
                this.cardService.createCard(cardData).subscribe(
                  (data) => {
                    this.cardId = data;
                    const clientCardData = {
                      client: {
                        id: this.clientId
                      },
                      card: {
                        id: this.cardId
                      }
                    }
                    this.clientCardService.createClientCard(clientCardData).subscribe(
                      (data) => {
                        this.toastr.success('', 'Reserva formalizada con éxito', { timeOut: 1500, toastClass: 'ngx-toastr custom-toast', positionClass: 'toast-bottom-right' });
                        this.router.navigate(['client']);
                      },
                      (error) => {
                        console.log('Error al crear la tarjeta-cliente');
                      }
                    );
                  },
                  (error) => {
                    console.log('Error al crear la tarjeta');
                  }
                );
              }else{
                this.toastr.success('', 'Reserva formalizada con éxito', { timeOut: 1500, toastClass: 'ngx-toastr custom-toast', positionClass: 'toast-bottom-right' });
                this.router.navigate(['client']);
              }
            },
            error =>  {
              console.log('Error al comprobar la tarjeta', error);
            }
          );
        },
        (error) => {
          this.payError = 'Error al realizar la reserva. Inténtelo de nuevo';
          this.toastr.error('', 'Error al realizar la reserva', { timeOut: 1500, toastClass: 'ngx-toastr custom-toast', positionClass: 'toast-bottom-right' });
        }
      );
    }
  }

  updateFormFields(card: any) {
    this.payForm.patchValue({
      owner: card.owner,
      cardNumber: card.number,
      cardExpiration: card.expirationDate,
      cvc: card.cvv
    });
  }

  selectCardId(id: number) {
    this.selectedCardId = id;
    this.deleteCard();
  }

  deleteCard() {
    if (this.selectedCardId !== null) {
      const deleteData: any = {
        id: this.selectedCardId
      };

      this.cardService.deleteCard(deleteData).subscribe({
        next: (userData) => {
          this.cardService.getCardsByClientId(this.clientId).subscribe(
            (data) => {
              this.clientCards = data;
              this.show = Array.isArray(this.clientCards) && this.clientCards.length > 0;
            },
            (error) => {
              console.error('Error al obtener las tarjetas del cliente', error);
            }
          );
        },
        error: (errorData) => {
          console.log(errorData);
          this.payError = "Error al eliminar la tarjeta. Inténtalo de nuevo.";
        }
      });
    } else {
      console.error('Tarjeta no seleccionada');
    }
  }
}
