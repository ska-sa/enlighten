import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { NativeAudio } from '@ionic-native/native-audio';


import { WebRTCService } from '../../app/common/webrtc.service';
import * as firebase from 'firebase/app';
import { Diagnostic } from 'ionic-native';
import * as SimplePeer from 'simple-peer';
 
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
  private myId;
  private calleeId;
  private myVideo;
  private remoteVideo;
  private type;
  private session;
  private n = <any>navigator;

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
    this.webRTCService.createPeer(this.user.uid);
    this.myId = this.user.uid;
    
    this.webRTCService.init(this.myVideo, this.remoteVideo, () => {
            console.log('I\'m calling');
    });
  }

  /*initVideo(targetSignal) {
    this._getRuntimePermission()
      .then(statuses => {
        alert('_getRuntimePermission: statutes => ' + statuses);
        return this._getUserMedia();
      })
      .then(stream => {
        alert('_getUserMedia success, stream => ' + stream);
        this._initPeer( stream, targetSignal );
      })
      .catch(err => {
        alert('_initVideo failed: err => '+ err);
      });
  }

  _getRuntimePermission() {
    return Diagnostic.requestRuntimePermissions([
      Diagnostic.permission.CAMERA,
      Diagnostic.permission.RECORD_AUDIO
    ]);
  }

  _getUserMedia() {
    this.n.getUserMedia = ( this.n.getUserMedia
      || this.n.webkitGetUserMedia
      || this.n.mozGetUserMedia
      || this.n.msGetUserMedia );
    return new Promise((resolve, reject) => {
      this.n.getUserMedia({ video: true, audio: true},
        stream => {
          resolve( stream );
        },
        err => {
          reject('_getUserMedia failed, err => ' + err);
        });
    });
  }

  _initPeer(stream:any, targetSignal:any) {
    let video = this.myVideo.nativeElement;
    this.peer = new SimplePeer({
      initiator: false,
      trickle: false,
      config: {
        iceServers: [{
          url: 'stun:stun3.l.google.com:19302'
        }, {
          // some other turn server
          url: 'turn:numb.viagenie.ca',
          credential: 'your pass',
          username: 'your-username'
        }]
      },
      reconnectTimer: 10000,
      stream: stream
    });
 
    this.peer.signal( JSON.parse(targetSignal) );
 
    this.peer.on('signal', data => {
      alert('Peer: on.signal: data => '+ data);
      // send signal to target user so that he/she can connect back;
      this.peer.send( JSON.stringify(data) );
    });
     
    this.peer.on('connect', data => {
      alert('Peer: peer has connected, data => '+ data);
      this.peer.send('testing!!!!!!!!');
    });
 
    this.peer.on('data', data => {
      alert('Peer: on.data => '+ data);
    });
 
    this.peer.on('stream', stream => {
      video.src = URL.createObjectURL( stream );
      video.play();
    });
 
    this.peer.on('error', error => {
      alert('Peer:Peer-Error => '+ error);
    });
  }*/

  /*connect() {
    this.peer.signal(JSON.parse(this.targetpeer));
  }

  message() {
    console.log(this.peer);
    this.peer.send('Hi targetpeer')
  }*/

  call() {
    console.log(this.calleeId)
    this.webRTCService.call(this.calleeId);
  }



}
