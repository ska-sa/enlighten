import { Component, ViewChild } from '@angular/core'
import { NavController, NavParams, Navbar } from 'ionic-angular'
import { TutorAccess } from '../../app/services/tutor-data/tutor.data'
import { DrawPage } from '../draw/draw'
import * as firebase from 'firebase/app'
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database'

/**
 * Generated class for the LessonPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-lesson',
  templateUrl: 'lesson.html',
})
export class LessonPage {
  @ViewChild (Navbar) navBar : Navbar
  
  lessons: FirebaseListObservable<any>
  len: number = 0
  private currentBoard: FirebaseListObservable<any>
  private user
  private target
  private start
  private drawPage
  private object
  private type:string
  private boardid: string =''

  constructor (public navCtrl: NavController, public navParams: NavParams, 
    private af: AngularFireDatabase, private tutorAccess: TutorAccess) {
    if (navParams.get('user') != null && navParams.get('user') != undefined) {
      this.user = navParams.get('user')
      this.target = navParams.get('target')
      this.start = navParams.get('start')
      this.type = navParams.get('type')
      this.object = navParams.get('object')
      let env = this
      this.currentBoard = af.list(`users_boards_using/${this.user.uid}/`, {query: {limitToFirst: 1}})

      firebase.database().ref(`users_boards_using/${this.user.uid}/`).on('value', snapshot => {
        if (snapshot.val()) {
          env.boardid = snapshot.val().boardid
        }
      })

      if (this.type === 'learner') {
        this.lessons = af.list(`/lessons_upcoming_now_learners/${this.user.uid}`, {query: {limitToFirst: 1}})
      } else {
        this.lessons = af.list(`/lessons_upcoming_now_tutors/${this.user.uid}`, {query: {limitToFirst: 1}})
      }
    }
    
    this.drawPage = DrawPage
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LessonPage')

    this.navBar.backButtonClick = (e:UIEvent) => {
      e.preventDefault()
      this.navCtrl.pop()
    }
  }

  openPage(p) {
    this.navCtrl.push(p, {user: this.user, target: this.target, object: this.object, type: this.type, boardid: this.boardid})
  }

}
