import { Component } from '@angular/core'
import { NavController, NavParams, AlertController } from 'ionic-angular'
import { userAccess } from '../../app/services/users/users'
import { LoginPage } from '../login/login'
import { SubjectsAccess } from '../../app/services/subjects/subjects'

import * as firebase from 'firebase/app'
/**
 * Generated class for the ProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  user
  login: LoginPage
  private fname: string
  private sname: string
  private grd: string
  private sch: string
  private cell: string
  private sub: string
  private picture: string
  private email: string
  private userInfo
  private type: string = 'learner'

  //INFO FOR SUBJECT CHOICES
  subinterests: Array<any> = []
  private subjects

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
    private subjectsAccess: SubjectsAccess) {
    this.user = navParams.get('user')
    let env = this

    firebase.database().ref(`/users_${this.type}s/${this.user.uid}`).once('value').then(res => {
      var data = res.val()
      env.cell = data.cellphone
      env.fname = data.name
      env.sname = data.lastname
      env.grd = data.grade
      env.sch = data.school
      env.sub = data.subjects
      env.picture = data.imageurl
      env.email = data.email
    })

    this.addsubinterest()
  }

  ionViewDidLoad () {
    console.log('ionViewDidLoad ProfilePage')
  }

  addsubinterest () {
    this.subinterests.push('')
  }

  sendUserData () {
    let env = this

    firebase.database().ref(`/users_${this.type}s/${this.user.uid}`).update({
      cellphone: env.cell,
      name: env.fname,
      lastname:env.sname,
      grade: env.grd,
      school: env.sch,
      subjects: env.sub,
      imageurl: env.picture,
      email: env.email
    }).then(() => {
      this.showAlert('Profile updated!', 'Your profile has susccessfully been updated')
    }).catch(err => {
      this.showAlert('Sorry', `Could not update your profile at this time: ${err}`)
    })
  }

  showAlert (title, subTitle) {
    let alert = this.alertCtrl.create({
      title,
      subTitle,
      buttons: ['OK']
    })

    alert.present()
  }
}
