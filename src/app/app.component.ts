import { Component, ViewChild } from '@angular/core';
import { Events } from 'ionic-angular';
import { Platform, MenuController, Nav } from 'ionic-angular';
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

/* THESE ARE ALL THE TUTOR PAGES */
import { TutorhomePage } from '../pages/tutorhome/tutorhome';
import { TutorprofilePage } from '../pages/tutorprofile/tutorprofile';
import { TutorsettingsPage } from '../pages/tutorsettings/tutorsettings';
import { CreateclassPage } from '../pages/createclass/createclass';
import { TutorclassesPage } from '../pages/tutorclasses/tutorclasses';
import { TutorclassmenuPage } from '../pages/tutorclassmenu/tutorclassmenu';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage = LogoutPage;
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

  private displayName: string;
  private type: string;
  private profPic: string;
  private page: string;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public events: Events
  ) {
    this.initializeApp();
    this.userselectionPage = UserselectionPage;
    
    events.subscribe('globals:update', (type,name,picture="assets/img/man.png",page="nomenu") => {
      this.setGlobals(type,name,picture,page);
    });
  }

  setGlobals(type=this.type,name=this.displayName,picture = "assets/img/man.png",page= "nomenu") {
    this.type = type;
    this.page = page;
    this.displayName = name;
    this.profPic = picture;
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
      this.statusBar.styleDefault();
      
      this.tutorsettingsPage = TutorsettingsPage;
      this.tutorprofilePage = TutorprofilePage;
      this.createclassPage = CreateclassPage;
      this.tutorclassesPage = TutorclassesPage;
      this.tutorclassmenuPage = TutorclassmenuPage;
      this.lessonPage = LessonPage;
    });
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
    
    // navigate to the new page if it is not the current page
    this.nav.push(page,{},{animate: true});
  }

}
