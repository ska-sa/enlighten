import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { UserselectionPage } from '../userselection/userselection';

/**
 * Generated class for the SignupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  browse: string = "first";
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }
  regPg(){
    this.navCtrl.push(RegisterPage);
    //setTimeout(this.back(), 4000);
  }
  next(){
    this.browse = "second";
  }
  back(){
    this.browse = "first";
  }

}
