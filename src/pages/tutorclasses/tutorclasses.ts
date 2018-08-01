import { Component } from '@angular/core'
import { NavController, NavParams } from 'ionic-angular'
import { DrawPage } from '../draw/draw'

import * as firebase from 'firebase/app'
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database'
import { Observable } from 'rxjs/Observable'
import { LessonsProvider } from '../../providers/lessons/lessons'

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
  my: string = "pending"
  private user
  private lessons_pending: FirebaseListObservable<any>
  private lessons_upcoming: FirebaseListObservable<any>
  private lessons_history: FirebaseListObservable<any>
  private drawPage
  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private af: AngularFireDatabase, private lessonsProvider: LessonsProvider) {
    this.drawPage = DrawPage
    this.user = navParams.get('user')

    this.lessons_pending = lessonsProvider.getPendingLessons(this.user)
    this.lessons_upcoming = lessonsProvider.getUpcomingLessons(this.user)
    this.lessons_history = lessonsProvider.getLessonHistory(this.user)
  }

  ionViewDidLoad () {
    console.log('ionViewDidLoad TutorclassesPage')
  }

  openPage (p, lesson, start) {
    this.navCtrl.push(p, {user: this.user, target: lesson.learnerid, start: start, type:'tutor', object: lesson});
  }

  name (type) {
    if (type == 'group') {
      return 'contacts'
    } else {
      return 'person'
    }
  }

  acceptLesson (lessonid, learnerid) {
    this.lessonsProvider.acceptLesson(lessonid, learnerid, this.user)
    this.my = 'upcoming'
  }
}
