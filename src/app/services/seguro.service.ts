import { Seguro } from './../models/Seguro';
import { Injectable, Injector } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class SeguroService extends BaseService<Seguro> {

  constructor(protected injector: Injector) {
    super(injector, 'seguro', 'http://localhost:9000/api/seguros');
   }


}
