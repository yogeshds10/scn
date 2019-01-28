import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
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
    if(data) {
      let users = [];
      let details = data.split(',');
      details = details.filter(x => { return x });
      if(details && Array.isArray(details) && details.length > 0) {
        const userObj = {};
        if(details.length > 4) {
          userObj['no'] = details[0];
          userObj['name'] = details[1];
          userObj['category'] = details[2];
          userObj['bibno'] = details[3];
          userObj['zone'] = details[4];
          userObj['type'] = 'atheletes';
          userObj['time'] = Date.now();
        } else {
          userObj['no'] = details[0];
          userObj['name'] = details[1];
          userObj['zone'] = (details.length > 3) ? details[2] : '';
          userObj['designation'] = (details.length > 3) ? details[3] : details[2];
          userObj['type'] = 'officials';
          userObj['time'] = Date.now();
        }
        vm.getData(key).then((res) => {
          if (res && Array.isArray(res) && res.length > 0) {
            users = res;
          }
          if(key === 'isolation' || key === '3isolation' || key === '4isolation') {
            const find = users.filter(u => {
              return u['no'] === userObj['no'];
            });
            if(find && find.length > 0) {
              users = users.filter(u => {
                return u['no'] !== userObj['no'];
              });
            } else {
              users.push(userObj);  
            }
          } else {
            users.push(userObj);
          }
          vm.setData(key, users);
        });
      }
    }
  }

  postData(path: string, data: any): Observable<any> {
    const vm = this;
    return this.http.post(path, data)
      .map((res: Response) => {
        return vm.extractData(res, vm);
      })
      .catch((error: Response) => {
        return vm.handleError(error, vm);
      });
  }

  private extractData(res: Response, vm) {
    const body = res.json();
    if (body.error) {
      throw (res);
    } else {
      return body.data;
    }
  }

  private handleError(error: Response | any, vm) {
    if (error.status === 401) {
    } else if (error.status !== 0) {
      const errorMsg = error.json();
      return Observable.of(errorMsg).map(e => e);
    } else if (error.status === 0) {
      const resObj = {};
      resObj['error'] = true;
      return Observable.of(resObj).map(e => e);
    }
  }
}
