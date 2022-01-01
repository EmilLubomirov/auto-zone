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
import { AddProductComponent } from './pages/components/add-product/add-product.component';
import { ImageUploaderComponent } from './shared/components/image-uploader/image-uploader.component';
import { FileUploadModule } from 'ng2-file-upload';
import { NgxCloudinaryWidgetModule } from 'ngx-cloudinary-upload-widget';
import { environment } from '../environments/environment';
import { CartComponent } from './pages/components/cart/cart.component';
import { CartProductComponent } from './shared/components/cart-product/cart-product.component';
import { OrderComponent } from './pages/components/order/order.component';
import { ServicesComponent } from './pages/components/services/services.component';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DefaultComponent,
    FooterComponent,
    StoreComponent,
    SignUpComponent,
    SignInComponent,
    ProductDetailsComponent,
    AddProductComponent,
    ImageUploaderComponent,
    CartComponent,
    CartProductComponent,
    OrderComponent,
    ServicesComponent
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
    RouterModule,
    FileUploadModule,

    NgxCloudinaryWidgetModule.forRoot(
        {
            cloudName: environment.ANGULAR_APP_CLOUD_NAME
        }
    )
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
