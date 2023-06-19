import { Injectable } from '@angular/core';
import { BehaviorSubject, from } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Basket, BasketItem, BasketTotals } from '../shared/models/basket';
import { HttpClient } from '@angular/common/http';
import { Product } from '../shared/models/products';
import { map } from 'rxjs/operators';

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
  deleteBasket(basket: Basket) {
    return this.http
      .delete<Basket>(this.baseURL + 'basket?id=' + basket.id)
      .subscribe({
        next: () => {
          this.basketSource.next(null);
          this.basketTotalSource.next(null);
          localStorage.removeItem('basket.id');
        },
      });
  }
  sortColumn(sortBy: string) {
    if (!this.basketSource.value) return;

    if (sortBy === 'Product') {
      this.columnSort[0] = this.columnSort[0] === 'ASC' ? 'DESC' : 'ASC';
      this.basketSource.value.items.sort((x, y) =>
        this.compare(x.productName, y.productName)
      );
      if (this.columnSort[0] === 'DESC')
        this.basketSource.value.items.reverse();
    } else if (sortBy === 'Price') {
      this.columnSort[1] = this.columnSort[1] === 'ASC' ? 'DESC' : 'ASC';
      this.basketSource.value.items.sort((x, y) =>
        this.compare(x.price, y.price)
      );
      if (this.columnSort[1] === 'DESC')
        this.basketSource.value.items.reverse();
    } else if (sortBy === 'Qty') {
      this.columnSort[2] = this.columnSort[2] === 'ASC' ? 'DESC' : 'ASC';
      this.basketSource.value.items.sort((x, y) =>
        this.compare(x.quantity, y.quantity)
      );
      if (this.columnSort[2] === 'DESC')
        this.basketSource.value.items.reverse();
    } else if (sortBy === 'Total') {
      this.columnSort[3] = this.columnSort[3] === 'ASC' ? 'DESC' : 'ASC';
      this.basketSource.value.items.sort((x, y) =>
        this.compare(x.price * x.quantity, y.price * y.quantity)
      );
      if (this.columnSort[3] === 'DESC')
        this.basketSource.value.items.reverse();
    }
  }
  set setBasket(basket: Basket) {
    this.http.post<Basket>(this.baseURL + 'basket', basket).subscribe({
      next: (basket) => {
        this.basketSource.next(basket);
        this.calculateTotals();
      },
    });
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
  get getCurrentBasketValue() {
    return this.basketSource.value;
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
    localStorage.setItem('basket.id', basket.id);
    return basket;
  }
  private calculateTotals() {
    const basket = this.getCurrentBasketValue;
    if (!basket) return;
    const shipping = 0;
    const subtotal = basket?.items.reduce(
      (total, item) => item.price * item.quantity + total,
      0
    );
    const total = shipping + subtotal;
    this.basketTotalSource.next({ shipping, total, subtotal });
  }
  private isProduct(item: Product | BasketItem): item is Product {
    //could also use-> if ('productBrand' in item) to check for property in type
    return (item as Product).productBrand !== undefined;
  }
}
