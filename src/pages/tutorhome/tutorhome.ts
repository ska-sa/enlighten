import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, Events } from 'ionic-angular';
import {CreateclassPage} from '../createclass/createclass';
import { LessonPage } from '../lesson/lesson';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';

/**
 * Generated class for the TutorhomePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-tutorhome',
  templateUrl: 'tutorhome.html',
})
export class TutorhomePage {
  createclassPage;
  private lessons_upcoming: FirebaseListObservable<any>
  private lessons_upcoming_now: FirebaseListObservable<any>
  private lessonPage;
  private user;
  constructor(public navCtrl: NavController, 
    private af: AngularFireDatabase, public navParams: NavParams, public menuController: MenuController,
    public events: Events) {
    this.createclassPage = CreateclassPage;
    this.menuController.enable(true, 'myMenu')
    this.lessonPage = LessonPage;
    this.user = navParams.get('user');
    this.lessons_upcoming = af.list(`/lessons_upcoming_tutors/${this.user.uid}`);
    this.lessons_upcoming_now = af.list(`/lessons_upcoming_now_tutors/${this.user.uid}`, {query: {limitToFirst: 1}});
    //keep in mind, through node - we can make the calendar rewrite itself or delete itself weekly
    //UPDATE CALENDAR TO FIT THIS WEEK!
  }

  ionViewDidLoad() {
    this.menuController.enable(true, 'myMenu');
    this.events.publish('globals:update', this.user, 'tutor'); 
    console.log('ionViewDidLoad TutorhomePage');
  }

  changePage(page,object={learnerid:null},start='') {
    this.navCtrl.push(page, {user: this.user, target: object.learnerid, start: start, type:'tutor', object: object});
  }

}
