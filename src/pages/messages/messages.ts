import { Component } from '@angular/core';
import { Events } from 'ionic-angular';
import { NavController, NavParams } from 'ionic-angular';
import * as firebase from 'firebase/app';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { DrawPage } from '../draw/draw';
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
  private upcoming_now_lessons: FirebaseListObservable<any>;
  private hideTime = false;
  private messageBox;
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
    private af: AngularFireDatabase) {
    this.user = navParams.get('user');
    this.recipientId = navParams.get('id');
    let env = this;
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

  beginClass() {
    this.navCtrl.setRoot(DrawPage,{user: this.user, target: this.recipientId});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagesPage');
  }

}
