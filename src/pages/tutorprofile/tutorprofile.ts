import { Component } from '@angular/core'
import { NavController, NavParams, AlertController } from 'ionic-angular'
import { SubjectsAccess } from '../../app/services/subjects/subjects'
import { userAccess } from '../../app/services/users/users'
import { InstitutionsAccess } from '../../app/services/institutions/institutions'
import { Calendar } from '@ionic-native/calendar'
import * as moment from 'moment'
import * as firebase from 'firebase/app'

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database'
import { AngularFireAuth } from 'angularfire2/auth'
import { Observable } from 'rxjs/Observable'
/**
 * Generated class for the TutorprofilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-tutorprofile',
  templateUrl: 'tutorprofile.html',
})
export class TutorprofilePage {
  private fcalendar: FirebaseListObservable<any>
  private user
  private type: string = 'tutor'
  private userInfo
  private fname: string
  private sname: string
  private ayos: string
  private ins: string
  private cell: string
  private sub: string
  private picture: string
  private email: string
  private hq: string
  private degree: string
  private starttime: any = ''
  private lastDay

  private subinterests: Array<any> = []
  private subjects
  private institutions

  private weekDays = [
    {name:'Mon', slots: []},
    {name:'Tue', slots: []},
    {name:'Wed', slots: []},
    {name:'Thu', slots: []},
    {name:'Fri', slots: []},
    {name:'Sat', slots: []},
    {name:'Sun', slots: []}
  ]

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
  private subjectsAccess: SubjectsAccess,
  private institutionsAccess: InstitutionsAccess,
  private calendar: Calendar, 
  private af: AngularFireDatabase) {
    this.user = navParams.get('user')
    this.fcalendar = af.list(`/calendar_tutors/${this.user.uid}`)
    let env = this
    
    firebase.database().ref(`/users_${this.type}s/${this.user.uid}`).once('value').then(res => {
      let data = res.val()
      env.cell = data.cellphone
      env.fname = data.name
      env.sname = data.lastname
      env.degree = data.degree
      env.email = data.email
      env.ayos = data.ayos
      env.ins = data.institution
      env.sub = data.subjects
      env.picture = data.imageurl
      env.hq = data.highest_qualification
    })

    this.addsubinterest()
    this.institutions = this.institutionsAccess.getUniversities()
  }

  customTrackBy(index: number, obj: any): any {
    return index
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TutorprofilePage')
  }

  addsubinterest() {
    this.subinterests.push('')
  }

  sendUserData(){
    let env = this

    firebase.database().ref(`/users_${this.type}s/${this.user.uid}`).update({
      cellphone: env.cell,
      name: env.fname,
      lastname: env.sname,
      ayos: env.ayos,
      institution: env.ins,
      subjects: env.sub,
      degree: env.degree,
      email: env.email,
      imageurl: env.picture,
      highest_qualification: env.hq
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

  time (s) {
    this.starttime = moment(s).local()
  }

  createEvent (reccurence,date,duration) {
    var options = this.calendar.getCalendarOptions()
    var startDate = new Date(Date.parse(date))
    var twomonths = new Date(parseInt(moment(startDate.toString()).format('x')) + 61*24*60*60000)

    if(reccurence ==  true) {
      options.recurrence = 'weekly'
      options.firstReminderMinutes = 30
      options.recurrenceEndDate = twomonths
    } else {
      options.firstReminderMinutes = 30
    }
    
    var endNum = parseInt(moment(startDate.toString()).format('x')) + parseInt(duration)*60000
    var endDate = new Date(endNum)//moment.unix(endNum).toDate() //new Date(endNum)
    var title = `Tutoring Session Slot`
    var eventLocation = "Enlighten App: Session"
    var notes = `session`

    this.calendar.createEventWithOptions(title,eventLocation,notes,startDate,endDate,options).then(result => {
      alert(result)
    }, error=> {alert(error)}).catch(err => {
      alert(err)
    })
  }

  remove (key) {
    firebase.database().ref(`/calendar_tutors/${this.user.uid}/${key}`).remove()
    firebase.database().ref(`/calendar_tutors_unbooked/${this.user.uid}/${key}`).remove()
  }
}
