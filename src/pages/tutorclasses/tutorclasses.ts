import { Component } from '@angular/core'
import { NavController, NavParams } from 'ionic-angular'
import { DrawPage } from '../draw/draw'

import * as firebase from 'firebase/app'
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database'
import { Observable } from 'rxjs/Observable'
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
    private af: AngularFireDatabase) {
    this.drawPage = DrawPage
    this.user = navParams.get('user')

    this.lessons_pending = af.list(`/lessons_pending_tutors/${this.user.uid}`, {
      query: {
        orderByChild: 'rate'
      }
    })
    
    this.lessons_upcoming = af.list(`/lessons_upcoming_tutors/${this.user.uid}`)
    this.lessons_history = af.list(`/lessons_history_tutors/${this.user.uid}`)
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

  // I think we can do this better by having lesson handling as microservices
  acceptLesson (lessonid, learnerid) {
    let env = this

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
    this.my = 'upcoming'
  }
}
