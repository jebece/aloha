import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { ClientComponent } from './components/client/client.component';
import { ConsultaComponent } from './components/consulta/consulta.component';
import { DetailsComponent } from './components/details/details.component';
import { PayComponent } from './components/pay/pay.component';
import { RegistroComponent } from './components/registro/registro.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AdminUsersComponent } from './components/admin/admin-users/admin-users.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { AdminAccommodationsComponent } from './components/admin/admin-accommodations/admin-accommodations.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';

const appRoutes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin-users', component: AdminUsersComponent },
  { path: 'admin-accommodations', component: AdminAccommodationsComponent },
  { path: 'client', component: ClientComponent },
  { path: 'consulta', component: ConsultaComponent },
  { path: 'details', component: DetailsComponent },
  { path: 'pay', component: PayComponent },
  { path: 'registro', component: RegistroComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    LoginComponent,
    AdminUsersComponent,
    ClientComponent,
    ConsultaComponent,
    DetailsComponent,
    PayComponent,
    RegistroComponent,
    HeaderComponent,
    FooterComponent,
    AdminUsersComponent,
    AdminAccommodationsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    NgxSpinnerModule
  ],
  providers: [
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
