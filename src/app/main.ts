///<reference path="typings.d.ts"/>
/// <reference path="typings/peerjs/index.d.ts" />
/// <reference path="typings/webrtc/mediastream/index.d.ts" />
/// <reference path="typings/webrtc/rtcpeerconnection/index.d.ts" />
/// <reference path="typings/es6-shim/es6-shim.d.ts" />
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';

platformBrowserDynamic().bootstrapModule(AppModule);
