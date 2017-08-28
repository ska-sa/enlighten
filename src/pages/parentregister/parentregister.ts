import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { userAccess } from '../../app/services/users/users';
import { HomePage } from '../home/home';
import { Events } from 'ionic-angular';
/**
 * Generated class for the ParentregisterPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-parentregister',
  templateUrl: 'parentregister.html',
})
export class ParentregisterPage {
  browse: string = "info";
  users: userAccess;
  private fname: string;
  private sname: string;
  private grd: string;
  private sch: string;
  private cell: string;
  private sub: string;
  private email: string;
  private pass: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
    private user: userAccess,public events: Events) {
      this.users = user;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ParentregisterPage');
  }

  next(){
    this.browse = "details";
  }

  reg(){
    if (this.users.alreadyReg(this.cell)){
      this.showDeny();
    }
    else{
      this.users.registerUser(this.fname, this.sname, this.grd, this.sch, this.cell, this.sub, this.email, this.pass);
      this.users.currentUserMobile = this.cell; //UPDATE USERS GLOBAL VARIABLE
      this.events.publish('globals:update', "student" , this.users.getName(this.cell),'menu');
      this.showAlert();
    }
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Registered!',
      subTitle: 'Welcome to Enlighten!',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.navCtrl.setRoot(HomePage);
          }
        }]
    });
    alert.present();
  }
  showDeny() {
    let alert = this.alertCtrl.create({
      title: 'Already Registered!',
      subTitle: 'This account is already used, please go to the Login Page!',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.navCtrl.remove(2,1); // This will remove the 'ResultPage' from stack.
            this.navCtrl.pop();
          }
        }]
    });
    alert.present();
  }

}
