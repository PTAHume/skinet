import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PagingHeaderComponent } from './paging-header/paging-header.component';
import { PagingFooterComponent } from './paging-footer/paging-footer.component';

@NgModule({
  declarations: [
    PagingHeaderComponent,
    PagingFooterComponent
  ],
  imports: [CommonModule, PaginationModule.forRoot()],
  exports: [PaginationModule,PagingHeaderComponent, PagingFooterComponent],
})
export class SharedModule {}
