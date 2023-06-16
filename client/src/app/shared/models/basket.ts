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
}

export class Basket implements Basket {
  id: string = crypto.randomUUID();
  items: BasketItem[] = [];
}

export interface BasketTotals {
  shipping: number
  subtotal: number;
  total: number;
}
