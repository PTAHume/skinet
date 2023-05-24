import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Product } from '../shared/models/products';
import { Brand } from '../shared/models/brand';
import { Type } from '../shared/models/type';
import { Pagination } from '../shared/models/pagination';
import { ShopPrams } from '../shared/models/shopPrams';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProducts(shopPrams: ShopPrams) {
    let params = new HttpParams();

    if (shopPrams.brandId) params = params.append('brandId', shopPrams.brandId);
    if (shopPrams.typeId) params = params.append('typeId', shopPrams.typeId);
    if (shopPrams.search) params = params.append('search', shopPrams.search);
    params = params.append('sort', shopPrams.sort);
    params = params.append('pageIndex', shopPrams.pageNumber);
    params = params.append('pageSize', shopPrams.pageSize);

    return this.http.get<Pagination<Product[]>>(this.baseUrl + 'products', {
      params,
    });
  }
  getProduct(id: number) {
    return this.http.get<Product>(this.baseUrl + 'products/' + id);
  }
  getBrands() {
    return this.http.get<Brand[]>(this.baseUrl + 'Products/brands');
  }
  getTypes() {
    return this.http.get<Type[]>(this.baseUrl + 'Products/types');
  }
}
