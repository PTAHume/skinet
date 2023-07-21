import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-paging-footer',
  templateUrl: './paging-footer.component.html',
  styleUrls: ['./paging-footer.component.scss'],
})
export class PagingFooterComponent  {
  @Input() pageSize: number = 6;
  @Input() pageNumber?: number;
  @Input() totalCount?: number;
  @Output() pageChanged = new EventEmitter<number>();

  public onPageChanged(event: any) {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.pageChanged.emit(this.pageNumber);
    }
  }
}
