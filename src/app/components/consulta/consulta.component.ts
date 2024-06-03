import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryaccommodationunitService } from '../../services/categoryaccommodationunit/categoryaccommodationunit.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from '../../services/auth/login.service';
import { UserService } from '../../services/user/user.service';
import { User } from '../../services/auth/user';
import { JwtDecoderService } from '../../services/jwt-decoder/jwt-decoder.service';
import { ImageService } from '../../services/image/image.service';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.css'],
})
export class ConsultaComponent implements OnInit {
  userLoginOn: boolean = false;
  user?: User;
  decodedToken: any;
  isAdmin: boolean = false;
  page: number = 1;
  showRows: boolean = false;
  data: any;
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
  services: boolean[] = [false, false, false, false];
  categories: boolean[] = [false, false, false, false];
  maxPrice: number = 300;
  selectedAccoUnitId: number | null = null;
  selectedAccoUnitToPay: number | null = null;
  images: any[] = [];

  minDate: string = '';
  minEndDate: string = '';

  private jwtDecoderService = inject(JwtDecoderService);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private categoryAccommodationUnitService: CategoryaccommodationunitService,
    private loginService: LoginService,
    private userService: UserService,
    private imageService: ImageService
  ) {}

  ngOnInit(): void {
    this.loginService.currentUserLoginOn.subscribe({
      next: (userLoginOn) => {
        this.userLoginOn = userLoginOn;
      },
    });
    if (this.userLoginOn) {
      this.userService.getUser().subscribe({
        next: (userData) => {
          this.user = userData;
          if (this.user && this.user.token) {
            this.decodedToken = this.jwtDecoderService.decodeToken(
              this.user.token
            );
          }
          if (this.decodedToken.role === 'ADMIN') {
            this.isAdmin = true;
          }
        },
      });
    }

    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    this.minDate = `${year}-${month}-${day}`;
    this.updateMinEndDate(this.minDate);

    this.route.queryParams.subscribe((params) => {
      this.location = params['location'];
      this.start = params['start'];
      this.bookStart = params['start'];
      this.end = params['end'];
      this.bookEnd = params['end'];
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
    });

    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 3000);

    this.searchSamePageAccommodation();
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

  searchSamePageAccommodation(): void {
    if (this.start && this.end) {
      const startDate = new Date(this.start);
      const endDate = new Date(this.end);

      if (startDate.getTime() >= endDate.getTime()) {
        startDate.setDate(endDate.getDate() - 1);
        this.start = startDate.toISOString().split('T')[0] as any;
      }
    }

    this.bookStart = this.start;
    this.bookEnd = this.end;
    this.showRows = false;

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
      categories: this.categories,
      services: this.services,
      maxPrice: this.maxPrice,
    };

    queryParams['categories'] = [
      queryParams['houses'],
      queryParams['hotels'],
      queryParams['hostels'],
      queryParams['bungalows'],
    ];

    queryParams['services'] = [
      queryParams['piscina'],
      queryParams['mascotas'],
      queryParams['wifi'],
      queryParams['parking'],
    ];

    if (queryParams['location'] == null || queryParams['location'] == '') {
      queryParams['location'] = 'null';
    }
    
    this.categoryAccommodationUnitService
      .getAccommodationUnitByAll(
        queryParams['location'],
        queryParams['maxPrice'],
        queryParams['services'],
        queryParams['categories'],
        queryParams['start'],
        queryParams['end'],
        queryParams['people']
      )
      .subscribe((response) => {
        this.data = response;
        if (Array.isArray(this.data) && this.data.length > 0) {
          this.showRows = true;
          for (let i = 0; i < this.data.length; i++) {
            this.imageService.getImagesByAccommodationId(this.data[i].accommodation.id).subscribe(
              (response) => {
                if (!this.images[i]) {
                  this.images[i] = [];
                }
                this.images[i].push(response);
              });
          }
        }

      });
  }

  searchDetails(id: number): void {
    const queryParams = {
      location: this.location,
      start: this.start,
      bookStart: this.bookStart,
      end: this.end,
      bookEnd: this.bookEnd,
      people: this.people,
      houses: this.houses,
      hotels: this.hotels,
      hostels: this.hostels,
      bungalows: this.bungalows,
      piscina: this.piscina,
      mascotas: this.mascotas,
      wifi: this.wifi,
      parking: this.parking,
      maxPrice: this.maxPrice,
      id: id,
    };

    this.router.navigate(['/details'], { queryParams: queryParams });
  }

  selectAccoUnitId(id: number) {
    this.selectedAccoUnitId = id;
    this.searchDetails(this.selectedAccoUnitId);
  }

  goToPay(id: number): void {
    const queryParams = {
      bookStart: this.bookStart,
      bookEnd: this.bookEnd,
      id: id,
    };

    this.router.navigate(['/pay'], { queryParams: queryParams });
  }

  selectAccoUnitToPay(id: number) {
    this.selectedAccoUnitToPay = id;
    this.goToPay(this.selectedAccoUnitToPay);
  }
}
