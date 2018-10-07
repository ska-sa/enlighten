import { Component } from '@angular/core'

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database'
import { AngularFireAuth } from 'angularfire2/auth'
import { Observable } from 'rxjs/Observable'
import * as firebase from 'firebase/app'

import { NavController, NavParams, AlertController, MenuController, LoadingController, Platform, ToastController } from 'ionic-angular'
import { HomePage } from '../home/home'
import { TutorhomePage } from '../tutorhome/tutorhome'
import { userAccess } from '../../app/services/users/users'
import { Events } from 'ionic-angular'

import { AuthProvider } from '../../providers/auth/auth'

import 'rxjs/Rx'

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  private currentUser
  private gUser
  private authState
  private user
  private email: string = ''
  private password: string = ''
  private password2: string = ''
  //todelete
  private test: string = 'test'

  public cellNo: string
  public userData
  private pass: string
  private users
  private authSub: any;

  constructor(public navCtrl: NavController, private events: Events, private authProvider: AuthProvider) { //

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage')
  }


  gg () {
    this.authProvider.googleLogin()
  }

  fb () {
    this.authProvider.facebookLogin()
  }

  signin () {
    this.authProvider.emailLogin(this.email, this.password)
  }

  subscribeToAuthState () {
    this.events.subscribe('globals:update', (user, type) => {
      this.user = user
      this.gUser = user
      this.proceedToRoot({}, type)
    })
  }

  proceedToRoot(data, type) {
    if (type === 'tutor') {
      this.navCtrl.setRoot(TutorhomePage, {
        user: this.user,
        guser: this.gUser
      })
    } else if (type === 'learner') {
      this.navCtrl.setRoot(HomePage, {
        user: this.user,
        guser: this.gUser,
        data: data
      })
    } else if(type === 'parent') {
      this.navCtrl.setRoot(HomePage,{
        user: this.user,
        guser: this.gUser,
        data: data
      })
    }
  }
}
