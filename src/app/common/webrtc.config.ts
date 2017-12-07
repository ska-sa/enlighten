import {Injectable} from '@angular/core';

@Injectable()
export class WebRTCConfig {

    peerServerPort: number = 9000;

    key:string = 'iu6qotrrnfm9529';

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
        console.log("options being got")
        return {
            // Set API key for cloud server (you don't need this if you're running your own.
            //key: this.key,
            port: 9000,
            host: 'https://enlighten-whiteboard.herokuapp.com',
            // Set highest debug level (log everything!).
            debug: 3,
            // Set it to false because of:
            // > PeerJS:  ERROR Error: The cloud server currently does not support HTTPS. 
            // > Please run your own PeerServer to use HTTPS.
            secure: true,

            /*config: {
                iceServers: [
                    this.stunServer,
                    this.turnServer
                ]
            }*/
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
