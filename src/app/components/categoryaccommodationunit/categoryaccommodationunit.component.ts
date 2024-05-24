import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Categoryaccommodationunit } from '../../models/categoryaccommodationunit';
import { CategoryaccommodationunitService } from '../../services/categoryaccommodationunit/categoryaccommodationunit.service';

@Component({
  selector: 'app-categoryaccommodationunit',
  templateUrl: './categoryaccommodationunit.component.html',
  styleUrl: './categoryaccommodationunit.component.css',
})
export class CategoryaccommodationunitComponent {
  categoryaccommodationunit$?: Observable<Categoryaccommodationunit[]>;

  constructor(
    private categoryAccommodationUnitService: CategoryaccommodationunitService
  ) {}
}
