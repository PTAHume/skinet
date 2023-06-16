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

  constructor(private http: HttpClient) {}
  getBasket(id: string) {
    return this.http.get<Basket>(this.baseURL + 'basket?id=' + id).subscribe({
      next: (basket) => {
        this.basketSource.next(basket);
        this.calculateTotals();
      },
    });
  }
  setBasket(basket: Basket) {
    this.http.post<Basket>(this.baseURL + 'basket', basket).subscribe({
      next: (basket) => {
        this.basketSource.next(basket);
        this.calculateTotals();
      },
    });
  }
  getCurrentBasketValue() {
    return this.basketSource.value;
  }
  addItemToBasket(item: Product | BasketItem, quantity = 1) {
    if (this.isProduct(item)) item = this.mapProductItemToBasketItem(item);
    const basket = this.getCurrentBasketValue() ?? this.createBasket();
    basket.items = this.addOdUpdateItem(basket.items, item, quantity);
    this.setBasket(basket);
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
  removeItemFromBasket(id: number, quantity = 1) {
    const basket = this.getCurrentBasketValue();
    if (!basket) return;
    const item = basket.items.find((x) => x.id === id);
    if (item) {
      item.quantity -= quantity;
      if (item.quantity === 0) {
        basket.items = basket.items.filter((x) => x.id !== id);
      }
      if (basket.items.length > 0) {
        this.setBasket(basket);
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
    const basket = this.getCurrentBasketValue();
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
