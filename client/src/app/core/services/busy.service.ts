import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class BusyService {
  constructor(private spinnerService: NgxSpinnerService) {
    this.spinnerService.show();
  }

  busy() {
    this.spinnerService.show();
  }

  idle() {
    this.spinnerService.hide();
  }
}
