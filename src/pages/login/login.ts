import { Component } from '@angular/core';

import { GooglePlus } from '@ionic-native/google-plus';
import { NativeStorage } from '@ionic-native/native-storage';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

import { NavController, NavParams, AlertController, MenuController, LoadingController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { TutorhomePage } from '../tutorhome/tutorhome';
import { userAccess } from '../../app/services/users/users';
import { Events } from 'ionic-angular';
import { Http, Headers } from '@angular/http';


import 'rxjs/Rx';

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  private currentUser;
  private gUser;
  private authState;
  private user; 

  public cellNo: string;
  public userData;
  private pass: string;
  private users;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController, 
    private http: Http,
    private googlePlus: GooglePlus,
    public afAuth: AngularFireAuth, 
    private af: AngularFireDatabase,
    private nativeStorage: NativeStorage,
    private menuCtrl: MenuController,
    private events: Events,
    public loadingCtrl: LoadingController) { //
    /*this.googleAuth.login().then(function() {
        //
      })*/
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  private loader = this.loadingCtrl.create({
      content: "Logging in..."
  });

  login(cellNo: string){
    var type;
    if(this.users.loginCheck(this.cellNo, this.pass)){
      var specUser = this.users.getDetails(this.cellNo);
      this.users.currentUserMobile = cellNo;
      type = specUser.type;
      this.events.publish('globals:update', type , this.users.getName(this.cellNo), specUser.picture, 'menu');
      switch(type) {
        case 'student':
          this.navCtrl.setRoot(HomePage);
        break;
        case 'tutor':
          this.navCtrl.setRoot(TutorhomePage);
        break;
        case 'parent':
          this.navCtrl.setRoot(HomePage);
        break;
      }
           
    }
    else{
      //this.showAlert();
    }
  }

  gg(){
    this.loader.present();
    this.googlePlus.login({
            //'webClientId': '559242294803-iel70p87sa56tv4leg3hosnbu46lrtfc.apps.googleusercontent.com',
            'webClientId': '745996686081-modil5qum4720gdi6ma9p2gl6b1vflaf.apps.googleusercontent.com',
            'offline': true})
            .then((success) =>{
              this.gglogged(success);
            })
            .catch((err) => {
              alert('Login failed!' + err);
              this.ggfail();
            });
    //this.users.gglog();
  }
  ggfail(){
    this.loader.dismiss();
    setTimeout(()=>{this.showDeny();}, 200);
  }
  gglogged(result){
    this.loader.dismiss();
    
    //setTimeout(()=>{this.showAlert();}, 200); load firebase rather
    this.fireAuth(result);
  }
  fireAuth(successuser) {
    this.gUser = successuser;
    var type ='';
    var credential = firebase.auth.GoogleAuthProvider.credential(
              successuser.idToken); //WE NEED TO SAVE THIS TO CACHE FOR SILENT LOGIN
      let env = this;
      firebase.auth().signInWithCredential(credential).then((result) => {
        var user = result;
        this.user = user;
        env.loader.present();
        env.authState = env.afAuth.authState;
        env.authState.subscribe(user => {
          if (user) {
            env.currentUser = user;
            
            env.nativeStorage.getItem('user-info').then(data => {
              type = data.type;
              this.procToAlert(type);
            }, error => {
              //We get the type from firebase here
              var type = firebase.database().ref(`/users_global/${user.uid}/type`).once('value').then(res => {
                //alert(res.val());
                env.nativeStorage.setItem('user-info', {user: user, type: res});
                this.procToAlert(res.val());
              })
              
            })
          } else {
            env.currentUser = null;
            alert('error')
          }
        });
      });
  }

  procToAlert(type) {
    let env = this;
    var data = {}; //dependant on role?
    this.events.publish('globals:update', this.user, type);
    if(type == 'tutor') {
        env.showAlert(data, type);
        //what TUTOR info do we need?
    } else if (type == 'learner') {
        env.showAlert(data, type)
        //what LEARNER info do we need?
    } else if (type == 'parent') {
      env.showAlert(null, type);
        //WHAT PARENT info do we need?
    }
  }

  showAlert(data, type) {
    this.loader.dismiss();
    //we find type from database
    if(type == 'tutor') {
      this.navCtrl.setRoot(TutorhomePage,{
      user: this.user, guser: this.gUser});
    } else if(type == 'learner') {
      this.navCtrl.setRoot(HomePage,{
        user: this.user, guser: this.gUser, data: data});
    } else if(type == 'parent') {
      this.navCtrl.setRoot(HomePage,{
        user: this.user, guser: this.gUser, data: data});
    }
  }

  showDeny() {
    let alert = this.alertCtrl.create({
      title: 'Login Failed',
      subTitle: 'Invalid credentials!',
      buttons: [
        {
          text: 'OK'
        }]
    });
    alert.present();
  }

  /*googleLogin() {
    let env = this;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    GooglePlus.login({
            //'webClientId': '559242294803-iel70p87sa56tv4leg3hosnbu46lrtfc.apps.googleusercontent.com',
            'webClientId': '745996686081-ta15tog2jhd7v3832l95874i2ng8c3m6.apps.googleusercontent.com',
            'offline': true})
    .then((res) => {
      env.http.post(`/users/account/verify`, res, {headers: headers})
              .map(data => data.json())
              .subscribe(result => {
                alert(result);
                alert(JSON.stringify(result));
              })
      alert('good');
      alert(JSON.stringify(res));
      this.userData = res;
    },
    (err) => {
      alert('good');
      alert(err);
      console.log('error');
      console.log(err);
    });
  }*/

}
