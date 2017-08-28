import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { FormsModule } from '@angular/forms';
import { InstitutionsAccess } from '../../app/services/institutions/institutions';
import { SubjectsAccess } from '../../app/services/subjects/subjects';
import { userAccess } from '../../app/services/users/users';
import { TutorhomePage } from '../tutorhome/tutorhome';
import { Events } from 'ionic-angular';
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
  browse: string = "info";
  users: userAccess;
  subinterests: Array<any> = [];

  private fname: string;
  private sname: string;
  private grd: string;
  private sch: string;
  private cell: string;
  private sub: string;
  private email: string;
  private pass: string;

  private institutions;
  private subjects;
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
    private institutionsAccess: InstitutionsAccess,
    private subjectsAccess: SubjectsAccess,
    private user: userAccess,public events: Events) {
      this.users = user;
      this.institutions = this.institutionsAccess.getUniversities();
      this.subjects = this.subjectsAccess.getSubjects();
      this.addsubinterest();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TutorregisterPage');
  }
  addsubinterest() {
    this.subinterests.push('');
  } 
  next(){
    this.browse = "details";
  }
  
  reg(){
    if (this.users.alreadyReg(this.cell)){
      this.showDeny();
    }
    else{
      this.users.registerUser(this.fname, this.sname, "tutor", this.sch, this.cell, this.sub, this.email, this.pass);
      this.users.currentUserMobile = this.cell; //UPDATE USERS GLOBAL VARIABLE
      this.events.publish('globals:update', "tutor" , this.users.getName(this.cell), 'menu'); //UPDATE GLOBALS FOR MENU
      this.showAlert();
    }
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Registered!',
      subTitle: 'Welcome to Enlighten!',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.navCtrl.setRoot(TutorhomePage);
          }
        }]
    });
    alert.present();
  }
  showDeny() {
    let alert = this.alertCtrl.create({
      title: 'Already Registered!',
      subTitle: 'This account is already used, please go to the Login Page!',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.navCtrl.remove(2,1); // This will remove the 'ResultPage' from stack.
            this.navCtrl.pop();
          }
        }]
    });
    alert.present();
  }

}
