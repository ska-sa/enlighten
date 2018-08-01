import { Component } from '@angular/core'
import { NavController, NavParams } from 'ionic-angular'
import { Calendar } from '@ionic-native/calendar'
import * as moment from 'moment'
import * as firebase from 'firebase/app'

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database'
import { AngularFireAuth } from 'angularfire2/auth'
import { Observable } from 'rxjs/Observable'
/**
 * Generated class for the TutorschedulePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-tutorschedule',
  templateUrl: 'tutorschedule.html',
})
export class TutorschedulePage {
  private fcalendar: FirebaseListObservable<any>
  private user
  private type: string = 'tutor'
  private lastDay
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private calendar: Calendar, 
    private af: AngularFireDatabase) {
    this.user = navParams.get('user')
    this.fcalendar = af.list(`/calendar_tutors/${this.user.uid}`)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TutorschedulePage')
  }

  updateDtStart(k, val, key, slot) {
    let date = val
    date.month = date.month - 1
    this.lastDay = moment(date)

    firebase.database().ref(`/calendar_tutors/${this.user.uid}/${key}`).once('value').then(res => {
      const obj = res.val()
      let duration

      if (obj.duration !== null && obj.duration !== undefined) {
        duration = 60
        slot.duration = duration
      }

      const start = moment(slot.start).format()

      firebase.database().ref(`/calendar_tutors/${this.user.uid}/${key}`).update({
        start,
        booked: false,
        duration,
        end: moment(start).add('minutes', duration).format()
      })

      firebase.database().ref(`/calendar_tutors_unbooked/${this.user.uid}/${key}`).update({
        start,
        booked: false,
        duration,
        end: moment(start).add('minutes', duration).format()
      })
    })
  }

  updateDur(k, val, key, val2) {
    let end = moment(this.lastDay).add('minutes', val) //FIRST CHECK IF IT CLASHES WITH OTHER DATES

    firebase.database().ref(`/calendar_tutors/${this.user.uid}/${key}`).update({
      duration: val, //miliseconds
      end: moment(end).format(),
      booked: false, //how to do this better
      static: true
    })

    firebase.database().ref(`/calendar_tutors_unbooked/${this.user.uid}/${key}`).update({
      duration: val, //miliseconds
      end: moment(end).format(),
      booked: false, //how to do this better
      static: true
    })
  }

  addToCalendar() {
    this.fcalendar.push({
      start: moment().format(), 
      duration:'', 
      recurring: false,
      static: false,
      location: 'Enlighten App', 
      notes: 'Calendar slot', 
      title: 'Enlighten Tutoring Session'
    })
  }

  delete (key) {
    firebase.database().ref(`/calendar_tutors/${this.user.uid}/${key}`).remove()
    firebase.database().ref(`/calendar_tutors_unbooked/${this.user.uid}/${key}`).remove()
  }

}
