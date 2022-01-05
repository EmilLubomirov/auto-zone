import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuardService as RoleGuard } from './app/auth/role-guard.service';
import { AuthGuardService as AuthGuard } from './app/auth/auth-guard.service';
import { GuestGuardService as GuestGuard } from './app/auth/guest-guard.service';
import { DefaultComponent } from './app/layouts/default/default.component';
import { AddProductComponent } from './app/pages/components/add-product/add-product.component';
import { CartComponent } from './app/pages/components/cart/cart.component';
import { ProductDetailsComponent } from './app/pages/components/product-details/product-details.component';
import { SignInComponent } from './app/pages/components/sign-in/sign-in.component';
import { SignUpComponent } from './app/pages/components/sign-up/sign-up.component';
import { StoreComponent } from './app/pages/components/store/store.component';
import { OrderComponent } from './app/pages/components/order/order.component';
import { ServicesComponent } from './app/pages/components/services/services.component';
import { AboutComponent } from './app/pages/components/about/about.component';
import { ContactsComponent } from './app/pages/components/contacts/contacts.component';

const routes: Routes = [{
  path: '', component: DefaultComponent,
  children: [{ path: 'store', component: StoreComponent }, 
             { path: 'sign-up', component: SignUpComponent, canActivate: [GuestGuard] },
             { path: 'sign-in', component: SignInComponent, canActivate: [GuestGuard] },
             { path: 'about', component: AboutComponent },
             { path: 'contacts', component: ContactsComponent },
             { path: 'product/:id', component: ProductDetailsComponent },
             { path: 'add-product', component: AddProductComponent, 
                canActivate: [RoleGuard], data: {  isAdmin: true } },
            { path: 'cart/:userId', component: CartComponent, canActivate: [AuthGuard] },
            { path: 'order/:userId', component: OrderComponent, canActivate: [AuthGuard] },
            { path: 'services', component: ServicesComponent, canActivate: [AuthGuard] }]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
