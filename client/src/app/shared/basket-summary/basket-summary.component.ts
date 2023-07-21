import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BasketItem } from '../models/basket';
import { BasketService } from 'src/app/basket/basket.service';

@Component({
  selector: 'app-basket-summary',
  templateUrl: './basket-summary.component.html',
  styleUrls: ['./basket-summary.component.scss'],
})
export class BasketSummaryComponent {
  public sortOrder: number = 0;
  public sortDirection = 1;
  public columnIndex = -1;
  @Output() addItem = new EventEmitter<BasketItem>();
  @Output() removeItem = new EventEmitter<{ id: number; quantity: number }>();
  @Input() isBasket = true;

  constructor(public basketService: BasketService) {}

  sortBasket(columnName: string, columnIndex: number) {
    if (this.columnIndex !== columnIndex) this.sortDirection = 0;
    this.columnIndex = columnIndex;
    this.sortDirection = this.sortDirection === 1 ? 0 : 1;
    this.basketService.sortColumn(columnName, columnIndex);
  }
  addBasketItem(item: BasketItem) {
    this.addItem.emit(item);
  }
  removeBasketItem(id: number, quantity: number = 1) {
    this.removeItem.emit({ id, quantity });
  }
}
