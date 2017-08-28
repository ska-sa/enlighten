import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppointmentAccess } from '../../app/services/appointment-data/appointment-data';
import { TutorAccess } from '../../app/services/tutor-data/tutor.data';
/**
 * Generated class for the AppointmentsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-appointments',
  templateUrl: 'appointments.html',
})
export class AppointmentsPage {
  appointments: AppointmentAccess[];
  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private appointmentAcess: AppointmentAccess,
              private tutorAccess: TutorAccess) {
    this.appointments = this.appointmentAcess.getAppointments();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AppointmentsPage');
  }

  getTutor(id) {
    return this.tutorAccess.getTutor(id);
  }

}
