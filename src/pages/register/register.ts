import { Component, Inject } from '@angular/core'
import { NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular'
import { HomePage } from '../home/home'
import { LogoutPage } from '../logout/logout'

import { InstitutionsAccess } from '../../app/services/institutions/institutions'
import { SubjectsAccess } from '../../app/services/subjects/subjects'

import { userAccess } from '../../app/services/users/users'
import { Events } from 'ionic-angular'
import 'rxjs/Rx'

import { NativeStorage } from '@ionic-native/native-storage'

import * as firebase from 'firebase/app'
import 'firebase/messaging'
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database'
import { AngularFireAuth } from 'angularfire2/auth'
import { FirebaseApp } from 'angularfire2'
import { Firebase } from '@ionic-native/firebase'
import { Observable } from 'rxjs/Observable'

import { AuthProvider } from '../../providers/auth/auth'
/**
 * Generated class for the RegisterPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  browse: string = "info"
  users: userAccess
  private fname: string=''
  private sname: string=''
  private grd: string=''
  private sch: string=''
  private cell: string=''
  private gcell: string = ''
  private sub: string=''
  private email: string =''
  private type: string = "learner"
  private user
  private gUser
  private authState
  private schools:Array<any> = []
  private password: string = '';
  private password2: string = '';
  private errors: any = {};

  private schfocused: boolean = false
  private rate = 100
  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public alertCtrl: AlertController, private institutionsAccess: InstitutionsAccess,
    private subjectsAccess: SubjectsAccess, public events: Events, 
    public loadingCtrl: LoadingController, private af: AngularFireDatabase,
    private nativeStorage: NativeStorage, private fcm: Firebase, private authProvider: AuthProvider) {
      this.getSchools()
  }

  ionViewDidLoad() {
    this.subscribeToAuthState()
    console.log('ionViewDidLoad RegisterPage')
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

  addFocus() {
    if(this.sch.length > 3) {
      this.schfocused = true
    }
  }

  removeFocus() {
    setTimeout(()=>{
      this.schfocused = false
    }, 100)
  }

  selectSchool(s) {
    this.sch = s.school

    this.rate = parseFloat(s.rate.toString().replace(',','.'))
    this.removeFocus()
  }

  getSchools() {
    this.af.list(`/schools`, {preserveSnapshot: true})
      .subscribe(snapshots => {
        this.schools = []

        snapshots.forEach(snapshot => {
          this.schools.push(snapshot.val())
        })

        console.log(this.schools)
      })
  }

  getItems(ev:any) {
    let val = ev.target.value
    this.addFocus()

    if(val.length > 3) {
      this.getSchools() 

      if(val && val.trim() != '') {
        this.schools = this.schools.filter((school)=>{  
          return (school.school.toLowerCase().indexOf(val.toLowerCase()) > -1)
        })

        console.log(this.schools)
      }
    }
  }

  private loader = this.loadingCtrl.create({
      content: "Registering..."
  })

  private completing = this.loadingCtrl.create({
      content: "Completing registration..."
  })

  verifyPage1() {
    this.errors['fname'] = this.fname !== '' ? null : 'First name cannot be left empty'
    this.errors['sname'] = this.sname !== '' ? null : 'Last name cannot be left empty'
    return this.fname !== '' && this.sname !== '' && this.verifyNumber(this.cell, 'cell') && this.verifyNumber(this.gcell, 'gcell')
  }

  verifyPage2() {
    this.errors['school'] = this.sch.length > 2 ? null : 'Please enter the full name of the school'
    this.errors['grade'] = this.sch.length > 2 ? null : 'Please choose your grade'
    return this.sch.length >= 2 && this.grd !== ''
  }

  verifyPage3 () {
    this.errors['password'] = this.password === this.password2 ? null : 'Passwords do not match'
    return this.verifyEmail(this.email) && this.password === this.password2
  }

  verifyEmail (input) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
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

  next (s) {
    if (s === 'details') {
      if (this.verifyPage1()) {
        this.browse = s;
      } else {
        this.showDeny('Required fields', 'Please make sure all the required fields are appropriately filled')
      }
    } else {
      if (this.verifyPage2()) {
        this.browse = s;
      } else {
        this.showDeny('Required fields', 'Please make sure all the required fields are appropriately filled')
      }
    }
  }

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
      this.authProvider.emailRegister(this.email, this.password, this.fname, 'learner')
    } else {
      this.showDeny('Required fields', 'Please make sure all the required fields are appropriately filled')
    }
  }
  
  reg () {
    let env = this
    this.completing.present()

    let imgurl = env.user.photoURL ? env.user.photoURL : 'https://enlightentutoring.co.za'

    firebase.database().ref(`/users_learners/${this.user.uid}`).update({
      school: env.sch,
      grade: env.grd,
      subjects: env.sub,
      name: env.fname,
      lastname: env.sname,
      displayname: env.user.displayName,
      imageurl: '' + imgurl,
      coverurl: '',
      cellphone: env.cell,
      guardian: env.gcell,
      email: env.email,
      bio: '...',
      nickname: '...',
      priority: env.rate  
    })

    firebase.database().ref(`/users_global/${this.user.uid}`).update({
      type: env.type,
      institution: env.sch,
      highest_qualification: 'school',
      grade: env.grd,
      subjects: env.sub,
      first: true  
    })

    firebase.database().ref(`/users_learners/${this.user.uid}/education`).push({
      institution: 'school',
      status: 'complete',
      start: (new Date()).getTime(), //we need a date-time picker for this
      end: (new Date()).getTime(),
      certificate: 'NSC/IEB/A Levels',
    }).then(() => {
      this.showAlert()
    })
  }

  showAlert() {
    this.completing.dismiss().then(() => {
      this.nativeStorage.setItem('user-info', {user: this.user, type: 'learner'})
    })
  }

  showDeny(title = 'Already Registered!', msg = 'This account is already used, please go to the Login Page!') {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            /* this.navCtrl.remove(2,1); // This will remove the 'ResultPage' from stack.
            this.navCtrl.pop(); */
          }
        }]
    });
    alert.present();
  }

}
