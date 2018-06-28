import { Injectable } from '@angular/core';

@Injectable()
export class WebRTCConfig {

    peerServerPort: number = 9000;

    key: string = 'iu6qotrrnfm9529';

    stun: string = 'stun.l.google.com:19302';
    turn: string = 'numb.viagenie.ca';
    turnCredentials: string = 'homeo';
    user = 'wshilumani@gmail.com';
    c = 'Bluevenom1'

    turnServer = {
        url: 'turn:' + this.turn,
        username: this.user,
        credential: this.c
    };
    stunServer = {
        url: 'stun:' + this.stun
    };

    getPeerJSOption()/*: PeerJS.PeerJSOption*/ {
        return {
            host: 'enlighten-video.herokuapp.com',
            debug: 3,
            port:443, 
            key: 'peerjs', 
            secure: true,
        };
    }

    /**********************/

    audio: boolean = true;
    video: boolean = true;

    getMediaStreamConstraints(): MediaStreamConstraints {
        return <MediaStreamConstraints> {
            audio: this.audio,
            video: this.video
        }
    }
}
