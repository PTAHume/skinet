import { BasketService } from 'src/app/basket/basket.service';
import { Component } from '@angular/core';
import { BasketItem } from '../shared/models/basket';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss'],
})
export class BasketComponent {
  constructor(public basketService: BasketService) {}

  incrementQuantity(item: BasketItem) {
    this.basketService.addItemToBasket(item, 1);
  }
  decrementQuantity(id: number, quantity: number) {
    this.basketService.removeItemFromBasket(id, quantity);
  }
}
