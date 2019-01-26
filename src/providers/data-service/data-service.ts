import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/*
  Generated class for the DataServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataServiceProvider {

  constructor(public http: Http,
    private toastCtrl: ToastController,
    private storage: Storage) {}

  getProducts(){
    return this.http.get('assets/data/products.json')
      .map((response:Response)=>response.json());
  }

  toastMessage(message, className) {
    let toast = this.toastCtrl.create({
        message: message,
        duration: 2000,
        position: 'top',
        cssClass: className ? className : ''
    });
    toast.present();
  }

  getData(key: string) {
    const vm = this;
    return vm.storage.get(key);
  }

  setData(key: string, data: any) {
    const vm = this;
    vm.storage.set(key, data);
  }

  updateOffline(key: string, data: any) {
    const vm = this;
    let datum = [];
    vm.getData(key).then((res) => {
      if (res && Array.isArray(res) && res.length > 0) {
        datum = res;
      }
      datum.push(data);
      vm.setData(key, datum);
    });
  }
}
