import { Observable } from 'rxjs/internal/Observable';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Pagination } from '../shared/models/Pagination';
import { Product } from '../shared/models/products';
import { Brand } from '../shared/models/brand';
import { Type } from '../shared/models/type';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  baseUrl = 'https://localhost:5001/api/';

  constructor(private http: HttpClient) {}

  public getProducts(sortSelected: string, brandId?: number, typeId?: number) {
    let params = new HttpParams();
    params = params.append('sort', sortSelected);
    if (brandId) params = params.append('brandId', brandId);
    if (typeId) params = params.append('typeId', typeId);
    console.log(params);
    return this.http.get<Pagination<Product[]>>(this.baseUrl + 'products', {
      params,
    });
  }
  public getBrands() {
    return this.http.get<Brand[]>(this.baseUrl + 'Products/brands');
  }
  public getTypes() {
    return this.http.get<Type[]>(this.baseUrl + 'Products/types');
  }
}
