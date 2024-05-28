import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-top-button',
  templateUrl: './top-button.component.html',
  styleUrl: './top-button.component.css',
})
export class TopButtonComponent {
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showScrollButton = (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0) > this.showScrollHeight;
  }

  showScrollButton: boolean = false;
  showScrollHeight: number = 400; 

  constructor() { }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}