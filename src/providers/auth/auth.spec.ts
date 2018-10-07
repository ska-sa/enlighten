import { async, TestBed } from '@angular/core/testing';
//stable dependecies
import { GooglePlus } from '@ionic-native/google-plus'
import { Facebook } from '@ionic-native/facebook'
import { LoadingController, Platform, ToastController } from 'ionic-angular'
import { NativeStorage } from '@ionic-native/native-storage'
import { AngularFireAuth } from 'angularfire2/auth'
import { Events } from 'ionic-angular'
import { Firebase } from '@ionic-native/firebase'
//unit under test
import { AuthProvider } from './auth'

describe('The authprovider page shall', () => {
  let auth: AuthProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
        providers: [AuthProvider,
        GooglePlus,
        Facebook,
        ToastController,
        Platform,
        NativeStorage,
        AngularFireAuth,
        Events,
        Firebase],
    });
    auth = TestBed.get(AuthProvider);//unit under test
  });

  it('be created successfully', () => {
    expect(true).toBe(true);
  });

});
