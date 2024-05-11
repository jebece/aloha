import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.css']
})
export class ConsultaComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  location: string = '';
  start: Date = new Date();
  end: Date = new Date();
  people: number = 0;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.location = params['location'];
      this.start = new Date(params['start']);
      this.end = new Date(params['end']);
      this.people = +params['people'];
    });
  }
}
