import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate  } from '@angular/router';
import { DefaultComponent } from './app/layouts/default/default.component';
import { ProductDetailsComponent } from './app/pages/components/product-details/product-details.component';
import { SignInComponent } from './app/pages/components/sign-in/sign-in.component';
import { SignUpComponent } from './app/pages/components/sign-up/sign-up.component';
import { StoreComponent } from './app/pages/components/store/store.component';

const routes: Routes = [{
  path: '', component: DefaultComponent,
  children: [{ path: 'store', component: StoreComponent }, 
             { path: 'sign-up', component: SignUpComponent },
             { path: 'sign-in', component: SignInComponent },
             { path: 'product/:id', component: ProductDetailsComponent }]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
