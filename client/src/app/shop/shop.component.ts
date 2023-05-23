import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Product } from '../shared/models/products';
import { ShopService } from './shop.service';
import { Brand } from '../shared/models/brand';
import { Type } from '../shared/models/type';
import { ShopPrams } from '../shared/models/shopPrams';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
  products: Product[] = [];
  brands: Brand[] = [];
  types: Type[] = [];
  shopPrams: ShopPrams = new ShopPrams();
  sortOptions = [
    { name: 'Alphabetical', value: 'name' },
    { name: 'Price: Low to high', value: 'priceAsc' },
    { name: 'Price: hight to low', value: 'priceDesc' },
  ];
  totalCount: number = 0;
  @ViewChild('search') searchTerm?: ElementRef;

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
    this.shopService.getProducts(this.shopPrams).subscribe({
      next: (response) => {
        this.products = response.data;
        this.shopPrams.pageNumber = response.pageIndex;
        this.shopPrams.pageSize = response.pageSize;
        this.totalCount = response.count;
      },
      error: (error) => console.log(error),
    });
  }

  public onBrandSelect(brandId: number) {
    this.shopPrams.brandId = brandId;
    this.shopPrams.pageNumber = 1;
    this.getProducts();
  }
  public onTypeSelect(typeId: number) {
    this.shopPrams.typeId = typeId;
     this.shopPrams.pageNumber = 1;
    this.getProducts();
  }
  public onSortSelected(event: any) {
    this.shopPrams.sort = event.target.value;
    this.getProducts();
  }
  public onPageChanged(pageNumber: number) {
    if (this.shopPrams.pageNumber !== pageNumber) {
      this.shopPrams.pageNumber = pageNumber;
      this.getProducts();
    }
  }
  public onSearch() {
    this.shopPrams.search = this.searchTerm?.nativeElement.value;
    this.shopPrams.pageNumber = 1;
    this.getProducts();
  }

  public onReset() {
    if (this.searchTerm) {
      this.searchTerm.nativeElement.value = '';
      this.shopPrams = new ShopPrams();
      this.getProducts();
    }
  }
}
