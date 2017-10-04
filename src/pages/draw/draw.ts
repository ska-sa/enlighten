import { Component } from '@angular/core';
import { NavController, NavParams,MenuController } from 'ionic-angular';

/**
 * Generated class for the DrawPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-draw',
  templateUrl: 'draw.html',
})
export class DrawPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public menu: MenuController) {
    this.menu.enable(false, 'myMenu')
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad DrawPage');
  }

}
