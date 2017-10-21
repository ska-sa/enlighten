import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
/**
 * Generated class for the AppointmentsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-appointments',
  templateUrl: 'appointments.html',
})
export class AppointmentsPage {
  private user;
  private lessons_upcoming: FirebaseListObservable<any>
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
    private af: AngularFireDatabase) {
    this.user = navParams.get('user');
    this.lessons_upcoming = af.list(`/lessons_upcoming_tutors/${this.user.uid}`);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AppointmentsPage');
  }

}
