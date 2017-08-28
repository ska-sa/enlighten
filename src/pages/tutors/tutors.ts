import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { TutorAccess } from '../../app/services/tutor-data/tutor.data';

/**
 * Generated class for the TutorsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-tutors',
  templateUrl: 'tutors.html',
})
export class TutorsPage {
  tutors: TutorAccess[];
  len: number = 0;
  name:string = "";
  constructor(public navCtrl: NavController, public navParams: NavParams, private tutorAccess: TutorAccess, public alertCtrl: AlertController) {
    this.tutors = this.tutorAccess.getTutors();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TutorsPage');
  }

  request(){
    //Send Request
    this.showAlert();
  }

  next(){
    if(this.len < this.tutors.length - 1){
      this.len++;
    }
    else{
      this.len = 0;
    }
  }

  prev(){
    if(this.len > 0){
      this.len--;
    }
    else{
      this.len = this.tutors.length - 1;
    }
  }
  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Request Sent!',
      buttons: ['OK']
    });
    alert.present();
  }

}
