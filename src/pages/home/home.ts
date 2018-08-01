import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ToastController, AlertController, Loading, LoadingController, MenuController } from 'ionic-angular';
import { TutorAccess } from '../../app/services/tutor-data/tutor.data';
import { Events } from 'ionic-angular';
import { LessonPage } from '../lesson/lesson';
import { MessagesPage } from '../messages/messages';
import { NativeStorage } from '@ionic-native/native-storage';
import * as firebase from 'firebase/app';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';

//Importing pages

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  loader: Loading;
  private ftutors: FirebaseListObservable<any>;
  private lessons_upcoming_now: FirebaseListObservable<any>;
  private lessonPage;
  private messagesPage;
  private user: any = {uid:'', displayName: '', photoURL: ''};
  private first: boolean = false;
  
  constructor(
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private tutorAccess: TutorAccess,
    private menuController: MenuController,
    public loadingCtrl: LoadingController,
    public events: Events, private navParams: NavParams, 
    private af: AngularFireDatabase, private nativeStorage: NativeStorage) {
      this.user = navParams.get('user');
      this.nativeStorage.setItem('user-info', {user: this.user, type: 'learner'});
      this.lessons_upcoming_now = af.list(`/lessons_upcoming_now_learners/${this.user.uid}`, {query: {limitToFirst: 1}});
      this.ftutors = af.list(`/users_tutors`);
      this.lessonPage = LessonPage;
      this.messagesPage = MessagesPage;
  }
  
  ngOnInit() {

  }

  changePage(page, object, start) {
    this.navCtrl.push(page, {user: this.user, target: object.tutorid, start: start, type:'learner', object: object});
  }
  
  ionViewDidLoad() {
    this.menuController.enable(true, 'myMenu');
    console.log('ionViewDidLoad ProfilePage');
  }

  endGuide() {
    this.first = false;
    firebase.database().ref(`users_global/${this.user.uid}`).update({
      first: false
    })
  }

  viewTutor(id) {
    this.navCtrl.push(this.messagesPage, {user: this.user,id: id});
  }

  private presentToast(message: string) {
    this.toastCtrl.create({message: message, duration: 2000}).present();
  }

  private initLoader() {
    this.loader = this.loadingCtrl.create({
      content: "Loading items..."
    });
  }

  
}
