import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtHelperService, JWT_OPTIONS  } from '@auth0/angular-jwt';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptorService } from './auth/auth-interceptor.service'; 

import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/components/header/header.component';

import { DefaultComponent } from './layouts/default/default.component';
import { AppRoutingModule } from 'src/app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/material.module';
import { FooterComponent } from './shared/components/footer/footer.component';
import { StoreComponent } from './pages/components/store/store.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SignUpComponent } from './pages/components/sign-up/sign-up.component';
import { SignInComponent } from './pages/components/sign-in/sign-in.component';
import { ProductDetailsComponent } from './pages/components/product-details/product-details.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DefaultComponent,
    FooterComponent,
    StoreComponent,
    SignUpComponent,
    SignInComponent,
    ProductDetailsComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
