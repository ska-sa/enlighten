import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { NavController, NavParams,MenuController, AlertController, Platform } from 'ionic-angular';

import { NativeAudio } from '@ionic-native/native-audio';
import { WebRTCService } from '../../app/common/webrtc.service';
import * as firebase from 'firebase/app';
import { NativeStorage } from '@ionic-native/native-storage';
import * as moment from 'moment';
import * as io from 'socket.io-client';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';


/**
 * Generated class for the DrawPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-draw',
  templateUrl: 'draw.html',
})
export class DrawPage implements OnInit {
  @ViewChild('myvideo') myvideo: ElementRef;
  @ViewChild('remotevideo') remotevideo: ElementRef;

  private user: any = {uid: ''};
  private target='';
  private peer: any;
  private myId ='';
  private calleeId;
  private myVideo;
  private remoteVideo;
  private n = <any>navigator;
  private boards =[];
  private boardids = [];
  private boarddata: FirebaseListObservable<any>;
  private testRadioOpen: boolean;
  private testRadioResult;
  private object;
  private type: string = 'tutor';
  private boardid: string ='';
  private showBoard:boolean = false; //make this false
  private showVideo: boolean = true;
  private hideMyVideo: boolean = true;

  //TWILIO VARIABLES
  private htmlToAdd = '<video #remotevideo autoplay></video>';
  private myVideoHtml = '<video #myvideo autoplay muted></video>';
  private at: string = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTS2MwYzUyN2IwMWFhZDI1YTg3YjkzMjI5ZmNjNzM5YjlhLTE1MTI2MTAwODIiLCJpc3MiOiJTS2MwYzUyN2IwMWFhZDI1YTg3YjkzMjI5ZmNjNzM5YjlhIiwic3ViIjoiQUNjYmIwODYyOTA2NzU1MzdiYTUwODUwZTdlOTk4ZGU3NSIsImV4cCI6MTUxMjYxMzY4MiwiZ3JhbnRzIjp7ImlkZW50aXR5IjoiWXV4aSIsInZpZGVvIjp7InJvb20iOiJteS1uZXctcm9vbSJ9fX0.zwCoa_gOJ59Whl2WgL7FLxjNin6lAn1h7BPJv86sEUs';
  private at2: string = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTS2MwYzUyN2IwMWFhZDI1YTg3YjkzMjI5ZmNjNzM5YjlhLTE1MTI2MTAxMTYiLCJpc3MiOiJTS2MwYzUyN2IwMWFhZDI1YTg3YjkzMjI5ZmNjNzM5YjlhIiwic3ViIjoiQUNjYmIwODYyOTA2NzU1MzdiYTUwODUwZTdlOTk4ZGU3NSIsImV4cCI6MTUxMjYxMzcxNiwiZ3JhbnRzIjp7ImlkZW50aXR5IjoiV2lzYW5pIiwidmlkZW8iOnsicm9vbSI6Im15LW5ldy1yb29tIn19fQ.RvQQXASOYdRKKqXlj86nn4R4cmuGztbhJaP_VpaXQas';
  constructor(public navCtrl: NavController,private nativeAudio: NativeAudio, 
    private navParams: NavParams, public webRTCService: WebRTCService,public menu: MenuController,
    private nativeStorage: NativeStorage, private af: AngularFireDatabase,public alertCtrl: AlertController,
    private renderer: Renderer2, public platform: Platform) {
    if(navParams.get('user')!= undefined && navParams.get('user') != null) {
      this.user = navParams.get('user');
      this.target = navParams.get('target');
      this.menu.enable(false, 'myMenu');
      this.object = navParams.get('object');
      this.type = navParams.get('type');
      let env = this;
      if(this.type == 'tutor') {
        firebase.database().ref(`/users_boards/${this.user.uid}/${this.target}`).once('value').then(res => {
          let keys = Object.keys(res.val());
          this.boards = [];
          if(keys.length > 0) {
            keys.forEach((e,i) => {
              this.boards.push(res.val()[keys[i]])
            })
          }
          this.showCheckbox(this.boards);
        })
      } else if (this.type == 'learner') {
        this.boardid = this.navParams.get('boardid');
        //alert(this.boardid);
        this.showBoard = true;
      }
      

      this.nativeAudio.preloadComplex('uniqueI1', 'assets/tone.mp3', 1, 1, 0).then((succ)=>{
        console.log("suu",succ)
      }, (err)=>{
        console.log("err",err)
      });
    } else {
      alert('Bypassing');
    }
  }

  showCheckbox(boards) {
    let alertB = this.alertCtrl.create();
    alertB.setTitle('Which whiteboard would you like to use?');
    let env = this;
    boards.forEach((board,i) => {
      alertB.addInput({
        type: 'radio',
        label: board.title,
        value: board.boardid,
        checked: false
      })
    })

    alertB.addInput({
        type: 'radio',
        label: 'New whiteboard',
        value: 'new',
        checked: true
    })
    var date = new Date()
    alertB.addButton('Cancel');
    alertB.addButton({
      text: 'Select',
      handler: data => {
        this.testRadioOpen = false;
        this.testRadioResult = data;
        if(data == 'new') {
          alertB.dismiss();
            var pushData2 = {
              data: {},
              title: env.object.tutorname + ' - ' + moment(date).format('DD/MM HH:mm'),
              dateCreated: (new Date()).getTime()
            }
            var pushData1 = {
              data: {},
              title: env.object.learnername + ' - ' + moment(date).format('DD/MM HH:mm'),
              dateCreated: (new Date()).getTime()
            }
          

          env.boardid = firebase.database().ref(`users_boards/${env.user.uid}/${env.target}`).push(pushData1).key;
          firebase.database().ref(`users_boards/${env.user.uid}/${env.target}/${env.boardid}`).update({boardid: env.boardid})
          
          firebase.database().ref(`users_boards/${env.target}/${env.user.uid}/${env.boardid}`).update(pushData2);
          firebase.database().ref(`users_boards/${env.target}/${env.user.uid}/${env.boardid}`).update({boardid: env.boardid});
          firebase.database().ref(`users_boards_using/${env.target}/`).update({boardid: env.boardid}).then(res => {
            env.showBoard = true;
          });
          
          
        } else {
          env.boardid = data;
          firebase.database().ref(`users_boards_using/${env.target}/`).update({boardid: env.boardid}).then(res => {
            env.showBoard = true;
          });
          
        }

        //alert(env.boardid);
        
        
        //if data shows new then push a whiteboard with `${learnername} - ${(new Date()).getTime()}` 
      }
    });
    alertB.present().then(() => {
      this.testRadioOpen = true;
    });
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad DrawPage');
  }

  showVid(ev) {
    console.log(ev);
    this.showVideo = ev;
  }

  ngOnInit() {
    this.remoteVideo = this.remotevideo.nativeElement;
    this.myVideo = this.myvideo.nativeElement;
    var type = '';
    this.nativeStorage.getItem('user-info').then(res => {
      alert('user-info: '+JSON.stringify(res));
      type = res.type;
    })
    let env = this;
    console.log('initializing...');
    this.webRTCService.createPeer(this.user.uid);
    setTimeout(()=> {
      this.myId = this.webRTCService.myCallId();
      firebase.database().ref(`/users_callids/${env.user.uid}`).update({callid: this.myId});
      if(type == 'tutor') {
        firebase.database().ref(`/users_callids/${env.target}`).once('value').then(res=>{
          env.call(res.val().callid)
        })
      }
    }, 4000)

    this.webRTCService.init(this.myVideo, this.remoteVideo, () => {
            console.log('I\'m calling');
    });

    /*if(this.platform.is('cordova')){
      this.connectCD();
    } else {
      this.connect();
    }*/
    
    //this.show();
  }

  call(id) {
    this.calleeId = id;
    this.webRTCService.call(id);
  }

  connect() {
    alert('Trying');
    let n = Math.round(Math.random()*2);
    if(n == 0) {n = 1}
    var s;
    alert(n);
    alert(Twilio);
    n == 1? s = this.at : s = this.at2;
    alert(JSON.stringify(Twilio));
    Twilio.Video.connect(s, {name:'my-new-room', audio: true, video: {width: 640}}).then(room=>{
      alert('Successfully joined a room: '+ room);

      room.on('participantConnected', participant => {
        alert('A remote paticipant has connected: ' + participant);
        participant.tracks.forEach(track => {
          console.log(track.attach());
          this.renderer.appendChild(this.remoteVideo, track.attach());
        });
      }, error => {
        alert('Unable to connect to room: ' + error.message)
      })

      room.on('participantDisconnected', function(participant) {
        alert('Participant disconnected: ' + participant.identity);
      });

      // Log your Client's LocalParticipant in the Room
      const localParticipant = room.localParticipant;
      this.show();
      //alert('Connected to the Room as LocalParticipant "%s" '+ localParticipant.identity);

      // Log any Participants already connected to the Room
      room.participants.forEach(participant => {
        alert('Participant "%s" is connected to the Room '+ participant.identity);
      });

      // Log new Participants as they connect to the Room
      room.once('participantConnected', participant => {
        alert('Participant "%s" has connected to the Room: '+ participant.identity);
        setTimeout(()=>{
          alert(participant.tracks.entries());
          for (var [key, value] of participant.tracks.entries()) {
            alert(key + ' = ' + value)
          }

          participant.tracks.forEach(track => {
            console.log("Track console: "+ track);
            console.log(track.attach());
            this.renderer.appendChild(this.remoteVideo, track.attach());
          });
        },2000)
        //alert(participant.tracks.size);
        /*room.participants.forEach(participant => {
          alert('Participant "%s" is connected to the Room '+ participant.identity);
        });*/
      });

      // Log Participants as they disconnect from the Room
      room.once('participantDisconnected', participant => {
        alert('Participant "%s" has disconnected from Room: '+ participant.identity);
      });

    })
  }

  show() {
    Twilio.Video.createLocalVideoTrack().then(track => {
      console.log(track.attach());
      //let soo = this.renderer.createElement('<div class="nought"> </div>')
      this.renderer.appendChild(this.myVideo, track.attach());
      //this.myVideoHtml = track.attach().toString();
    });
  }

  connectCD() {
    alert('Trying');
    let n = Math.round(Math.random()*2);
    if(n == 0) {n = 1}
    var s;
    alert(n);
    alert(cordova);
    alert(cordova.videoconversation)
    n == 1? s = this.at : s = this.at2;
    cordova.videoconversation.open('my-new-room',s).then(room=>{
      alert('Successfully joined a room: '+ room);

      room.on('participantConnected', participant => {
        alert('A remote paticipant has connected: ' + participant);
        participant.tracks.forEach(track => {
          console.log(track.attach());
          this.renderer.appendChild(this.remoteVideo, track.attach());
        });
      }, error => {
        alert('Unable to connect to room: ' + error.message)
      })

      room.on('participantDisconnected', function(participant) {
        alert('Participant disconnected: ' + participant.identity);
      });

      // Log your Client's LocalParticipant in the Room
      const localParticipant = room.localParticipant;
      this.showCD();
      //alert('Connected to the Room as LocalParticipant "%s" '+ localParticipant.identity);

      // Log any Participants already connected to the Room
      room.participants.forEach(participant => {
        alert('Participant "%s" is connected to the Room '+ participant.identity);
      });

      // Log new Participants as they connect to the Room
      room.once('participantConnected', participant => {
        alert('Participant "%s" has connected to the Room: '+ participant.identity);
        setTimeout(()=>{
          alert(participant.tracks.entries());
          for (var [key, value] of participant.tracks.entries()) {
            alert(key + ' = ' + value)
          }

          participant.tracks.forEach(track => {
            console.log("Track console: "+ track);
            console.log(track.attach());
            this.renderer.appendChild(this.remoteVideo, track.attach());
          });
        },2000)
        //alert(participant.tracks.size);
        /*room.participants.forEach(participant => {
          alert('Participant "%s" is connected to the Room '+ participant.identity);
        });*/
      });

      // Log Participants as they disconnect from the Room
      room.once('participantDisconnected', participant => {
        alert('Participant "%s" has disconnected from Room: '+ participant.identity);
      });

    })
  }

  showCD() {
    cordova.videoconversation.createLocalVideoTrack().then(track => {
      console.log(track.attach());
      //let soo = this.renderer.createElement('<div class="nought"> </div>')
      this.renderer.appendChild(this.myVideo, track.attach());
      //this.myVideoHtml = track.attach().toString();
    });
  }

}
