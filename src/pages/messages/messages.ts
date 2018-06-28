import { Component } from '@angular/core'
import { Events } from 'ionic-angular'
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular'
import * as firebase from 'firebase/app'
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database'
import { Observable } from 'rxjs/Observable'
import { DrawPage } from '../draw/draw'
import * as moment from 'moment'
/**
 * Generated class for the MessagesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
})

export class MessagesPage {
  private user
  private user1
  private user2
  private recipientId: string = ''
  private lessons_pending: FirebaseListObservable<any>
  private calendar_tutors_unbooked: FirebaseListObservable<any>
  private calendar_tutors: FirebaseListObservable<any>
  private upcoming_now_lessons: FirebaseListObservable<any>
  private hideTime = false
  private messageBox
  private sessions: Array<any> = []
  private sessionid: string = ''
  private session: any

  private messages = [
    {
      img: 'build/img/hugh.png',
      content: 'Hello from the other side.',
      senderName: 'Isaac',
      time: '28-Jul-2017 21:53',
      userId: 'abc'
    },
    {
        img: 'build/img/hugh.png',
        content: 'Hello from the this side.',
        senderName: 'Me',
        time: '05-Aug-2017 20:25',
        userId: 'def'
    }
  ]

  private rate = 100

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public events: Events, private af: AngularFireDatabase, 
    private toastCtrl: ToastController, private loadingCtrl: LoadingController) {
    this.user = navParams.get('user')

    if(this.user.rate) {
      this.rate = 100
    }

    this.recipientId = navParams.get('id')
    let env = this

    //GET TUTORS CALENDAR LIST
    this.calendar_tutors = this.af.list(`/calendar_tutors/${this.recipientId}`)
    this.calendar_tutors_unbooked = this.af.list(`/calendar_tutors_unbooked/${this.recipientId}`)

    this.af.list(`/calendar_tutors_unbooked/${this.recipientId}`, {preserveSnapshot: true})
      .subscribe(snapshots => {
        this.sessions = []
        snapshots.forEach(snapshot => {
          this.sessions.push({data:snapshot.val(), key: snapshot.key})
        })
      })    

    this.lessons_pending = af.list(`/lessons_pending_learners/${this.user.uid}`)
    this.upcoming_now_lessons = af.list(`/lessons_upcoming_now_tutors/${this.recipientId}/`)

    firebase.database().ref(`/users_learners/${this.user.uid}`).once('value').then(res => {
      env.user1 = res.val()
    }).catch(error => {
      console.warn(error)
    })

    firebase.database().ref(`/users_tutors/${this.recipientId}`).once('value').then(res => {
      env.user2 = res.val()
    })

    this.events.publish('globals:update', this.user, 'learner')
  }

  private loader = this.loadingCtrl.create({
    content: "Booking lesson...",
    duration: 5000
  })

  getIndex () {
    return this.sessions.findIndex(e => e.key == this.sessionid)
  }

  sendMessage (text) {
    var obj = {
      img: 'none',
      content: text,
      senderName: 'Me',
      time: 'now',
      userId: 'abc'
    }

    this.messages.push(obj)
    this.messageBox = ""
  }

  closeKeyboard () {

  }

  select (session) {
    this.session = session
  }

  toast (tempmsg = 'Lesson request has been sent to the tutor!') {
    if(this.rate < 50) {
      tempmsg = 'The lesson has successfully been booked! Lesson starts ' + moment(this.session.start).fromNow() + ' time'
    }  

    let toast = this.toastCtrl.create({
      message: tempmsg,
      duration: 5000,
      position: 'bottom',
    })

    toast.present()
    this.navCtrl.pop()
  }

  book (session, id) {
    this.session = session
    this.sessionid = id
    this.loader.present()
    if (this.session !== null && this.session !== undefined) {

      let rate = this.user1.priority || 100
      if (session.start !== null && session.duration !== null) {
        this.createLessonRequest(this.sessionid, this.session.start, this.session.duration, rate)
          .then(() => {
            if (rate < 40) {
              this.acceptLesson(this.sessionid, this.user.uid, this.recipientId)
            }
          })
      } else {
        this.loader.dismiss()
        this.toast('Please wait until the tutor completes the lesson')
      }
      
    } else {
      this.loader.dismiss()
    }
  }

  acceptLesson (lessonid, learnerid, tutorid) {
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

    firebase.database().ref(`/lessons_pending_tutors_learners/${this.user.uid}/${learnerid}/${lessonid}`).remove()
  }

  createLessonRequest (sessionId, start, duration, rate) {
    return new Promise((resolve, reject) => {

      // Pending entry in student lessons
      firebase.database().ref(`/lessons_pending_learners/${this.user.uid}/${sessionId}`).update({
        title: 'Physics',
        start: start,
        grade: this.user1.grade,
        subtitle: '...',
        duration: duration,
        tutorname: this.user2.name + ' ' + this.user2.lastname,
        imageurl: this.user2.imageurl,
        institution: this.user2.institution,
        type: 'single',
        tutorid: this.recipientId,
        price: duration*100/60
      }).catch(err => {
        this.loader.dismiss()
        reject(err)
      })

      // Pending entry in tutors lessons
      firebase.database().ref(`/lessons_pending_tutors/${this.recipientId}/${sessionId}`).update({
        title: 'Physics',
        start: start,
        subtitle: '...',
        duration: duration,
        learnername: this.user1.name + ' ' + this.user1.lastname,
        rate: rate,
        imageurl: this.user1.imageurl,
        school: this.user1.school,
        type: 'single',
        grade: this.user1.grade,
        learnerid: this.user.uid,
        price: duration*100/60
      }).then(res => {
        this.toast()
        this.loader.dismiss()
      }).catch(err => {
        this.loader.dismiss()
        reject(err)
      })

      // Joint entry
      firebase.database().ref(`/lessons_pending_tutors_learners/${this.recipientId}/${this.user.uid}/${sessionId}`).set(true)
      
      // Ensure single bookings
      firebase.database().ref(`/calendar_tutors/${this.recipientId}/${sessionId}`).update({
          booked: true
      })

      //Remove booked lessions from available/unbooked lessons
      firebase.database().ref(`/calendar_tutors_unbooked/${this.recipientId}/${sessionId}`)
        .remove()
        .then(() => {
          resolve({})
        })
    })
  }

  beginClass () {
    this.navCtrl.setRoot(DrawPage,{user: this.user, target: this.recipientId})
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagesPage')
  }
}
