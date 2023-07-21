import { ActivatedRoute, Router } from '@angular/router';
import { OrdersService } from './orders.service';
import { Component, OnInit } from '@angular/core';
import { Order } from '../shared/models/order';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-order-detailed',
  templateUrl: './order-detailed.component.html',
  styleUrls: ['./order-detailed.component.scss'],
})
export class OrderDetailedComponent implements OnInit {
  orderId?: number;
  order?: Order;

  constructor(
    private ordersService: OrdersService,
    private activatedRoute: ActivatedRoute,
    private bcService: BreadcrumbService
  ) {}

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    id &&
      this.ordersService.getOrdersByIdForUser(+id).subscribe({
        next: (order) => {
          this.order = order;
          this.bcService.set(
            '@OrderDetailed',
            `Order# ${order.id} - ${order.status}`
          );
        },
      });
  }
}
