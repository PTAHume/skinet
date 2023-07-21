import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../shared/models/order';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  baseURL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getOrdersForUser() {
    return this.http.get<Order[]>(this.baseURL + 'orders');
  }

  getOrdersByIdForUser(id: number) {
    return this.http.get<Order>(this.baseURL + 'orders/' + id);
  }
}
