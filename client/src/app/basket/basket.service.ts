import { Injectable } from '@angular/core';
import { BehaviorSubject, from } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Basket, BasketItem, BasketTotals } from '../shared/models/basket';
import { HttpClient } from '@angular/common/http';
import { Product } from '../shared/models/products';
import { map } from 'rxjs/operators';
import { DeliveryMethod } from '../shared/models/deliveryMethod';
import {v4 as uuidv4} from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  private basketSource = new BehaviorSubject<Basket | null>(null);
  private basketTotalSource = new BehaviorSubject<BasketTotals | null>(null);
  baseURL = environment.apiUrl;
  basketSource$ = this.basketSource.asObservable();
  basketTotalSource$ = this.basketTotalSource.asObservable();
  columnSort: string[] = ['DESC', 'DESC', 'DESC', 'DESC'];

  constructor(private http: HttpClient) {}

  createPaymentIntent() {
    return this.http
      .post<Basket>(
        this.baseURL + 'payments/' + this.getCurrentBasketValue?.id,
        {}
      )
      .pipe(
        map((basket) => {
          this.basketSource.next(basket);
        })
      );
  }

  setShippingPrice(deliveryMethod: DeliveryMethod) {
    const basket = this.getCurrentBasketValue;
    if (basket) {
      basket.shippingPrice = deliveryMethod.price;
      basket.deliveryMethodId = deliveryMethod.id;
      this.setBasket = basket;
    }
  }

  getBasket(id: string) {
    return this.http.get<Basket>(this.baseURL + 'basket?id=' + id).subscribe({
      next: (basket) => {
        this.basketSource.next(basket);
        this.calculateTotals();
      },
    });
  }

  addItemToBasket(item: Product | BasketItem, quantity = 1) {
    if (this.isProduct(item)) item = this.mapProductItemToBasketItem(item);
    const basket = this.getCurrentBasketValue ?? this.createBasket();
    basket.items = this.addOdUpdateItem(basket.items, item, quantity);
    this.setBasket = basket;
  }

  removeItemFromBasket(id: number, quantity = 1) {
    const basket = this.getCurrentBasketValue;
    if (!basket) return;
    const item = basket.items.find((x) => x.id === id);
    if (item) {
      item.quantity -= quantity;
      if (item.quantity === 0) {
        basket.items = basket.items.filter((x) => x.id !== id);
      }
      if (basket.items.length > 0) {
        this.setBasket = basket;
      } else {
        this.deleteBasket(basket);
      }
    }
  }

  deleLocalBasket() {
    this.basketSource.next(null);
    this.basketTotalSource.next(null);
    localStorage.removeItem('basket.id');
  }

  deleteBasket(basket: Basket) {
    return this.http
      .delete<Basket>(this.baseURL + 'basket?id=' + basket.id)
      .subscribe({
        next: () => {
          this.deleLocalBasket();
        },
      });
  }

  sortColumn(columnName: string, columnIndex: number) {
    if (!this.basketSource.value) return;
    if (columnName === 'Product') {
      if (this.columnSort[columnIndex] === 'ASC') {
        this.basketSource.value.items.sort((x, y) =>
          this.compare(x.productName, y.productName)
        );
      } else {
        this.basketSource.value.items.sort((x, y) =>
          this.compare(y.productName, x.productName)
        );
      }
    } else if (columnName === 'Price') {
      if (this.columnSort[columnIndex] === 'ASC') {
        this.basketSource.value.items.sort((x, y) => x.price - y.price);
      } else {
        this.basketSource.value.items.sort((x, y) => y.price - x.price);
      }
    } else if (columnName === 'Qty') {
      if (this.columnSort[columnIndex] === 'ASC') {
        this.basketSource.value.items.sort((x, y) => x.quantity - y.quantity);
      } else {
        this.basketSource.value.items.sort((x, y) => y.quantity - x.quantity);
      }
    } else if (columnName === 'Total') {
      if (this.columnSort[columnIndex] === 'ASC') {
        this.basketSource.value.items.sort(
          (x, y) => x.price * x.quantity - y.price * y.quantity
        );
      } else {
        this.basketSource.value.items.sort(
          (x, y) => y.price * y.quantity - x.price * x.quantity
        );
      }
    }
    this.columnSort[columnIndex] =
      this.columnSort[columnIndex] === 'ASC' ? 'DESC' : 'ASC';
  }

  set setBasket(basket: Basket) {
    this.http.post<Basket>(this.baseURL + 'basket', basket).subscribe({
      next: (basket) => {
        this.basketSource.next(basket);
        this.calculateTotals();
      },
    });
  }

  get getCurrentBasketValue() {
    return this.basketSource.value;
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

  private mapProductItemToBasketItem(item: Product) {
    let itemToAdd!: BasketItem;
    from([item])
      .pipe(
        map<Product, BasketItem>((product) => ({
          id: product.id,
          productName: product.name,
          price: product.price,
          quantity: 0,
          pictureUrl: product.pictureUrl,
          brand: product.productBrand,
          type: product.productType,
        }))
      )
      .subscribe({
        next: (response: BasketItem) => {
          itemToAdd = response;
        },
      });
    return itemToAdd;
  }
  private addOdUpdateItem(
    items: BasketItem[],
    itemToAdd: BasketItem,
    quantity: number
  ): BasketItem[] {
    const item = items.find((x) => x.id === itemToAdd.id);
    if (item) item.quantity += quantity;
    else {
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    }
    return items;
  }
  private createBasket(): Basket {
    const basket = new Basket();
    basket.id = uuidv4();
    localStorage.setItem('basket.id', basket.id);
    return basket;
  }
  private calculateTotals() {
    const basket = this.getCurrentBasketValue;
    if (!basket) return;
    const subtotal = basket?.items.reduce(
      (total, item) => item.price * item.quantity + total,
      0
    );
    const total = basket.shippingPrice + subtotal;
    this.basketTotalSource.next({
      shipping: basket.shippingPrice,
      total,
      subtotal,
    });
  }
  private isProduct(item: Product | BasketItem): item is Product {
    //could also use-> if ('productBrand' in item) to check for property in type
    return (item as Product).productBrand !== undefined;
  }
}
