import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from 'ionic-native';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ProfilePage } from '../pages/profile/profile';
import { TutorsPage } from '../pages/tutors/tutors';
import { ClassmenuPage } from '../pages/classmenu/classmenu';
import { MyclassesPage } from '../pages/myclasses/myclasses';
import { ClassbrowsePage } from '../pages/classbrowse/classbrowse';
import { LogoutPage } from '../pages/logout/logout';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { RegisterPage } from '../pages/register/register';
import { AppointmentsPage } from '../pages/appointments/appointments';
import { WalletPage } from '../pages/wallet/wallet';
import { SettingsPage } from '../pages/settings/settings';
import { UserselectionPage } from '../pages/userselection/userselection';
import { TutorregisterPage } from '../pages/tutorregister/tutorregister';
import { ParentregisterPage } from '../pages/parentregister/parentregister';

/* THESE ARE ALL THE TUTOR PAGES */
import { TutorhomePage } from '../pages/tutorhome/tutorhome';
import { TutorprofilePage } from '../pages/tutorprofile/tutorprofile';
import { TutorsettingsPage } from '../pages/tutorsettings/tutorsettings';
import { CreateclassPage } from '../pages/createclass/createclass';
import { TutorclassesPage } from '../pages/tutorclasses/tutorclasses';
import { RequestsPage } from '../pages/requests/requests';
import { TutorclassmenuPage } from '../pages/tutorclassmenu/tutorclassmenu';

import { LessonPage } from '../pages/lesson/lesson';
import { ClassroomPage } from '../pages/classroom/classroom';
import { MessagesPage } from '../pages/messages/messages';


import { TodoService, TodoLocalStorageService } from "./services/todo/todo";
import { TutorAccess } from './services/tutor-data/tutor.data';
import { userAccess } from './services/users/users';
import { allUsers } from './services/users/allusers';
import { InstitutionsAccess } from './services/institutions/institutions';
import { SubjectsAccess } from './services/subjects/subjects';
import { AppointmentAccess } from './services/appointment-data/appointment-data';

import { Calendar } from '@ionic-native/calendar';
import { CalendarComponent } from '../components/calendar/calendar';


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
    CalendarComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
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
    MessagesPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    TodoService,
    TodoLocalStorageService,
    TutorAccess,
    userAccess,
    allUsers,
    AppointmentAccess,
    InstitutionsAccess,
    SubjectsAccess,
    ScreenOrientation,
    Calendar,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
