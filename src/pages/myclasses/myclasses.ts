import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ClassroomPage } from '../classroom/classroom'

/**
 * Generated class for the MyclassesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-myclasses',
  templateUrl: 'myclasses.html',
})
export class MyclassesPage {
  my: string = "booked";
  private classroomPage;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.classroomPage = ClassroomPage;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyclassesPage');
  }

  openPage(p) {
    this.navCtrl.push(p);
  }

}
