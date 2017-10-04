import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ClassroomPage } from '../classroom/classroom'

import * as firebase from 'firebase/app';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
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
  private user;
  private lessons_pending: FirebaseListObservable<any>;
  private lessons_upcoming: FirebaseListObservable<any>;
  private lessons_history: FirebaseListObservable<any>;
  
  private classroomPage;
  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private af: AngularFireDatabase) {
    this.user = navParams.get('user');
    this.classroomPage = ClassroomPage;
    this.lessons_pending = af.list(`/lessons_pending_learners/${this.user.uid}`)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyclassesPage');
  }

  openPage(p) {
    this.navCtrl.push(p);
  }

}
