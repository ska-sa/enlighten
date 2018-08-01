import { Component } from '@angular/core'
import { NavController, NavParams, MenuController, Events, AlertController } from 'ionic-angular'
import { TutorschedulePage } from '../tutorschedule/tutorschedule'
import { TutorclassesPage } from '../tutorclasses/tutorclasses'
import { LessonPage } from '../lesson/lesson'

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database'
import { AngularFireAuth } from 'angularfire2/auth'
import { Observable } from 'rxjs/Observable'
import * as firebase from 'firebase'
import { LessonsProvider } from '../../providers/lessons/lessons'

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
  tutorschedulePage
  tutorclassesPage
  private lessons_upcoming: FirebaseListObservable<any>
  private lessons_upcoming_now: FirebaseListObservable<any>
  private lessons_pending
  private lessonPage
  private user
  constructor(public navCtrl: NavController, 
    private af: AngularFireDatabase, public navParams: NavParams, public menuController: MenuController,
    public events: Events, public alertCtrl: AlertController, private lessonsProvider: LessonsProvider) {
    this.tutorschedulePage = TutorschedulePage
    this.menuController.enable(true, 'myMenu')
    this.lessonPage = LessonPage
    this.tutorclassesPage = TutorclassesPage
    this.user = navParams.get('user')
    const type = 'tutor'
    this.lessons_pending = lessonsProvider.getPendingLessons(this.user, type)
    this.lessons_upcoming = lessonsProvider.getUpcomingLessons(this.user, type)
    this.lessons_upcoming_now = lessonsProvider.getUpcomingNowLessons(this.user.uid, type, {query: {limitToFirst: 1}})
    //keep in mind, through node - we can make the calendar rewrite itself or delete itself weekly
    //UPDATE CALENDAR TO FIT THIS WEEK!
  }

  ionViewDidLoad() {
    this.menuController.enable(true, 'myMenu')
    this.events.publish('globals:update', this.user, 'tutor') 
    console.log('ionViewDidLoad TutorhomePage')
  }

  changePage(page, object = { learnerid: null }, start = '') {
    this.navCtrl.push(page, { user: this.user, target: object.learnerid, start: start, type:'tutor', object: object })
  }

  viewLesson (lesson, key) {
    let confirm = this.alertCtrl.create({
      title: `Accept lesson with ${lesson.learnername}?`,
      message: `Do you agree to tutor ${lesson.learnername} at ${lesson.date}?`,
      buttons: [
        {
          text: 'No',
          handler: () => {
            this.rejectLesson(lesson, key)
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.acceptLesson(lesson, key)
          }
        }
      ]
    })

    confirm.present()
  }

  acceptLesson (lesson, lessonid) {
    let env = this
    let learnerid = lesson.learnerid

    firebase.database().ref(`/lessons_pending_learners/${learnerid}/${lessonid}`).once('value').then(res => {
      firebase.database().ref(`/lessons_upcoming_learners/${learnerid}/${lessonid}`).update(res.val())
      firebase.database().ref(`/lessons_pending_learners/${learnerid}/${lessonid}`).remove()

      firebase.database().ref(`/lessons_pending_tutors/${env.user.uid}/${lessonid}`).once('value').then(res2 => {
        var data = res2.val()
        data.tutorname = res.val().tutorname
        firebase.database().ref(`/lessons_upcoming_tutors/${env.user.uid}/${lessonid}`).update(data)
        firebase.database().ref(`/lessons_pending_tutors/${env.user.uid}/${lessonid}`).remove()
      })
    })

    firebase.database().ref(`/lessons_pending_tutors_learners/${this.user.uid}/${learnerid}/${lessonid}`).remove()
  }

  rejectLesson (lesson, lessonid) {
    let learnerid = lesson.learnerid
    firebase.database().ref(`/lessons_pending_tutors_learners/${this.user.uid}/${learnerid}/${lessonid}`).remove()
  } 

}
