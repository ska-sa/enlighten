import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DrawPage } from '../draw/draw'

import * as firebase from 'firebase/app';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { LessonsProvider } from '../../providers/lessons/lessons'

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
  my: string = "scheduled";
  private user;
  private lessons_pending: FirebaseListObservable<any>;
  private lessons_upcoming: FirebaseListObservable<any>;
  private lessons_history: FirebaseListObservable<any>;
  private drawPage;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private af: AngularFireDatabase, private lessonsProvider: LessonsProvider) {
    this.user = navParams.get('user');
    this.drawPage = DrawPage;
    this.lessons_upcoming = lessonsProvider.getUpcomingLessons(this.user)
    this.lessons_history = lessonsProvider.getLessonHistory(this.user)
    this.lessons_pending = lessonsProvider.getPendingLessons(this.user)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyclassesPage');
  }

  openPage(p, lesson, start) {
    this.navCtrl.push(p, {user: this.user, target: lesson.tutorid, start: start, type:'learner', object: lesson});
  }

}
