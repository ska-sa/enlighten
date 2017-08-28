import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { SubjectsAccess } from '../../app/services/subjects/subjects';
import { userAccess } from '../../app/services/users/users';
import { InstitutionsAccess } from '../../app/services/institutions/institutions';

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
  users: userAccess;
  private userInfo;
  private fname: string;
  private sname: string;
  private grd: string;
  private sch: string;
  private cell: string;
  private sub: string;
  private picture: string;
  private email: string;
  //INFO FOR SUBJECT CHOICES
  subinterests: Array<any> = [];
  private subjects;
  private institutions;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
    private subjectsAccess: SubjectsAccess, private user: userAccess,
    private institutionsAccess: InstitutionsAccess) {
      this.users = user;
      this.cell = this.users.currentUserMobile;
      this.userInfo = this.users.getDetails(this.cell);
      this.subjects = this.subjectsAccess.getSubjects();
      this.updateFields();
      this.addsubinterest();
      this.institutions = this.institutionsAccess.getUniversities();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TutorprofilePage');
  }

  addsubinterest() {
    this.subinterests.push('');
  } 
  sendUserData(){
    this.users.update(this.fname, this.sname, this.grd, this.sch, this.cell, this.sub);
    this.showAlert();
  }
  updateFields(){
    this.fname = this.userInfo.firstname;
    this.sname = this.userInfo.lastname;
    this.email= this.userInfo.email;
    this.grd = "12";
    this.sch = "School of Life";
    this.cell = this.userInfo.mobile;
    this.sub = "Subjects of Life";
    this.picture = this.userInfo.picture;
  }
  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Profile Updated!',
      subTitle: 'All update and set to go!',
      buttons: ['OK']
    });
    alert.present();
  }

}
