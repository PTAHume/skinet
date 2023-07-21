import { Component, OnInit } from '@angular/core';
import { OrdersService } from './orders.service';
import { Order } from '../shared/models/order';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  public sortOrder: number = 0;
  public sortDirection = 1;
  public columnIndex = -1;
  columnSort: string[] = ['DESC', 'DESC', 'DESC', 'DESC'];

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.ordersService.getOrdersForUser().subscribe({
      next: (orders) => (this.orders = orders),
    });
  }

  sortColumn(columnName: string, columnIndex: number) {
    if (this.columnIndex !== columnIndex) this.sortDirection = 0;
    this.columnIndex = columnIndex;
    this.sortDirection = this.sortDirection === 1 ? 0 : 1;

    if (columnName === 'id') {
      if (this.columnSort[columnIndex] === 'ASC') {
        this.orders = this.orders.sort((a, b) => a.id - b.id);
      } else {
        this.orders = this.orders.sort((a, b) => b.id - a.id);
      }
    } else if (columnName === 'date') {
      if (this.columnSort[1] === 'ASC') {
        this.orders = this.orders.sort((a, b) =>
          this.compare(a.orderDate, b.orderDate)
        );
      } else {
        this.orders = this.orders.sort((a, b) =>
          this.compare(b.orderDate, a.orderDate)
        );
      }
    } else if (columnName === 'total') {
      if (this.columnSort[2] === 'ASC') {
        this.orders = this.orders.sort((a, b) => a.total - b.total);
      } else {
        this.orders = this.orders.sort((a, b) => b.total - a.total);
      }
    } else if (columnName === 'status') {
      if (this.columnSort[3] === 'ASC') {
        this.orders = this.orders.sort((a, b) =>
          this.compare(a.status, b.status)
        );
      } else {
        this.orders = this.orders.sort((a, b) =>
          this.compare(b.status, a.status)
        );
      }
    }
    this.columnSort[columnIndex] =
      this.columnSort[columnIndex] === 'ASC' ? 'DESC' : 'ASC';
  }

  private compare(a: any, b: any): number {
    if (a > b) {
      return 1;
    } else if (a < b) {
      return -1;
    } else {
      return 0;
    }
  }
}
