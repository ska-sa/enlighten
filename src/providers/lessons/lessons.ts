import { Injectable } from '@angular/core';
import { AuthProvider } from '../auth/auth'
import 'rxjs/add/operator/map';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database'
import { AngularFireAuth } from 'angularfire2/auth'
import { Events } from 'ionic-angular'

/*
  Generated class for the LessonsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class LessonsProvider {

  constructor(public auth: AuthProvider, private af: AngularFireDatabase, events: Events) {

  }

  getUpcomingLessons (user, type): FirebaseListObservable<any> {
    return this.af.list(`/lessons_upcoming_${type}s/${user.uid}`)
  }

  getUpcomingNowLessons (uid, type, query = {}): FirebaseListObservable<any> {
    return this.af.list(`/lessons_upcoming_now_${type}s/${uid}/`, query)
  }

  getPendingLessons (user, type): FirebaseListObservable<any> {
    let query = type === 'tutor' ? {
      query: {
        orderByChild: 'rate'
      }
    } : {}

    return this.af.list(`/lessons_pending_${type}s/${user.uid}`, query)
  }

  getLessonHistory (user, type): FirebaseListObservable<any> {
    return this.af.list(`/lessons_history_${type}s/${user.uid}`)
  }

  acceptLesson (lessonid, learnerid, user) {
    firebase.database().ref(`/lessons_pending_learners/${learnerid}/${lessonid}`).once('value').then(res => {
      firebase.database().ref(`/lessons_upcoming_learners/${learnerid}/${lessonid}`).update(res.val())
      firebase.database().ref(`/lessons_pending_learners/${learnerid}/${lessonid}`).remove()

      firebase.database().ref(`/lessons_pending_tutors/${user.uid}/${lessonid}`).once('value').then(res2 => {
        var data = res2.val()
        data.tutorname = res.val().tutorname
        firebase.database().ref(`/lessons_upcoming_tutors/${user.uid}/${lessonid}`).update(data)
        firebase.database().ref(`/lessons_pending_tutors/${user.uid}/${lessonid}`).remove()
      })
    })

    firebase.database().ref(`/lessons_pending_tutors_learners/${user.uid}/${learnerid}/${lessonid}`).remove()
  }

  autoAcceptLesson (lessonid, learnerid, tutorid) {
    firebase.database().ref(`/lessons_pending_learners/${learnerid}/${lessonid}`).once('value').then(res => {
      firebase.database().ref(`/lessons_upcoming_learners/${learnerid}/${lessonid}`).update(res.val())
      firebase.database().ref(`/lessons_pending_learners/${learnerid}/${lessonid}`).remove()

      firebase.database().ref(`/lessons_pending_tutors/${tutorid}/${lessonid}`).once('value').then(res2 => {
        var data = res2.val()
        data.tutorname = res.val().tutorname
        firebase.database().ref(`/lessons_upcoming_tutors/${tutorid}/${lessonid}`).update(data)
        firebase.database().ref(`/lessons_pending_tutors/${tutorid}/${lessonid}`).remove()
      })
    })

    firebase.database().ref(`/lessons_pending_tutors_learners/${tutorid.uid}/${learnerid}/${lessonid}`).remove()
  }

}
