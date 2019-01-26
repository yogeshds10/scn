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
  atheletes: Array<any> = [];
  officials: Array<any> = [];

  constructor(public navCtrl: NavController,
    private barcodeScanner: BarcodeScanner,
    public dataService: DataServiceProvider) {
      // this.dataService.getProducts()
      //   .subscribe((response)=> {
      //   });
  }

  onTypeChange() {
    const vm = this;
    vm.utype = '';
    vm.atheletes = [];
    vm.officials = [];
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
          vm.atheletes = res.filter(r => {
            return r.type === 'atheletes';
          });
          vm.officials = res.filter(r => {
            return r.type === 'officials';
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
