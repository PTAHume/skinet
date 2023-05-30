import { Component, OnInit } from '@angular/core';
import { Product } from './../../shared/models/products';
import { ShopService } from '../shop.service';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  product?: Product;

  constructor(
    private shopService: ShopService,
    private activatedRoute: ActivatedRoute,
    private breadService: BreadcrumbService
  ) {
    this.breadService.set('@productDetails', ' ');
  }

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct() {
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.shopService.getProduct(+id).subscribe({
        next: (product) => {
          this.product = product;
          this.breadService.set('@productDetails', product.name);
        },
        error: (error) => console.log(error),
      });
    }
  }
}
