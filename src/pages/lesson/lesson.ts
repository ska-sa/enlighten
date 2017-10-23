import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TutorAccess } from '../../app/services/tutor-data/tutor.data';
import { DrawPage } from '../draw/draw';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
/**
 * Generated class for the LessonPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-lesson',
  templateUrl: 'lesson.html',
})
export class LessonPage {
  lessons: FirebaseListObservable<any>;
  len: number = 0;
  private user;
  private target;
  private start;
  private drawPage;
  private type:string;
  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private af: AngularFireDatabase, private tutorAccess: TutorAccess) {
    this.user = navParams.get('user');
    this.target = navParams.get('target');
    this.start = navParams.get('start');
    this.type = navParams.get('type');
    if(this.type == 'learner'){
      this.lessons = af.list(`/lessons_upcoming_now_learners/${this.user.uid}`, {query: {limitToFirst: 1}});
    } else {
      this.lessons = af.list(`/lessons_upcoming_now_tutors/${this.user.uid}`, {query: {limitToFirst: 1}});
    }
    
    this.drawPage = DrawPage;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LessonPage');
  }

  openPage(p) {
    this.navCtrl.push(p, {user: this.user, target: this.target});
  }

}
