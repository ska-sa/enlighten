import { async, TestBed } from '@angular/core/testing';
import { NavController, IonicModule, Platform, Events } from 'ionic-angular';
import {TextInput} from 'ionic-angular';
import {DebugElement} from '@angular/core';
import { By } from '@angular/platform-browser';
//unit under test
import {LoginPage} from './login.ts'
//dependencies also being developed and requiring mocking
import { AuthProvider } from '../../providers/auth/auth'//to be mocked by:
//import {AuthProviderMock} from '../../../testing/provider-mocks.js'


describe('The login page shall', () => {
  let fixture;
  let component;
  let NavControllerSpy;
  let AuthProviderSpy;
  let loginButton: DebugElement;

  beforeEach(async(() => {
    NavControllerSpy = jasmine.createSpyObj("NavController",["push"]);
    AuthProviderSpy = jasmine.createSpyObj("AuthProvider",["emailLogin"]);
    TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [
        IonicModule.forRoot(LoginPage)
      ],
      providers:[
        Events,//stable dependencies
        //dependecies requiring mocking/spying
        {provide: NavController, useValue: NavControllerSpy },
        //non stable dependencies
        {provide: AuthProvider, useValue: AuthProviderSpy}
      ]

    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    loginButton = fixture.debugElement.queryAll(By.css('.sign'))[0];

  });

  afterEach(() => {
    fixture.destroy();
  });

  it('be created successfully', () => {
    expect(component instanceof LoginPage).toBe(true);
  });

  it('submit a user provided name and password for authentication', () => {

    //when:
    //user enter values (not triggering from dom as this brings too much complications)
    component.password = '_inputPassword.value';
    component.email = '_inputEmail.value';
    //and user submit request for authentication
    loginButton.triggerEventHandler('click', null);
    //then expect login request called from authProvider
    expect(AuthProviderSpy.emailLogin.calls.first().args).toBeTruthy(['_inputEmail.value', '_inputPassword.value']);

  });

});
