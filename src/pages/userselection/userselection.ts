import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { TutorregisterPage } from '../tutorregister/tutorregister';
import { ParentregisterPage } from '../parentregister/parentregister';
import { MyApp } from '../../app/app.component';
import { Events } from 'ionic-angular';
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
  constructor(public navCtrl: NavController, public navParams: NavParams,public events: Events) {
    this.type = '';
    this.displayName = "N Nkuna"
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserselectionPage');
  }

  registerPage(type) {
    this.type = type;
    this.events.publish('globals:update', type, this.displayName);
    switch (type) {
      case "student":
        this.navCtrl.push(RegisterPage);
      break;
      case "tutor":
        this.navCtrl.push(TutorregisterPage);
      break;
      case "parent":
        this.navCtrl.push(ParentregisterPage);
      break;
    }
  }

}
