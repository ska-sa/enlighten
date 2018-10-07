import { async, TestBed } from '@angular/core/testing';
//stable dependecies
import { GooglePlus } from '@ionic-native/google-plus'
import { Facebook } from '@ionic-native/facebook'
import { NavController, LoadingController ,IonicModule, Platform, ToastController } from 'ionic-angular'
import { NativeStorage } from '@ionic-native/native-storage'
import { AngularFireAuth } from 'angularfire2/auth'
import { Events } from 'ionic-angular'
import { Firebase } from '@ionic-native/firebase'
import { Observable } from 'rxjs/Observable'
import {ToastControllerMock, LoadingControllerMock } from 'ionic-mocks'
//unit under test
import { AuthProvider } from './auth'
//

class AngularFireAuthMock {
  public authState;
  constructor(){
    this.authState = new Observable((observer) =>{

    });
  }
}

describe('The authprovider page shall', () => {
  let auth: AuthProvider;


  beforeEach(() => {
    TestBed.configureTestingModule({
        providers: [
          GooglePlus,
          Facebook,
          Platform,
          NativeStorage,
          {provide: ToastController ,useValue: ToastControllerMock.instance()},
          {provide: LoadingController, useValue: LoadingControllerMock.instance()},
          {provide: AngularFireAuth, useValue: new AngularFireAuthMock() },
          Events,
          Firebase,
          AuthProvider
        ]
    });
      auth = TestBed.get(AuthProvider);//unit under test
  });

  it('be created successfully', () => {
    expect(true).toBe(true);
  });

});
