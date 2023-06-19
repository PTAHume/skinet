import { BasketService } from 'src/app/basket/basket.service';
import { Component } from '@angular/core';
import { BasketItem } from '../shared/models/basket';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss'],
})
export class BasketComponent {
  public sortOrder: number = 0;
  public sortDirection = 1;
  public sortColumn = -1;

  constructor(public basketService: BasketService) {}

  incrementQuantity(item: BasketItem) {
    this.basketService.addItemToBasket(item, 1);
  }
  decrementQuantity(id: number, quantity: number) {
    this.basketService.removeItemFromBasket(id, quantity);
  }
  sortBasket(sortBy: string, sortColumn: number) {
    if (this.sortColumn !== sortColumn) this.sortDirection = 0;
    this.sortColumn = sortColumn;
    this.sortDirection = this.sortDirection === 1 ? 0 : 1;
    this.basketService.sortColumn(sortBy);
  }
}
