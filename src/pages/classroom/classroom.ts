import { Component } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing';
import { NavController, NavParams } from 'ionic-angular';


/**
 * Generated class for the ClassroomPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-classroom',
  templateUrl: 'classroom.html',
})
export class ClassroomPage {

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, private socialSharing: SocialSharing) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClassroomPage');
  }

  whatsappShare() {
    this.socialSharing.shareViaWhatsApp("shareViaWhatsApp", null, null).then(() => {
      console.log("shareViaWhatsApp: Success");
    }).catch(() => {
      console.error("shareViaWhatsApp: failed");
    });
  }

}
