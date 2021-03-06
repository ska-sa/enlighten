import { Component, ViewChild } from '@angular/core'
import { Events } from 'ionic-angular'
import { Platform, MenuController, Nav, ToastController, AlertController } from 'ionic-angular'
import { ScreenOrientation } from 'ionic-native'

import { HomePage } from '../pages/home/home'
import { ProfilePage } from '../pages/profile/profile'
import { RegisterPage } from '../pages/register/register'
import { LoginPage } from '../pages/login/login'
import { TutorregisterPage } from '../pages/tutorregister/tutorregister'
import { TutorsPage } from '../pages/tutors/tutors'
import { MyclassesPage } from '../pages/myclasses/myclasses'
import { LogoutPage } from '../pages/logout/logout'
import { AppointmentsPage } from '../pages/appointments/appointments'
import { WalletPage } from '../pages/wallet/wallet'
import { SettingsPage } from '../pages/settings/settings'
import { UserselectionPage } from '../pages/userselection/userselection'
import { LessonPage } from '../pages/lesson/lesson'
import { VideocallPage } from '../pages/videocall/videocall'
import { TutorschedulePage } from '../pages/tutorschedule/tutorschedule'
import { TutorsubjectsPage } from '../pages/tutorsubjects/tutorsubjects'
/* THESE ARE ALL THE TUTOR PAGES */
import { TutorhomePage } from '../pages/tutorhome/tutorhome'
import { TutorprofilePage } from '../pages/tutorprofile/tutorprofile'
import { TutorsettingsPage } from '../pages/tutorsettings/tutorsettings'
import { CreateclassPage } from '../pages/createclass/createclass'
import { TutorclassesPage } from '../pages/tutorclasses/tutorclasses'
import { TutorclassmenuPage } from '../pages/tutorclassmenu/tutorclassmenu'
import { DrawPage } from '../pages/draw/draw'
import { StatusBar } from '@ionic-native/status-bar'
import { SplashScreen } from '@ionic-native/splash-screen'
import { AngularFireAuth } from 'angularfire2/auth'
import { GooglePlus } from '@ionic-native/google-plus'

import { NativeStorage } from '@ionic-native/native-storage'
import { WebRTCConfig } from './common/webrtc.config'
import { WebRTCService } from './common/webrtc.service'
import * as firebase from 'firebase/app'
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database'
import { LessonsProvider } from '../providers/lessons/lessons'
import { AuthProvider } from '../providers/auth/auth'

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav
  // rootPage = DrawPage
  rootPage = LogoutPage
  tutorsPage                             
  profilePage
  appointmentsPage
  myclassesPage
  walletPage
  settingsPage
  logoutPage
  userselectionPage
  tutorsettingsPage
  tutorprofilePage
  createclassPage
  tutorclassesPage
  tutorclassmenuPage
  lessonPage
  drawPage
  videocallPage
  tutorsubjectsPage
  tutorschedulePage
  registerPage = RegisterPage;
  tutorregisterPage = TutorregisterPage;

  private displayName: string
  private lessons: FirebaseListObservable<any>
  private type: string
  private profPic: string
  private page: string

  private user: any = {
    photoURL: '', 
    displayName: '',
    uid: ''
  }

  constructor (
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public events: Events, public nativeStorage: NativeStorage,
    public webRTC: WebRTCService,
    private toastCtrl: ToastController,
    private fireAuth: AngularFireAuth, private lessonsProvider: LessonsProvider,
    private googlePlus: GooglePlus, public alertCtrl: AlertController,
    private authProvider: AuthProvider
  ) {
    this.initializeApp()
    this.userselectionPage = UserselectionPage

    events.subscribe('globals:update', (user, type) => {
      this.setGlobals(user, type)
    })
  }

  setGlobals(user, type) {
    this.user = user
    this.type = type
  }


  initializeApp () {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      console.log('Platform ready')
      this.splashScreen.hide()
      this.tutorsPage = TutorsPage
      this.profilePage = ProfilePage
      this.myclassesPage = MyclassesPage
      this.logoutPage = LogoutPage
      this.appointmentsPage = AppointmentsPage
      this.walletPage = WalletPage
      this.settingsPage = SettingsPage
      this.drawPage = DrawPage
      this.statusBar.backgroundColorByHexString('#993333')
      this.videocallPage = VideocallPage
      this.tutorsettingsPage = TutorsettingsPage
      this.tutorprofilePage = TutorprofilePage
      this.createclassPage = CreateclassPage
      this.tutorclassesPage = TutorclassesPage
      this.tutorclassmenuPage = TutorclassmenuPage
      this.lessonPage = LessonPage
      this.tutorschedulePage = TutorschedulePage
      this.tutorsubjectsPage = TutorsubjectsPage

      this.nativeStorage.getItem('user-info').then(data => {
        this.type = data.type
        this.user = data.user     
      })

      this.platform.pause.subscribe(() => {
        if (this.type == 'tutor') {
          this.authProvider.updateConnect('away')
        }  
      })

      this.platform.resume.subscribe(() => {
        if (this.type == 'tutor') {
          this.authProvider.updateConnect('online')
        }  
      })

      firebase.database().ref('.info/connected').on('value', snapshot => {
        if (snapshot.val()) {
          this.authProvider.updateConnect('online')
          this.authProvider.updateDisconnect()
        } else {
          this.authProvider.updateConnect('offline')
        }
      })

      this.platform.registerBackButtonAction(() => {
        // Default action with the exception here
        let alert = this.alertCtrl.create({
          title: 'Exit app?',
          subTitle: 'Are you sure you\'d like to exit the app?',
          buttons: [
            {
              text: 'Yes',
              handler: () => {
                this.platform.exitApp()
                this.authProvider.updateConnect('offline')
              }
            },
            {
              text: 'No'
            }
          ]
        })

        if (!this.nav.canGoBack()) {
          alert.present()
        } 
      },)

      console.log('All subscriptions done. Initializing firebase')

      this.authProvider.subscribeToAuthState()
      this.initfireBase()
    })
  }

  initfireBase () {
    if(this.platform.is('cordova')) {
      this.fireAuth.authState.subscribe(user => {
        if (user) {
          this.user = user

          firebase.database().ref(`users_global/${user.uid}`).once('value').then(res => {
            this.type = res.val().type
            this.events.publish('globals:update', user, this.type)
            this.lessons = this.lessonsProvider.getUpcomingLessons(this.user, this.type)

            let tempmsg = 'Welcome ' + this.user.displayName ? this.user.displayName : ''
          
            this.toastMessage(tempmsg)

            if (firebase.auth().currentUser.emailVerified) {
              if (this.type == 'learner' && !(this.nav.last().instance instanceof RegisterPage)) {
                this.nav.setRoot(HomePage, {user:user, guser: this.user, data: {}}, {animate: true, direction: 'forward', animation: 'md-transition', duration: 500}).then(()=>{
                  this.nav.popToRoot()
                })
              } else if(!(this.nav.last().instance instanceof TutorregisterPage)) {
                this.nav.setRoot(TutorhomePage, {
                  user: this.user, 
                  guser: this.user, 
                  data: {}
                }, 
                {
                  animate: true, 
                  direction: 'forward', 
                  animation: 'md-transition', 
                  duration: 500
                }).then(() => {
                  this.nav.popToRoot()
                })
              }
            } else {
              this.toastMessage('Please accept the verification we\'ve sent to your email address')
              this.nav.popToRoot()
              this.nav.push(LoginPage)
            }
            
            
          })
 
          /*firebase.database().ref(`users/${user.uid}`).update({
            photoUrl: user.photoURL != null? user.photoURL: 'http://rydwith.com/images/avatar.png',
            email: user.email,
            timestamp: (new Date()).getTime(),
            displayName: user.displayName != null? user.displayName: 'Awesome Person',
            cellphoneNumber: '+27'
          })*/
          
        } else {
          this.nav.setRoot(LogoutPage)
        }
      })

      //this.silentLogin()
    } else {
      // this.nav.setRoot(HomePage, {user: this.user, guser: this.user})
    }
  }

  toastMessage(message) {
    let toast = this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'top',
    })

    toast.present()
  }

  logout () {
    this.menu.close()
    this.nav.push(this.logoutPage)
    this.fireAuth.auth.signOut()
    this.googlePlus.logout()
    this.nativeStorage.clear()
  }

  returnState () {
    var state

    if (this.page == 'menu') {
      state = 'block'
    } else {
      state = 'none'
    }

    return state
  }

  openPage (page) {
    // close the menu when clicking a link from the menu
    this.menu.close()

    // navigate to the new page if it is not the current page
    this.nav.push(page, {user: this.user, type: this.type}).then(() => {
      if (page == this.logoutPage) {
        this.fireAuth.auth.signOut()
        this.googlePlus.logout()
      }
    })
  }


}
