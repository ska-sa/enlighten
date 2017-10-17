import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { NativeAudio } from '@ionic-native/native-audio';
//import { WebRTCService } from '../../common/webrtc.service';
import { WebRTCService } from '../../app/common/webrtc.service';
import * as firebase from 'firebase/app';
/**
 * Generated class for the VideocallPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-videocall',
  templateUrl: 'videocall.html',
})
export class VideocallPage implements OnInit {
  @ViewChild('myvideo') myvideo: any;
  @ViewChild('remotevideo') remotevideo: any;

  private user;
  private peer: any;
  private targetpeer: any;
  private myId;
  private calleeId;
  private myVideo;
  private remoteVideo;
  private type;
  private session;

  turn: string = 'homeo@turn.bistri.com:80';
    turnCredentials: string = 'homeo';

    /*stunServer:RTCIceServer = {
        urls: 'stun:' + this.stun
    };*/

    turnServer = {
        host: 'turn:' + this.turn,
        credential: this.turnCredentials,
        username: this.turnCredentials,
        password: ''
    };
  private config = {
    isInitiator: true,
    turn: this.turnServer,
    streams: {
      audio: true,
      video: false
    }
  }

  constructor(public navCtrl: NavController,private nativeAudio: NativeAudio, 
    private navParams: NavParams, public webRTCService: WebRTCService ) {
    this.user = navParams.get('user');
    this.type = navParams.get('type');
    //var peer = new Peer({key: 'iu6qotrrnfm9529'});
    this.nativeAudio.preloadComplex('uniqueI1', 'assets/tone.mp3', 1, 1, 0).then((succ)=>{
      console.log("suu",succ)
    }, (err)=>{
      console.log("err",err)
    });
  }

  ngOnInit() {
    this.remoteVideo = this.remotevideo.nativeElement;
    this.myVideo = this.myvideo.nativeElement;
    /*this.session = new cordova.plugins.phonertc.Session(this.config);
    alert(this.session);
    alert(this.session)
    var n = <any>navigator;
    
    let peerx: any;
    n.getUserMedia = n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia || n.msGetUserMedia;
    n.getUserMedia({video: true, audio: true}, stream => {
      peerx = new SimplePeer({
        initiator: location.hash === '#init', //boolean, if the hash is init, then we are initiator
        trickle: false,
        steam: stream
      })

      peerx.on('signal', data => {
        console.log(JSON.stringify(data));

        this.targetpeer = data;
      })

      peerx.on('data', data => {
        console.log('Received message: ', data)
      })

      peerx.on('stream', localStream => {
        this.myVideo.src = URL.createObjectURL(localStream);
        this.myVideo.play();
      })

      setTimeout(()=> {
        this.peer = peerx;
        console.log(this.peer)
      }, 5000);
    }, err => {
      console.log("Connection error: ", err)
    })*/
    
    
    console.log('initializing...');
    this.webRTCService.createPeer();
    setTimeout(()=> {
      this.myId = this.webRTCService.myCallId();
    }, 4000)

    this.webRTCService.init(this.myVideo, this.remoteVideo, () => {
            console.log('I\'m calling');
    });
  }

  connect() {
    this.peer.signal(JSON.parse(this.targetpeer));
  }

  message() {
    console.log(this.peer);
    this.peer.send('Hi targetpeer')
  }

  call() {
    this.webRTCService.call(this.calleeId);
  }



}
