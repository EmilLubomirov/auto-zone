import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate  } from '@angular/router';
import { RoleGuardService as RoleGuard } from './app/auth/role-guard.service';
import { DefaultComponent } from './app/layouts/default/default.component';
import { AddProductComponent } from './app/pages/components/add-product/add-product.component';
import { ProductDetailsComponent } from './app/pages/components/product-details/product-details.component';
import { SignInComponent } from './app/pages/components/sign-in/sign-in.component';
import { SignUpComponent } from './app/pages/components/sign-up/sign-up.component';
import { StoreComponent } from './app/pages/components/store/store.component';

const routes: Routes = [{
  path: '', component: DefaultComponent,
  children: [{ path: 'store', component: StoreComponent }, 
             { path: 'sign-up', component: SignUpComponent },
             { path: 'sign-in', component: SignInComponent },
             { path: 'product/:id', component: ProductDetailsComponent },
             { path: 'add-product', component: AddProductComponent, 
                canActivate: [RoleGuard], data: {  isAdmin: true } }]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
