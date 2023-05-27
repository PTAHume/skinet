import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Product } from '../shared/models/products';
import { Brand } from '../shared/models/brand';
import { Type } from '../shared/models/type';
import { Pagination } from '../shared/models/pagination';
import { ShopParams } from '../shared/models/shopParams';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProducts(shopParams: ShopParams) {
    let params = new HttpParams();

    if (shopParams.brandId) params = params.append('brandId', shopParams.brandId);
    if (shopParams.typeId) params = params.append('typeId', shopParams.typeId);
    if (shopParams.search) params = params.append('search', shopParams.search);
    params = params.append('sort', shopParams.sort);
    params = params.append('pageIndex', shopParams.pageNumber);
    params = params.append('pageSize', shopParams.pageSize);

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
