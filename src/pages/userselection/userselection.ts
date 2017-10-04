import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { TutorregisterPage } from '../tutorregister/tutorregister';
import { ParentregisterPage } from '../parentregister/parentregister';
import { MyApp } from '../../app/app.component';
import { Events } from 'ionic-angular';

import { NativeStorage } from '@ionic-native/native-storage';
/**
 * Generated class for the UserselectionPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-userselection',
  templateUrl: 'userselection.html',
})
export class UserselectionPage {
  public type: string = "typing";
  private displayName: string;
  private myApp;
  constructor(public navCtrl: NavController, public navParams: NavParams,public events: Events,private nativeStorage: NativeStorage) {
    this.type = '';
    this.displayName = "N Nkuna"
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserselectionPage');
  }

  registerPage(type) {
    this.type = type;
    this.nativeStorage.setItem('usertype', {type: type})
    this.events.publish('globals:update', type, this.displayName);
    switch (type) {
      case "student":
        this.navCtrl.push(RegisterPage, {type: type});
      break;
      case "tutor":
        this.navCtrl.push(TutorregisterPage, {type: type});
      break;
      case "parent":
        this.navCtrl.push(ParentregisterPage, {type: type});
      break;
    }
  }

}
