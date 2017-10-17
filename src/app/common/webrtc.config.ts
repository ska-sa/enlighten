import {Injectable} from '@angular/core';

@Injectable()
export class WebRTCConfig {

    peerServerPort: number = 9000;

    key:string = 'iu6qotrrnfm9529';

    stun: string = 'stun.l.google.com:19302';
    /*turn: string = 'homeo@turn.bistri.com:80';
    turnCredentials: string = 'homeo';

    /*stunServer:RTCIceServer = {
        urls: 'stun:' + this.stun
    };*/
    stunServer: RTCIceServer = {
        urls: 'stun:' + this.stun
    };

    getPeerJSOption(): PeerJS.PeerJSOption {
        console.log("options being got")
        return {
            // Set API key for cloud server (you don't need this if you're running your own.
            key: this.key,

            // Set highest debug level (log everything!).
            debug: 3,
            // Set it to false because of:
            // > PeerJS:  ERROR Error: The cloud server currently does not support HTTPS. 
            // > Please run your own PeerServer to use HTTPS.
            secure: false,

            config: {
                iceServers: [
                    this.stunServer/*,
                    this.turnServer*/
                ]
            }
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
