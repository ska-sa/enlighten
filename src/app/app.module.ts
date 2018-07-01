import { BrowserModule } from '@angular/platform-browser'
import { NgModule, ErrorHandler, Injectable, Injector } from '@angular/core'
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular'
import { StatusBar } from '@ionic-native/status-bar'
import { SplashScreen } from '@ionic-native/splash-screen'
import { ScreenOrientation } from 'ionic-native'
import { Pro } from '@ionic/pro';

import { MyApp } from './app.component'
import { HomePage } from '../pages/home/home'
import { ProfilePage } from '../pages/profile/profile'
import { TutorsPage } from '../pages/tutors/tutors'
import { ClassmenuPage } from '../pages/classmenu/classmenu'
import { MyclassesPage } from '../pages/myclasses/myclasses'
import { ClassbrowsePage } from '../pages/classbrowse/classbrowse'
import { LogoutPage } from '../pages/logout/logout'
import { LoginPage } from '../pages/login/login'
import { SignupPage } from '../pages/signup/signup'
import { RegisterPage } from '../pages/register/register'
import { AppointmentsPage } from '../pages/appointments/appointments'
import { WalletPage } from '../pages/wallet/wallet'
import { SettingsPage } from '../pages/settings/settings'
import { UserselectionPage } from '../pages/userselection/userselection'
import { TutorregisterPage } from '../pages/tutorregister/tutorregister'
import { ParentregisterPage } from '../pages/parentregister/parentregister'

import { VideocallPage } from '../pages/videocall/videocall'
/* THESE ARE ALL THE TUTOR PAGES */
import { TutorhomePage } from '../pages/tutorhome/tutorhome'
import { TutorprofilePage } from '../pages/tutorprofile/tutorprofile'
import { TutorsettingsPage } from '../pages/tutorsettings/tutorsettings'
import { CreateclassPage } from '../pages/createclass/createclass'
import { TutorclassesPage } from '../pages/tutorclasses/tutorclasses'
import { RequestsPage } from '../pages/requests/requests'
import { TutorclassmenuPage } from '../pages/tutorclassmenu/tutorclassmenu'
import { DrawPage } from '../pages/draw/draw'
import { TutorschedulePage } from '../pages/tutorschedule/tutorschedule'
import { TutorsubjectsPage } from '../pages/tutorsubjects/tutorsubjects'

import { LessonPage } from '../pages/lesson/lesson'
import { ClassroomPage } from '../pages/classroom/classroom'
import { MessagesPage } from '../pages/messages/messages'

import { NativeStorage } from '@ionic-native/native-storage'
import { GooglePlus } from '@ionic-native/google-plus'
import { Facebook } from '@ionic-native/facebook'

import { AngularFireModule } from 'angularfire2'
import { AngularFireDatabaseModule } from 'angularfire2/database'
import { AngularFireAuthModule } from 'angularfire2/auth'
import { Firebase } from '@ionic-native/firebase'

import { TutorAccess } from './services/tutor-data/tutor.data'
import { userAccess } from './services/users/users'
import { allUsers } from './services/users/allusers'
import { InstitutionsAccess } from './services/institutions/institutions'
import { SubjectsAccess } from './services/subjects/subjects'
import { AppointmentAccess } from './services/appointment-data/appointment-data'

import { Calendar } from '@ionic-native/calendar'
import { CalendarComponent } from '../components/calendar/calendar'
import { CanvasDrawComponent } from '../components/canvas-draw/canvas-draw'

import { HttpModule } from '@angular/http'

import { NativeAudio } from '@ionic-native/native-audio'
import { WebRTCConfig } from './common/webrtc.config'
import { WebRTCService } from './common/webrtc.service'
import { AndroidPermissions } from '@ionic-native/android-permissions'
import { TolocalPipe } from '../pipes/tolocal/tolocal'

import { SocialSharing } from '@ionic-native/social-sharing'


export const environment = {
  production: false, 
  firebase: {
    apiKey: "AIzaSyD2no81K7g1u8W9_X4GQP3SRt24ScH_St0",
    authDomain: "enlighten-175514.firebaseapp.com",
    databaseURL: "https://enlighten-175514.firebaseio.com",
    projectId: "enlighten-175514",
    storageBucket: "enlighten-175514.appspot.com",
    messagingSenderId: "745996686081"
  }
}

Pro.init('24006E0D', {
  appVersion: '1.0'
})

@Injectable()
export class MyErrorHandler implements ErrorHandler {
  ionicErrorHandler: IonicErrorHandler;

  constructor(injector: Injector) {
    try {
      this.ionicErrorHandler = injector.get(IonicErrorHandler);
    } catch(e) {
      // Unable to get the IonicErrorHandler provider, ensure
      // IonicErrorHandler has been added to the providers list below
    }
  }

  handleError(err: any): void {
    Pro.monitoring.handleNewError(err);
    // Remove this if you want to disable Ionic's auto exception handling
    // in development mode.
    this.ionicErrorHandler && this.ionicErrorHandler.handleError(err);
  }
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ProfilePage,
    TutorsPage,
    ClassmenuPage,
    MyclassesPage,
    ClassbrowsePage,
    LogoutPage,
    LoginPage,
    SignupPage,
    RegisterPage,
    AppointmentsPage,
    WalletPage,
    SettingsPage,
    UserselectionPage,
    TutorregisterPage,
    ParentregisterPage,
    TutorhomePage,
    TutorprofilePage,
    TutorsettingsPage,
    CreateclassPage,
    TutorclassesPage,
    RequestsPage,
    TutorclassmenuPage,
    LessonPage,
    ClassroomPage,
    MessagesPage,
    CalendarComponent,
    CanvasDrawComponent,
    DrawPage,
    VideocallPage,
    TutorschedulePage,
    TolocalPipe,
    TutorsubjectsPage
  ],
  imports: [
    HttpModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ProfilePage,
    TutorsPage,
    ClassmenuPage,
    MyclassesPage,
    ClassbrowsePage,
    LogoutPage,
    LoginPage,
    SignupPage,
    RegisterPage,
    AppointmentsPage,
    WalletPage,
    SettingsPage,
    UserselectionPage,
    TutorregisterPage,
    ParentregisterPage,
    TutorhomePage,
    TutorprofilePage,
    TutorsettingsPage,
    CreateclassPage,
    TutorclassesPage,
    RequestsPage,
    TutorclassmenuPage,
    LessonPage,
    ClassroomPage,
    MessagesPage,
    DrawPage,
    VideocallPage,
    TutorschedulePage,
    TutorsubjectsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    TutorAccess,
    userAccess,
    allUsers,
    AppointmentAccess,
    InstitutionsAccess,
    SubjectsAccess,
    ScreenOrientation,
    Calendar,
    NativeStorage,
    NativeAudio,
    GooglePlus,
    Facebook,
    WebRTCConfig,
    WebRTCService,
    AndroidPermissions,
    Firebase,
    SocialSharing,
    {provide: ErrorHandler, useClass: MyErrorHandler }
  ]
})

export class AppModule {}