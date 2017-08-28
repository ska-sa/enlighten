import { Component } from '@angular/core';
import {GooglePlus} from 'ionic-native';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { TutorhomePage } from '../tutorhome/tutorhome';
import { userAccess } from '../../app/services/users/users';
import { Events } from 'ionic-angular';

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public cellNo: string;
  public userData;
  private pass: string;
  private users;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private user: userAccess,public events: Events) { //
    this.users = user;
    /*this.googleAuth.login().then(function() {
        //
      })*/
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  login(cellNo: string){
    var type;
    if(this.users.loginCheck(this.cellNo, this.pass)){
      var specUser = this.users.getDetails(this.cellNo);
      this.users.currentUserMobile = cellNo;
      type = specUser.type;
      this.events.publish('globals:update', type , this.users.getName(this.cellNo), specUser.picture, 'menu');
      switch(type) {
        case 'student':
          this.navCtrl.setRoot(HomePage);
        break;
        case 'tutor':
          this.navCtrl.setRoot(TutorhomePage);
        break;
        case 'parent':
          this.navCtrl.setRoot(HomePage);
        break;
      }
           
    }
    else{
      this.showAlert();
    }
  }

  googleLogin() {
    GooglePlus.login({})
    .then(
    (res) => {
      alert('good');
      alert(JSON.stringify(res));
      this.userData = res;
    },
    (err) => {
      alert('good');
      alert(err);
      console.log('error');
      console.log(err);
    });
  }
  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Invalid Login!',
      subTitle: 'Your login credentials are invalid!',
      buttons: ['OK']
    });
    alert.present();
  }

}
