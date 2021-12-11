import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from './app/layouts/default/default.component';
import { StoreComponent } from './app/pages/components/store/store.component';


const routes: Routes = [{
  path: '', component: DefaultComponent,
  children: [{ path: 'store', component: StoreComponent }]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
