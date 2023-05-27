export class ShopParams {
  brandId?: number;
  typeId?: number;
  sort: string = 'name';
  pageNumber: number = 1;
  pageSize: number = 6;
  search: string = '';
}
