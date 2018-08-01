import { Injectable } from '@angular/core';
import { LoadingController, Platform, ToastController } from 'ionic-angular'
import 'rxjs/add/operator/map';

import { GooglePlus } from '@ionic-native/google-plus'
import { Facebook } from '@ionic-native/facebook'
import { NativeStorage } from '@ionic-native/native-storage'
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database'
import { AngularFireAuth } from 'angularfire2/auth'
import { Observable } from 'rxjs/Observable'
import * as firebase from 'firebase/app'
import { Events } from 'ionic-angular'
import { Firebase } from '@ionic-native/firebase'
/*
  Generated class for the AuthProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class AuthProvider {
  public user: any
  public firebaseUser: any

  public authState: any
  private authSub: any
  private type: string

  constructor(private googlePlus: GooglePlus, private facebook: Facebook,
    private toastCtrl: ToastController, public loadingCtrl: LoadingController, 
    private platform: Platform, private nativeStorage: NativeStorage,
    public afAuth: AngularFireAuth, private events: Events, private fcm: Firebase) {
    console.log('Hello AuthProvider Provider');
    this.authState = this.afAuth.authState
    this.subscribeToAuthState()
  }

  // AUTHSTATE SUBSCRIPTION

  subscribeToAuthState () {
    this.authSub = this.authState.subscribe(user => {
      if (user) {
        this.user = user
        this.nativeStorage.clear()

        const type = firebase.database().ref(`/users_global/${user.uid}/type`).once('value').then(res => {
          if (res.val() !== null) {
            this.type = res.val()

            this.nativeStorage.setItem('user-info', { 
              user: user,
              type: res
            })

            this.events.publish('globals:update', this.user, this.type)
            this.loader.dismiss()
          } else {
            this.toast('You have not yet created an account. Please register')
            this.loader.dismiss()
          }
        })
      } else {
        this.user = null
      }
    })
  }

  logout() {
    this.authSub.unsubcribe()
    this.afAuth.auth.signOut()
    this.googlePlus.logout()
    this.facebook.logout()
  }

  getType() {
    /*return new Promise((resolve, reject) => {
      firebase.database().ref(`users_global/${this.user.uid}`).once('value').then(res => {
        if (res.val()) {
          resolve(res.val().type)
        } else {
          reject('User type not found')
        }
      }).catch(err => {
        reject(err)
      })
    })*/
    return this.type
  }

  // LOGIN METHODS
  googleLogin () {
    this.loader.present()
    this.googlePlus.login({
      'webClientId': '745996686081-modil5qum4720gdi6ma9p2gl6b1vflaf.apps.googleusercontent.com',
      'offline': true
    }).then((success) =>{
      this.resolveGoogleLogin(success)
    }).catch((err) => {
      this.rejectGoogleLogin(err)
    })
  }

  facebookLogin(): Promise<any> {
    if(this.platform.is('cordova')){
      this.loader.present()
      return this.facebook.login(['email']).then( response => {
        const facebookCredential = firebase.auth.FacebookAuthProvider
          .credential(response.authResponse.accessToken)
        
        this.firebaseSocialAuth(facebookCredential, 'fb')
      }).catch((error) => { 
        this.toast(error) 
      })
    }
  }

  emailLogin (email, password) {
    this.loader.present()
    const cleanEmail = email.split(' ').join('')
    let type = ''

    firebase.auth().signInWithEmailAndPassword(cleanEmail, password).then(user => {
      this.authState = this.afAuth.authState
      this.user = user
    }).catch(err => {
      this.toast('Cannot sign you in')
      this.loader.dismiss()
      this.toast(err)
    })
  }

  // LOGIN RESOLVERS
  resolveGoogleLogin (result) {
    this.loader.dismiss()
    this.firebaseSocialAuth(result)
  }

  rejectGoogleLogin (err) {
    this.loader.dismiss()
    this.toast(`We could not log you in at this time. Code: ${err}`)
  }

  // SIGN UP METHODS
  emailRegister(email, password, type) {
    this.loader.present()
    const cleanEmail = email.split(' ').join('')

    firebase
      .auth()
      .createUserWithEmailAndPassword(cleanEmail, password)
      .then( user => {
        this.user = user

        this.fcm.getToken().then(token => {
          firebase.database().ref(`/users_tokens/${user.uid}`).update({[token]:true})   
        })

        this.fcm.onTokenRefresh()
          .subscribe((token: string) =>  firebase.database().ref(`/users_tokens/${user.uid}`).update({[token]:true}) )
        
        this.events.publish('globals:update', user, type)
        this.loader.dismiss()
      }).catch(err => {
        this.loader.dismiss()
        this.toast(err.message)
      })
  }

  // FIREBASE AUTHORIZATION
  firebaseSocialAuth (successuser, type = 'gg') {
    this.firebaseUser = successuser
    let credential

    if(type === 'gg') {
      credential = firebase.auth.GoogleAuthProvider.credential(
              successuser.idToken)
    } else {
      credential = successuser
    }

    let env = this

    firebase.auth().signInWithCredential(credential).then((result) => {
      var user = result
      this.user = user
      env.loader.present()
      env.authState = env.afAuth.authState
    })
  }

  // ALERT CONTROLLERS
  toast (msg) {    
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 4000,
      position: 'top',
    })

    toast.present()
  }

  private loader = this.loadingCtrl.create({
      content: "Attempting to log you in..."
  })

  

}
