///<reference path="typings.d.ts"/>
/// <reference path="typings/peerjs/index.d.ts" />

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';

platformBrowserDynamic().bootstrapModule(AppModule);
