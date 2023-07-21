export interface BasketItem {
  id: number;
  productName: string;
  price: number;
  quantity: number;
  brand: string;
  type: string;
  pictureUrl: string;
}

export interface Basket {
  id: string;
  items: BasketItem[];
  clientSecret?: string;
  paymentIntentId?: string;
  deliveryMethodId?: number;
  shippingPrice: number;
}

export class Basket implements Basket {
  id: string = '';
  items: BasketItem[] = [];
  shippingPrice = 0;
}

export interface BasketTotals {
  shipping: number;
  subtotal: number;
  total: number;
}
