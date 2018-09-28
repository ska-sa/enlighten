import { async, TestBed} from '@angular/core/testing';
import {DebugElement} from '@angular/core';
import { By } from '@angular/platform-browser';
//depencies part of framework
import { MenuController,NavController, NavParams , Events, IonicModule} from 'ionic-angular';
//unit under test
import {LogoutPage} from './logout.ts'
//dependencies also being developed and requiring mocking
import { UserselectionPage } from '../userselection/userselection';//to be mocked by
import { UserselectionPageMock } from '../../../testing/page-mocks.js';
import { LoginPage } from '../login/login';//to be mocked by
import { LoginPageMock } from '../../../testing/page-mocks.js';

describe('The logout page (home page) shall', () => {
  let fixture;
  let component;
  let loginButton: DebugElement;
  let registerButton: DebugElement;
  let NavControllerSpy;
  // setup
  beforeEach(async(() => {
    NavControllerSpy = jasmine.createSpyObj("NavController",["push"]);
    TestBed.configureTestingModule({
      declarations: [LogoutPage],
      imports: [
        IonicModule.forRoot(LogoutPage)
      ],
      providers:[
        Events,//stable dependencies
        //dependecies requiring mocking/spying
        {provide: NavController, useValue: NavControllerSpy },
        {provide: NavParams, useClass: class { NavParamsSpy = jasmine.createSpy("NavParams"); } },
        //non stable dependencies
        {provide: UserselectionPage, useClass: UserselectionPageMock},
        {provide: LoginPage, useClass: LoginPageMock}
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoutPage);
    component = fixture.componentInstance;
    loginButton = fixture.debugElement.queryAll(By.css('button'))[0];
    registerButton =fixture.debugElement.queryAll(By.css('button'))[1];
  });

  //specs

  it('be created successfully', () => {
    expect(component instanceof LogoutPage).toBe(true);
  });

  it('navigate to login page when user click login',() => {
    loginButton.triggerEventHandler('click', null);
    expect(NavControllerSpy.push.calls.first().args[0]).toBe(LoginPage);
  });

  it('navigate to UserselectionPage when user click register',() => {
    registerButton.triggerEventHandler('click', null);
    expect(NavControllerSpy.push.calls.first().args[0]).toBe(UserselectionPage);
  });

 });
