export class StepCheck implements StepCheck {

  constructor(addressStepCompleted: boolean, deliveryStepCompleted: boolean) {
    this.AddressStepCompleted = addressStepCompleted;
    this.DeliveryStepCompleted = deliveryStepCompleted;
  }
  AddressStepCompleted: boolean;
  DeliveryStepCompleted: boolean;
}

export interface StepCheck{
  AddressStepCompleted: boolean;
  DeliveryStepCompleted: boolean;
}
