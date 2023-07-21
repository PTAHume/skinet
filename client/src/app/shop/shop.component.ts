import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Product } from '../shared/models/products';
import { ShopService } from './shop.service';
import { Brand } from '../shared/models/brand';
import { Type } from '../shared/models/type';
import { ShopParams } from '../shared/models/shopParams';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
  products: Product[] = [];
  brands: Brand[] = [];
  types: Type[] = [];
  shopParams: ShopParams;
  sortOptions = [
    { name: 'Alphabetical', value: 'name' },
    { name: 'Price: Low to high', value: 'priceAsc' },
    { name: 'Price: hight to low', value: 'priceDesc' },
  ];
  totalCount: number = 0;
  @ViewChild('search') searchTerm?: ElementRef;

  constructor(private shopService: ShopService) {
    this.shopParams = shopService.getShopPrams();
  }

  ngOnInit(): void {
    this.getProducts();
    this.getBrands();
    this.getTypes();
  }

  private getTypes() {
    this.shopService.getTypes().subscribe({
      next: (response) => (this.types = [{ id: 0, name: 'All' }, ...response]),
      error: (error) => console.log(error),
    });
  }

  private getBrands() {
    this.shopService.getBrands().subscribe({
      next: (response) => (this.brands = [{ id: 0, name: 'All' }, ...response]),
      error: (error) => console.log(error),
    });
  }

  private getProducts() {
    this.shopService.getProducts().subscribe({
      next: (response) => {
        this.products = response.data;
        this.totalCount = response.count;
      },
      error: (error) => console.log(error),
    });
  }

  public onBrandSelected(brandId: number) {
    const prams = this.shopService.getShopPrams();
    prams.brandId = brandId;
    prams.pageNumber = 1;
    this.shopService.setShopPrams(prams);
    this.shopParams = prams;
    this.getProducts();
  }

  public onTypeSelected(typeId: number) {
    const prams = this.shopService.getShopPrams();
    prams.typeId = typeId;
    prams.pageNumber = 1;
    this.shopService.setShopPrams(prams);
    this.shopParams = prams;
    this.getProducts();
  }

  public onSortSelected(event: any) {
    const prams = this.shopService.getShopPrams();
    prams.sort = event.target.value;
    this.shopService.setShopPrams(prams);
    this.shopParams = prams;
    this.getProducts();
  }

  public onPageChanged(pageNumber: number) {
    const prams = this.shopService.getShopPrams();
    if (prams.pageNumber !== pageNumber) {
      prams.pageNumber = pageNumber;
      this.shopService.setShopPrams(prams);
      this.shopParams = prams;
      this.getProducts();
    }
  }

  public onSearch() {
    const prams = this.shopService.getShopPrams();
    prams.search = this.searchTerm?.nativeElement.value;
    prams.pageNumber = 1;
    this.shopService.setShopPrams(prams);
    this.shopParams = prams;
    this.getProducts();
  }

  public onReset() {
    if (this.searchTerm) {
      this.searchTerm.nativeElement.value = '';
      this.shopParams = new ShopParams();;
      this.shopService.setShopPrams(this.shopParams);
      this.getProducts();
    }
  }
}
