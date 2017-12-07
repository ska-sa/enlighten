import { Component, ViewChild } from '@angular/core';
import { Events } from 'ionic-angular';
import { Platform, MenuController, Nav, ToastController } from 'ionic-angular';
import { ScreenOrientation } from 'ionic-native';


import { HomePage } from '../pages/home/home';
import { ProfilePage } from '../pages/profile/profile';
import { TutorsPage } from '../pages/tutors/tutors';
import { ClassmenuPage } from '../pages/classmenu/classmenu';
import { LogoutPage } from '../pages/logout/logout';
import { AppointmentsPage } from '../pages/appointments/appointments';
import { WalletPage } from '../pages/wallet/wallet';
import { SettingsPage } from '../pages/settings/settings';
import { UserselectionPage } from '../pages/userselection/userselection';
import { LessonPage } from '../pages/lesson/lesson';
import { VideocallPage } from '../pages/videocall/videocall';
/* THESE ARE ALL THE TUTOR PAGES */
import { TutorhomePage } from '../pages/tutorhome/tutorhome';
import { TutorprofilePage } from '../pages/tutorprofile/tutorprofile';
import { TutorsettingsPage } from '../pages/tutorsettings/tutorsettings';
import { CreateclassPage } from '../pages/createclass/createclass';
import { TutorclassesPage } from '../pages/tutorclasses/tutorclasses';
import { TutorclassmenuPage } from '../pages/tutorclassmenu/tutorclassmenu';
import { DrawPage } from '../pages/draw/draw';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireAuth } from 'angularfire2/auth';
import { GooglePlus } from '@ionic-native/google-plus';

import { NativeStorage } from '@ionic-native/native-storage';
import {WebRTCConfig} from './common/webrtc.config';
import {WebRTCService} from './common/webrtc.service';
import * as firebase from 'firebase/app'
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage =DrawPage;
  //rootPage = LogoutPage;
  tutorsPage;                             
  profilePage;
  appointmentsPage;
  classmenuPage;
  walletPage;
  settingsPage;
  logoutPage;
  userselectionPage;
  tutorsettingsPage;
  tutorprofilePage;
  createclassPage;
  tutorclassesPage;
  tutorclassmenuPage;
  lessonPage;
  drawPage;
  videocallPage;

  private displayName: string;
  private type: string;
  private profPic: string;
  private page: string;
  private user: any = {photoURL: '', displayName: '',uid: ''};
  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public events: Events, public nativeStorage: NativeStorage,
    public webRTC: WebRTCService,
    private toastCtrl: ToastController,
    private fireAuth: AngularFireAuth,
    private googlePlus: GooglePlus
  ) {
    this.initializeApp();
    this.userselectionPage = UserselectionPage;

    
    
    events.subscribe('globals:update', (user, type) => {
        this.setGlobals(user, type);
    });
  }

  setGlobals(user, type) {
    this.user = user;
    this.type = type;
  }


  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.splashScreen.hide();
      this.tutorsPage = TutorsPage;
      this.profilePage = ProfilePage;
      this.classmenuPage = ClassmenuPage;
      this.logoutPage = LogoutPage;
      this.appointmentsPage = AppointmentsPage;
      this.walletPage = WalletPage;
      this.settingsPage = SettingsPage;
      this.drawPage = DrawPage;
      this.statusBar.styleDefault();
      this.videocallPage = VideocallPage;
      this.tutorsettingsPage = TutorsettingsPage;
      this.tutorprofilePage = TutorprofilePage;
      this.createclassPage = CreateclassPage;
      this.tutorclassesPage = TutorclassesPage;
      this.tutorclassmenuPage = TutorclassmenuPage;
      this.lessonPage = LessonPage;
      
      this.nativeStorage.getItem('user-info').then(data => {
        this.type = data.type;
        this.user = data.user;     
      })

      this.platform.pause.subscribe(()=>{
        if(this.type == 'tutor') {
          firebase.database().ref(`users_tutors/${this.user.uid}`).update({
            status: 'away'
          })
        }  
      })

      this.platform.resume.subscribe(()=>{
        if(this.type == 'tutor') {
          firebase.database().ref(`users_tutors/${this.user.uid}`).update({
            status: 'online'
          })
        }  
      })

      //this.initfireBase(); 
    });
  }

  initfireBase(){
    if(this.platform.is('cordova')){
      this.fireAuth.authState.subscribe(user => {
        if (user){
          this.user = user;
          firebase.database().ref(`users_global/${user.uid}`).once('value').then(res => {
            this.type = res.val().type;
          })
          /*firebase.database().ref(`users/${user.uid}`).update({
            photoUrl: user.photoURL != null? user.photoURL: 'http://rydwith.com/images/avatar.png',
            email: user.email,
            timestamp: (new Date()).getTime(),
            displayName: user.displayName != null? user.displayName: 'Awesome Person',
            cellphoneNumber: '+27'
          })*/

          let tempmsg = 'Welcome ' + this.user.displayName;
          
          let toast = this.toastCtrl.create({
            message: tempmsg,
            duration: 2000,
            position: 'top',
          });
          toast.present();

          toast.onDidDismiss(()=>{
            if(this.type =='learner') {
              this.nav.setRoot(HomePage,{user:user, guser: this.user, data: {}}, {animate: true, direction: 'forward', animation: 'md-transition', duration: 500}).then(()=>{
                this.nav.popToRoot();
              });
            } else {
              this.nav.setRoot(TutorhomePage,{
      user: this.user, guser: this.user, data: {}}, {animate: true, direction: 'forward', animation: 'md-transition', duration: 500}).then(()=>{
                this.nav.popToRoot();
              });
            } 
          });
        } else {
          this.nav.setRoot(LogoutPage);
        }
      });

      //this.silentLogin();
    }
  }

  logout() {
    this.menu.close();
    this.nav.push(this.logoutPage);
  }

  returnState() {
    var state;
    if(this.page == 'menu') {
      state = 'block'
    } else {
      state = 'none'
    }
    return state;
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    if(page == this.logoutPage) {
      this.fireAuth.auth.signOut();
      this.googlePlus.logout();
    }
    
    // navigate to the new page if it is not the current page
    this.nav.push(page,{user: this.user, type: this.type});
  }


}
