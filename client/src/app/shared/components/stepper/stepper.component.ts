import { CdkStepper } from '@angular/cdk/stepper';
import { Component, Input, OnInit } from '@angular/core';
import { BasketService } from 'src/app/basket/basket.service';
import { CheckoutReviewComponent } from 'src/app/checkout/checkout-review/checkout-review.component';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  providers: [{ provide: CdkStepper, useExisting: StepperComponent }],
})
export class StepperComponent extends CdkStepper implements OnInit {
  @Input() linearModeSelected = true;
  @Input() checkoutReviewComponent?: CheckoutReviewComponent;
  @Input() basketService: BasketService | null = null;

  ngOnInit(): void {
    this.linear = this.linearModeSelected;
  }

  IsStepDisabled(i: number) {
    if (i === 0) {
      //address tab always ok
      return false;
    } else if (i === 1) {
      //delivery tab ok if address is valid
      return !this.steps.get(0)?.completed;
    } else if (i >= 2) {
      //others tabs ok if address & delivery are valid
      return !(this.steps.get(0)?.completed && this.steps.get(1)?.completed);
    }
    return false;
  }

  onClick(index: number) {
    if (
      index === 3 &&
      this.steps.get(0)?.completed &&
      this.steps.get(1)?.completed
    ) {
      this.checkoutReviewComponent?.createPayment();
    }
    this.selectedIndex = index;
  }
}
