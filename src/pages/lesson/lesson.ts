import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TutorAccess } from '../../app/services/tutor-data/tutor.data';
import { ClassroomPage } from '../classroom/classroom';
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
  tutors: TutorAccess[];
  len: number = 0;
  private classroomPage;
  constructor(public navCtrl: NavController, public navParams: NavParams, private tutorAccess: TutorAccess) {
    this.tutors = this.tutorAccess.getTutors()
    this.classroomPage = ClassroomPage;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LessonPage');
  }

  openPage(p) {
    this.navCtrl.push(p);
  }

}
