import { BasketService } from 'src/app/basket/basket.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CheckoutService } from '../checkout.service';
import { DeliveryMethod } from 'src/app/shared/models/deliveryMethod';

@Component({
  selector: 'app-checkout-delivery',
  templateUrl: './checkout-delivery.component.html',
  styleUrls: ['./checkout-delivery.component.scss'],
})
export class CheckoutDeliveryComponent implements OnInit {
  @Input() checkoutForm?: FormGroup;
  deliveryMethods: DeliveryMethod[] = [];

  constructor(
    private checkOutService: CheckoutService,
    public basketService: BasketService
  ) {}

  ngOnInit(): void {
    this.checkOutService.getDeliveryMethods().subscribe({
      next: (dm) => {
        this.deliveryMethods = dm;
      },
      complete: () => {
        this.getDeliveryMethodValue();
      },
    });
  }

  setShippingPrice(deliveryMethod: DeliveryMethod) {
    this.basketService.setShippingPrice(deliveryMethod);
  }

  getDeliveryMethodValue() {
    const basket = this.basketService.getCurrentBasketValue;
    if (basket?.deliveryMethodId != null) {
      this.checkoutForm
        ?.get('deliveryForm')
        ?.get('deliveryMethod')
        ?.patchValue(basket.deliveryMethodId.toString());
    }
  }
}
