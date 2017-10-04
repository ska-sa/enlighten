import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


/**
 * Generated class for the TutorclassmenuPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
import {TutorclassesPage} from '../tutorclasses/tutorclasses';
import {CreateclassPage} from '../createclass/createclass';

@Component({
  selector: 'page-tutorclassmenu',
  templateUrl: 'tutorclassmenu.html',
})
export class TutorclassmenuPage {
  private tutorclassesPage;
  private createclassPage;
  private user;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.tutorclassesPage = TutorclassesPage;
    this.createclassPage = CreateclassPage;
    this.user = navParams.get('user');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TutorclassmenuPage');
  }
  toPage(page) {
    this.navCtrl.push(page, {user: this.user});
  }
}
