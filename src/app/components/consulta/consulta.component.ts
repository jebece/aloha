import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryaccommodationunitService } from '../../services/categoryaccommodationunit/categoryaccommodationunit.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AccommodationunitserviceserviceService } from '../../services/accommodationunitserviceservice/accommodationunitserviceservice.service';
import { LoginService } from '../../services/auth/login.service';
import { UserService } from '../../services/user/user.service';
import { User } from '../../services/auth/user';
import { JwtDecoderService } from '../../services/jwt-decoder/jwt-decoder.service';

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
  bookPeople?: number;
  houses: boolean = false;
  hotels: boolean = false;
  hostels: boolean = false;
  bungalows: boolean = false;
  services: boolean[] = [false, false, false, false];
  categories: boolean[] = [false, false, false, false];
  maxPrice: number = 300;
  selectedAccoUnitId: number | null = null;
  selectedAccoUnitToPay: number | null = null;

  minDate: string = '';
  minEndDate: string = '';

  private jwtDecoderService = inject(JwtDecoderService);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private categoryAccommodationUnitService: CategoryaccommodationunitService,
    private accommodationUnitServiceService: AccommodationunitserviceserviceService,
    private loginService: LoginService,
    private userService: UserService
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
      this.bookPeople = +params['people'];
      this.houses = params['houses'] === 'true';
      this.hotels = params['hotels'] === 'true';
      this.hostels = params['hostels'] === 'true';
      this.bungalows = params['bungalows'] === 'true';
      this.maxPrice = +params['maxPrice'] || 300;
    });

    this.categories = [this.houses, this.hotels, this.hostels, this.bungalows];

    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 3000);

    if (
      this.route.snapshot.queryParams['location'] == null ||
      (this.route.snapshot.queryParams['location'] == '' &&
        this.route.snapshot.queryParams['categories'].every(
          (element: string) => element == 'false'
        ))
    ) {
      this.categoryAccommodationUnitService.getAll().subscribe((response) => {
        this.data = response;
        if (Array.isArray(this.data) && this.data.length > 0) {
          this.showRows = true;
        }
      });
    } else if (
      this.route.snapshot.queryParams['location'] == null ||
      (this.route.snapshot.queryParams['location'] == '' &&
        this.route.snapshot.queryParams['categories'].some(
          (element: string) => element == 'true'
        ))
    ) {
      const array = this.route.snapshot.queryParams['categories'].join(',');
      this.categoryAccommodationUnitService
        .getAccommodationUnitByCategory(array)
        .subscribe((response) => {
          this.data = response;
          if (Array.isArray(this.data) && this.data.length > 0) {
            this.showRows = true;
          }
        });
    } else {
      this.categoryAccommodationUnitService
        .getCategoryAccommodationUnitByLocation(
          this.route.snapshot.queryParams['location']
        )
        .subscribe((response) => {
          this.data = response;
          if (Array.isArray(this.data) && this.data.length > 0) {
            this.showRows = true;
          }
        });
    }
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

    const startDate = this.start
      ? new Date(this.start)
      : new Date(this.minDate);
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
      services: this.services,
      maxPrice: this.maxPrice,
    };

    this.router.navigate(['/consulta'], { queryParams: queryParams });
  }

  searchSamePageAccommodation(): void {
    if (this.start && this.end) {
      const startDate = new Date(this.start);
      const endDate = new Date(this.end);

      if (startDate.getTime() >= endDate.getTime()) {
        startDate.setDate(endDate.getDate() - 1);
        this.start = startDate;
      }
    }

    const startDate = this.start
      ? new Date(this.start)
      : new Date(this.minDate);
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
        }
      });

    // if (
    //   (queryParams['location'] == null || queryParams['location'] == '') &&
    //   queryParams['services'].every((element: boolean) => element == false)
    // ) {
    //   this.categoryAccommodationUnitService.getAll().subscribe((response) => {
    //     this.data = response;
    //   });
    // } else if (
    //   (queryParams['location'] == null || queryParams['location'] == '') &&
    //   queryParams['services'].some((element: boolean) => element == true)
    // ) {
    //   const array = queryParams['services'].join(',');
    //   console.log(array);
    //   this.categoryAccommodationUnitService
    //     .getAccommodationUnitByService(queryParams['services'])
    //     .subscribe((response) => {
    //       this.data = response;
    //     });
    // }
  }

  searchDetails(id: number): void {
    const queryParams = {
      location: this.location,
      start: this.start,
      bookStart: this.bookStart,
      end: this.end,
      bookEnd: this.bookEnd,
      people: this.people,
      bookPeople: this.bookPeople,
      houses: this.houses,
      hotels: this.hotels,
      hostels: this.hostels,
      bungalows: this.bungalows,
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
      bookPeople: this.bookPeople,
      id: id,
    };

    this.router.navigate(['/pay'], { queryParams: queryParams });
  }

  selectAccoUnitToPay(id: number) {
    this.selectedAccoUnitToPay = id;
    this.goToPay(this.selectedAccoUnitToPay);
  }
}
