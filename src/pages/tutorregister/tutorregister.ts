import { Component, Inject } from '@angular/core'
import { NavController, NavParams, AlertController, LoadingController, ToastController, Platform } from 'ionic-angular'
import { FormsModule } from '@angular/forms'
import { InstitutionsAccess } from '../../app/services/institutions/institutions'
import { SubjectsAccess } from '../../app/services/subjects/subjects'
import { userAccess } from '../../app/services/users/users'
import { TutorhomePage } from '../tutorhome/tutorhome'

import 'rxjs/Rx'

import { Events } from 'ionic-angular'

import { NativeStorage } from '@ionic-native/native-storage'

import { GooglePlus } from '@ionic-native/google-plus'
import { Facebook } from '@ionic-native/facebook'

import * as firebase from 'firebase/app'
import 'firebase/messaging'
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database'
import { AngularFireAuth } from 'angularfire2/auth'
import { Observable } from 'rxjs/Observable'
import { FirebaseApp } from 'angularfire2'
import { Firebase } from '@ionic-native/firebase'

import { AuthProvider } from '../../providers/auth/auth'
/**
 * Generated class for the TutorregisterPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-tutorregister',
  templateUrl: 'tutorregister.html',
})
export class TutorregisterPage {
  browse: string = "info"
  users: userAccess
  subinterests: Array<any> = []

  private fname: string = ''
  private sname: string = ''
  private grd: string = ''
  private sch: string = ''
  private cell: string = ''
  private sub: string = ''
  private email: string = ''
  private password: string = ''
  private password2: string = ''
  private errors: any = {}

  private user
  private gUser
  private authState

  private type = "tutor"
  private institutions
  private subjects
  private ayos: string = ''
  private ins: string = ''
  private hq: string = ''
  private degree: string = ''

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public alertCtrl: AlertController,
    private institutionsAccess: InstitutionsAccess,
    private subjectsAccess: SubjectsAccess,
    public events: Events, 
    public loadingCtrl: LoadingController,
    private googlePlus: GooglePlus,
    public afAuth: AngularFireAuth, 
    private af: AngularFireDatabase,
    private nativeStorage: NativeStorage, private authProvider: AuthProvider,
    private toastCtrl: ToastController, private platform: Platform, private facebook: Facebook) {
      this.institutions = this.institutionsAccess.getUniversities()
      this.subjects = this.subjectsAccess.getSubjects()
      this.addsubinterest()
  }

  ionViewDidLoad() {
    this.subscribeToAuthState()
    console.log('ionViewDidLoad TutorregisterPage')
  }

  subscribeToAuthState () {
    this.events.subscribe('globals:update', (user, type) => {
      this.user = user
      this.gUser = user

      if(this.email.length < 1) {
        this.email = user.email
      }

      this.reg()
    })
  }

  toast(msg) {    
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 4000,
      position: 'top',
    })
    toast.present()
    this.password = ''
    this.password2 = ''
  }

  addsubinterest() {
    this.subinterests.push('')
  }

  next (s) {
    if (s === 'details') {
      if (this.verifyPage1()) {
        this.browse = s
      } else {
        this.showDeny('Required fields', 'Please make sure all the required fields are appropriately filled')
      }
    } else {
      if (this.verifyPage2()) {
        this.browse = s
      } else {
        this.showDeny('Required fields', 'Please make sure all the required fields are appropriately filled')
      }
    }
  }

  verifyPage1() {
    this.errors['fname'] = this.fname !== '' ? null : 'First name cannot be left empty'
    this.errors['sname'] = this.sname !== '' ? null : 'Last name cannot be left empty'
    return this.fname !== '' && this.sname !== '' && this.verifyNumber(this.cell, 'cell')
  }

  verifyPage2() {
    this.errors['institution'] = this.ins !== '' ? null : 'Institution cannot be left empty'
    return this.ins !== ''
  }

  verifyPage3 () {
    this.errors['password'] = this.password === this.password2 ? null : 'Passwords do not match'
    return this.verifyEmail(this.email) && this.password === this.password2
  }

  verifyEmail (input) {
    var re = /^(([^<>()\[\]\\.,:\s@"]+(\.[^<>()\[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    let valid = re.test(String(input).toLowerCase())

    this.errors['email'] = valid ? null : 'Improper email format'
    return valid
  }

  verifyNumber (input, s) {
    let re = /^([0|\+[0-9]{1,5})?([0-9]{10})$/
    let valid = re.test(String(input))
    this.errors[s] = valid ? null : 'Improper cellphone number format'
    return valid
  }

  private loader = this.loadingCtrl.create({
      content: "Registering..."
  })

  private completing = this.loadingCtrl.create({
      content: "Completing registration..."
  })

  gg () {
    if (this.verifyPage3()) {
      this.authProvider.googleLogin()
    } else {
      this.showDeny('Required fields', 'Please make sure all the required fields are appropriately filled')
    }
    
  }

  fb () {
    if (this.verifyPage3()) {
      this.authProvider.facebookLogin()
    } else {
      this.showDeny('Required fields', 'Please make sure all the required fields are appropriately filled')
    }
  }

  register () {
    if (this.verifyPage3()) {
      this.authProvider.emailRegister(this.email, this.password, 'tutor')
    } else {
      this.showDeny('Required fields', 'Please make sure all the required fields are appropriately filled')
    }
  }

  reg () {
    let env = this
    this.completing.present()

    firebase.database().ref(`/users_tutors/${this.user.uid}`).update({
      institution: env.ins,
      highest_qualification: env.hq,
      degree: env.degree,
      subjects: env.subinterests,
      name: env.fname,
      lastname: env.sname,
      displayname: env.user.displayName,
      imageurl: env.user.photoURL,
      coverurl: '',
      cellphone: env.cell,
      email: env.email,
      bio: '...',
      nickname: '...',
      status: 'online',
      likes: 0,
      ayos: env.ayos  
    })

    firebase.database().ref(`/users_global/${this.user.uid}`).update({
      type: env.type,
      institution: env.ins,
      highest_qualification: env.hq,
      degree: env.degree,
      subjects: env.subinterests,
      first: true
    })

    firebase.database().ref(`/users_tutors/${this.user.uid}/education`).push({
      institution: 'university',
      status: 'in progress',
      start: (new Date()).getTime(), //we need a date-time picker for this
      end: (new Date()).getTime(),
      degree: env.degree,
    })

    firebase.database().ref(`/users_tutors/${this.user.uid}/education`).push({
      institution: 'school',
      status: 'complete',
      start: (new Date()).getTime(), //we need a date-time picker for this
      end: (new Date()).getTime(),
      certificate: 'NSC/IEB/A Levels',
    })

    this.showAlert()
    
  }

  showAlert() {
    this.completing.dismiss()
    this.navCtrl.setRoot(TutorhomePage, {user: this.user})
    this.nativeStorage.setItem('user-info', {user: this.user, type: 'tutor'})
  }

  showDeny(title = 'Already Registered!', msg = 'This account is already used, please go to the Login Page!') {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: [
        {
          text: 'OK',
          handler: () => {}
        }
      ]
    })

    alert.present();
  }
}
