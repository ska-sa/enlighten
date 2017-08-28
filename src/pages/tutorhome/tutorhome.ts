import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';
import {CreateclassPage} from '../createclass/createclass';
import { LessonPage } from '../lesson/lesson';

/**
 * Generated class for the TutorhomePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-tutorhome',
  templateUrl: 'tutorhome.html',
})
export class TutorhomePage {
  createclassPage;
  private lessonPage;
  constructor(public navCtrl: NavController, public navParams: NavParams, public menuController: MenuController) {
    this.createclassPage = CreateclassPage;
    this.menuController.enable(true, 'myMenu')
    this.lessonPage = LessonPage;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TutorhomePage');
  }

  changePage(page) {
    this.navCtrl.push(page);
  }

}
