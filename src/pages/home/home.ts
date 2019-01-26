import { Component } from '@angular/core';
import { NavController,  } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { DataServiceProvider } from '../../providers/data-service/data-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  type: string;
  utype: String;
  officials: Array<any> = [];
  atheletes: Array<any> = [];

  constructor(public navCtrl: NavController,
    private barcodeScanner: BarcodeScanner,
    public dataService: DataServiceProvider) {
      // this.dataService.getProducts()
      //   .subscribe((response)=> {
      //   });
  }

  scan() {
    const vm = this;
    if(vm.type) {
      vm.barcodeScanner.scan().then((barcodeData) => {
        vm.dataService.toastMessage('User is scanned', 'success');
        vm.dataService.updateOffline(vm.type, barcodeData.text)
      }, (err) => {
        vm.dataService.toastMessage(err, 'success');
      });
    } else {
      vm.dataService.toastMessage('Select any event', 'success');
    }
  }

  onUsers(usertype) {
    const vm = this;
    vm.utype = usertype;
    if(vm.type) {
      vm.dataService.getData(vm.type).then(res => {
        vm.officials = [];
        vm.atheletes = [];
        if(res && Array.isArray(res) && res.length > 0) {
          res.forEach(u => {
            const data = u.split(',');
            if(data && Array.isArray(data) && data.length > 0) {
              const obj = {};
              if(data.length > 4) {
                obj['no'] = data[0];
                obj['name'] = data[1];
                obj['category'] = data[2];
                obj['bibno'] = data[3];
                obj['zone'] = data[4];
                vm.atheletes.push(obj);
              } else {
                obj['no'] = data[0];
                obj['name'] = data[1];
                obj['zone'] = (data.length > 3) ? data[2] : '';
                obj['designation'] = (data.length > 3) ? data[3] : data[2];
                vm.officials.push(obj);
              }
            }
          });
        } else {
          vm.dataService.toastMessage('No users', 'failure');
        }
      });
    } else {
      vm.dataService.toastMessage('Select any event', 'success');
    }
  }

}
