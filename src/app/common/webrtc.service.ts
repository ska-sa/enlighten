import {Injectable, EventEmitter} from '@angular/core';

import {WebRTCConfig} from './webrtc.config';


@Injectable()
export class WebRTCService {

    private _peer;//PeerJs.Peer;
    private _localStream: any;
    private _existingCall: any;
    private myid: string;
    myEl: HTMLMediaElement;
    otherEl: HTMLMediaElement;
    onCalling: Function;

    constructor(private config: WebRTCConfig) {
        var n = <any>navigator;
        n.getUserMedia = n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia;
    }

    /**
     * Create the Peer with User Id and PeerJSOption
     */
    createPeer(userId: string = '') {
        // Create the Peer object where we create and receive connections.
        this._peer = new Peer(/*userId,*/ this.config.getPeerJSOption());
        setTimeout(()=> {
            console.log(this._peer.id);
            this.myid = this._peer.id;
        }, 3000)
    }

    myCallId() {
        return this.myid;
    }

    answer(call) {
        call.answer(this._localStream);
        this._step2(call);
    }
    
    init(myEl: HTMLMediaElement, otherEl: HTMLMediaElement, onCalling: Function) {
        this.myEl = myEl;
        this.otherEl = otherEl;
        this.onCalling = onCalling;
        
        // Receiving a call
        this._peer.on('call', (call) => {
            // Answer the call automatically (instead of prompting user) for demo purposes
            this.answer(call);
            
        });
        this._peer.on('error', (err) => {
            console.log(err.message);
            // Return to step 2 if error occurs
            if (this.onCalling) {
                this.onCalling();
            }
            // this._step2();
        });
    
        this._step1();
    }

    call(otherUserId: string) {
        // Initiate a call!
        var call = this._peer.call(otherUserId, this._localStream);

        this._step2(call);
    }

    endCall() {
        this._existingCall.close();
        // this._step2();
        if (this.onCalling) {
            this.onCalling();
        }
    }

    private _step1() {
        // Get audio/video stream
        navigator.getUserMedia({ audio: true, video: true }, (stream) => {
            // Set your video displays
            this.myEl.src = URL.createObjectURL(stream);

            this._localStream = stream;
            // this._step2();
            if (this.onCalling) {
                this.onCalling();
            }
        }, (error) => { 
            console.log(error);
        });
    }

    private _step2(call) {
        // Hang up on an existing call if present
        if (this._existingCall) {
            this._existingCall.close();
        }

        // Wait for stream on the call, then set peer video display
        call.on('stream', (stream) => {
            this.otherEl.src = URL.createObjectURL(stream);
        });

        // UI stuff
        this._existingCall = call;
        // $('#their-id').text(call.peer);
        call.on('close', () => {
            // this._step2();
            if (this.onCalling) {
                this.onCalling();
            }
        });
    }
}
