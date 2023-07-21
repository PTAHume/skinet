import { NgModule } from '@angular/core';
import { OrderDetailedComponent } from './order-detailed.component';
import { RouterModule, Routes } from '@angular/router';
import { OrdersComponent } from './orders.component';

const routes: Routes = [
  { path: '', component: OrdersComponent },
  {
    path: ':id',
    component: OrderDetailedComponent, data: {
      breadcrumb: { alias: 'OrderDetailed' }
    }
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderRoutingModule {}
