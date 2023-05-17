import { Component, OnInit } from '@angular/core';
import { Product } from '../shared/models/products';
import { ShopService } from './shop.service';
import { Brand } from '../shared/models/brand';
import { Type } from '../shared/models/type';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
  products: Product[] = [];
  brands: Brand[] = [];
  types: Type[] = [];
  brandIdSelected = 0;
  typeIdSelected = 0;
  sortSelected = 'name';
  sortOptions = [
    { name: 'Alphabetical', value: 'name' },
    { name: 'Price: Low to high', value: 'priceAsc' },
    { name: 'Price: hight to low', value: 'priceDesc' },
  ];

  constructor(private shopService: ShopService) {}

  ngOnInit(): void {
    this.getProducts();
    this.shopService.getBrands().subscribe({
      next: (response) => (this.brands = [{ id: 0, name: 'All' }, ...response]),
      error: (error) => console.log(error),
    });
    this.shopService.getTypes().subscribe({
      next: (response) => (this.types = [{ id: 0, name: 'All' }, ...response]),
      error: (error) => console.log(error),
    });
  }
  private getProducts() {
    this.shopService
      .getProducts(this.sortSelected, this.brandIdSelected, this.typeIdSelected)
      .subscribe({
        next: (response) => (this.products = response.data),
        error: (error) => console.log(error),
      });
  }

  public onBrandSelect(brandId: number) {
    this.brandIdSelected = brandId;
    this.getProducts();
  }
  public onTypeSelect(typeId: number) {
    this.typeIdSelected = typeId;
    this.getProducts();
  }
  public onSortSelected(event: any) {
    console.log(event.target.value);
    this.sortSelected = event.target.value;
    this.getProducts();
  }
}
