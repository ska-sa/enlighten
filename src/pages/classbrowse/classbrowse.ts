import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

/**
 * Generated class for the ClassbrowsePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-classbrowse',
  templateUrl: 'classbrowse.html',
})
export class ClassbrowsePage {
  browse: string = "offers";

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClassbrowsePage');
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Request Sent!',
      buttons: ['OK']
    });
    alert.present();
  }

  request(){
    //Send Request
    this.showAlert();
  }
}
