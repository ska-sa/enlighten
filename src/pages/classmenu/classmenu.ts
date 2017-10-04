import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ClassmenuPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
import {MyclassesPage} from '../myclasses/myclasses';
import {ClassbrowsePage} from '../classbrowse/classbrowse';


@Component({
  selector: 'page-classmenu',
  templateUrl: 'classmenu.html',
})
export class ClassmenuPage {
  private myclassesPage;
  private classbrowsePage;
  private user;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.myclassesPage = MyclassesPage;
    this.classbrowsePage = ClassbrowsePage;
    this.user = navParams.get('user');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClassmenuPage');
  }

  toPage(page) {
    this.navCtrl.push(page, {user: this.user});
  }

}
