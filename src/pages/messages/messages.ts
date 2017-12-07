import { Component } from '@angular/core';
import { Events } from 'ionic-angular';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import * as firebase from 'firebase/app';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { DrawPage } from '../draw/draw';
import * as moment from 'moment';
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
  private user;
  private user1;
  private user2;
  private recipientId: string = '';
  private lessons_pending: FirebaseListObservable<any>;
  private calendar_tutors_unbooked: FirebaseListObservable<any>;
  private calendar_tutors: FirebaseListObservable<any>
  private upcoming_now_lessons: FirebaseListObservable<any>;
  private hideTime = false;
  private messageBox;
  private sessions: Array<any> = [];
  private sessionid: string = '';
  private session: any;
  private messages = [{
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
 
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public events: Events, 
    private af: AngularFireDatabase, private toastCtrl: ToastController) {
    this.user = navParams.get('user');
    this.recipientId = navParams.get('id');
    let env = this;

    //GET TUTORS CALENDAR LIST
    this.calendar_tutors = this.af.list(`/calendar_tutors/${this.recipientId}`);
    this.calendar_tutors_unbooked = this.af.list(`/calendar_tutors_unbooked/${this.recipientId}`);
    this.af.list(`/calendar_tutors_unbooked/${this.recipientId}`, {preserveSnapshot: true})
                .subscribe(snapshots => {
                  this.sessions = [];
                  snapshots.forEach(snapshot => {
                    this.sessions.push({data:snapshot.val(), key: snapshot.key});
                  })
                })    

    this.lessons_pending = af.list(`/lessons_pending_learners/${this.user.uid}`);
    this.upcoming_now_lessons = af.list(`/lessons_upcoming_now_tutors/${this.recipientId}/`);
    firebase.database().ref(`/users_learners/${this.user.uid}`).once('value').then(res => {
      env.user1 = res.val();
    }).catch(err => {
      alert(err);
      alert(JSON.stringify(err));
    })
    firebase.database().ref(`/users_tutors/${this.recipientId}`).once('value').then(res => {
      env.user2 = res.val();
    })
    this.events.publish('globals:update', this.user, 'learner');
  }

  getIndex() {
    return this.sessions.findIndex(e => e.key == this.sessionid);
  }

  sendMessage(text) {
    var obj = {
      img: 'none',
      content: text,
      senderName: 'Me',
      time: 'now',
      userId: 'abc'
    }
    this.messages.push(obj);

    this.messageBox = "";
  }

  closeKeyboard() {

  }

  select(session) {
    this.session = session;
  }

  toast() {
    let tempmsg = 'The lesson has successfully been booked! Lesson starts ' + moment(this.session.start).fromNow() + ' time';
          
          let toast = this.toastCtrl.create({
            message: tempmsg,
            duration: 10000,
            position: 'top',
          });
          toast.present();
          this.navCtrl.pop();
  }

  book() {
    this.session = this.sessions[this.getIndex()].data;
    alert(JSON.stringify(this.session));
    if(this.session != null && this.session != undefined) {
      let sessionId = this.sessionid;
      let start = this.session.start;
      let duration = this.session.duration;
      firebase.database().ref(`/lessons_pending_learners/${this.user.uid}/${sessionId}`).update({
          title: 'Physics',
          start: start,
          grade: this.user1.grade,
          subtitle: 'Newtonian Mechanics',
          duration: duration,
          tutorname: this.user2.name + ' ' + this.user2.lastname,
          imageurl: this.user2.imageurl,
          institution: this.user2.institution,
          type: 'single',
          tutorid: this.recipientId,
          price: duration*100/60
      })
      firebase.database().ref(`/lessons_pending_tutors/${this.recipientId}/${sessionId}`).update({
          title: 'Physics',
          start: start,
          subtitle: 'Newtonian Mechanics',
          duration: duration,
          learnername: this.user1.name + ' ' + this.user1.lastname,
          imageurl: this.user1.imageurl,
          school: this.user1.school,
          type: 'single',
          grade: this.user1.grade,
          learnerid: this.user.uid,
          price: duration*100/60
      }).then(res => {
        this.toast();
      })
      firebase.database().ref(`/lessons_pending_tutors_learners/${this.recipientId}/${this.user.uid}/${sessionId}`).set(true);
      //this means we can only book one at a time
      firebase.database().ref(`/calendar_tutors/${this.recipientId}/${sessionId}`).update({
          booked: true
      })
      firebase.database().ref(`/calendar_tutors_unbooked/${this.recipientId}/${sessionId}`).remove();
    }
    
    }

  beginClass() {
    this.navCtrl.setRoot(DrawPage,{user: this.user, target: this.recipientId});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagesPage');
  }

}
