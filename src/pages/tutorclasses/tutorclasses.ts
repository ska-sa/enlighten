import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ClassroomPage } from '../classroom/classroom'
/**
 * Generated class for the TutorclassesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-tutorclasses',
  templateUrl: 'tutorclasses.html',
})
export class TutorclassesPage {
  my: string = "upcoming";
  private classroomPage;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.classroomPage = ClassroomPage;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TutorclassesPage');
  }

  openPage(p) {
    this.navCtrl.push(p);
  }

}
