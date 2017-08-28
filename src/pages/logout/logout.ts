import { Component } from '@angular/core';
import { MenuController,NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { SignupPage } from '../signup/signup';
import { Events } from 'ionic-angular';

/**
 * Generated class for the LogoutPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-logout',
  templateUrl: 'logout.html',
})
export class LogoutPage {
  private menuCtrl;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public events: Events,public menu: MenuController) {
      //this.menuCtrl = menu;
      this.menu.enable(false, 'myMenu')
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LogoutPage');
  }
  loginPg(){
    this.navCtrl.push(LoginPage);
    
  }
  regPg(){
    this.navCtrl.push(SignupPage);
    
  }
  onPageWillLeave() {
    
  }

}
