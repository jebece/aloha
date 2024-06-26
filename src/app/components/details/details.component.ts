import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AccoUnitService } from '../../services/acco-unit/acco-unit.service';
import { User } from '../../services/auth/user';
import { LoginService } from '../../services/auth/login.service';
import { UserService } from '../../services/user/user.service';
import { JwtDecoderService } from '../../services/jwt-decoder/jwt-decoder.service';
import { AccoUnitServiceService } from '../../services/acco-unit-service/acco-unit-service.service';
import { ImageService } from '../../services/image/image.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  userLoginOn: boolean = false;
  user?: User;
  decodedToken: any;
  isAdmin: boolean = false;
  accoUnit: any = [];
  services: any = [];
  location: string = '';
  start?: Date;
  bookStart?: Date;
  end?: Date;
  bookEnd?: Date;
  people: number = 2;
  houses: boolean = false;
  hotels: boolean = false;
  hostels: boolean = false;
  bungalows: boolean = false;
  piscina: boolean = false;
  mascotas: boolean = false;
  wifi: boolean = false;
  parking: boolean = false;
  maxPrice: number = 300;
  id: number = 0;
  images: any = [];
  selectedImageUrl: string = '';

  minDate: string = '';
  minEndDate: string = '';

  description: string[] | undefined;
  paragraph: any;

  private jwtDecoderService = inject(JwtDecoderService);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private accoUnitService: AccoUnitService,
    private accoUnitServiceService: AccoUnitServiceService,
    private loginService: LoginService,
    private userService: UserService,
    private imageService: ImageService
  ) { }

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
          this.isAdmin = true;
        }
      }
    });
  }

    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    this.minDate = `${year}-${month}-${day}`;
    this.updateMinEndDate(this.minDate);

    this.route.queryParams.subscribe(params => {
      this.location = params['location'];
      this.start = params['start'];
      this.bookStart = params['bookStart'];
      this.end = params['end'];
      this.bookEnd = params['bookEnd'];
      this.people = +params['people'];
      this.houses = params['houses'] === 'true';
      this.hotels = params['hotels'] === 'true';
      this.hostels = params['hostels'] === 'true';
      this.bungalows = params['bungalows'] === 'true';
      this.piscina = params['piscina'] === 'true';
      this.mascotas = params['mascotas'] === 'true';
      this.wifi = params['wifi'] === 'true';
      this.parking = params['parking'] === 'true';
      this.maxPrice = +params['maxPrice'] || 300;
      this.id = +params['id'];
    });

    this.accoUnitService.getAccoUnitById(this.id).subscribe(
      (data) => {
        this.accoUnit = data;
        this.description = this.accoUnit.accommodation.description.split('. ').map((sentence: string) => sentence.trim()).filter((sentence: any) => sentence);
        console.log('Unidad de alojamiento obtenida');
        this.imageService.getImagesByAccommodationId(this.accoUnit.accommodation.id).subscribe(
          (data) => {
            this.images = data;
            console.log('Imágenes obtenidas correctamente');
          },
          (error) => {
            console.error('Error al obtener las imágenes', error);
          }
        );
      },
      (error) => {
        console.error('Error al obtener la unidad de alojamiento', error);
      }
    );

    this.accoUnitServiceService.getAccoUnitServicesByAccoUnitId(this.id).subscribe(
      (data) => {
        this.services = data;
        console.log('Servicios obtenidos correctamente');
      },
      (error) => {
        console.error('Error al obtener los servicios de la unidad de alojamiento', error);
      }
    );

    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 3000);
  }

  updateMinEndDate(startDate: string): void {
    if (startDate) {
      const selectedDate = new Date(startDate);
      selectedDate.setDate(selectedDate.getDate() + 1);

      const year = selectedDate.getFullYear();
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
      const day = selectedDate.getDate().toString().padStart(2, '0');
      this.minEndDate = `${year}-${month}-${day}`;
    }
  }

  searchAccommodation(): void {
    if (this.start && this.end) {
      const startDate = new Date(this.start);
      const endDate = new Date(this.end);

      if (startDate.getTime() >= endDate.getTime()) {
        startDate.setDate(endDate.getDate() - 1);
        this.start = startDate;
      }
    }

    const startDate = this.start ? new Date(this.start) : new Date(this.minDate);
    const endDate = this.end ? new Date(this.end) : new Date(this.minEndDate);

    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];

    const queryParams = {
      location: this.location,
      start: formattedStartDate,
      end: formattedEndDate,
      people: this.people,
      houses: this.houses,
      hotels: this.hotels,
      hostels: this.hostels,
      bungalows: this.bungalows,
      piscina: this.piscina,
      mascotas: this.mascotas,
      wifi: this.wifi,
      parking: this.parking,
      maxPrice: this.maxPrice
    };

    this.router.navigate(['/consulta'], { queryParams: queryParams });
  }

  goToPay() {
    const queryParams = {
      bookStart: this.bookStart,
      bookEnd: this.bookEnd,
      id: this.id
    };

    this.router.navigate(['/pay'], { queryParams: queryParams });
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

  selectImageUrl(url: string) {
    this.selectedImageUrl = url;
  }
}
