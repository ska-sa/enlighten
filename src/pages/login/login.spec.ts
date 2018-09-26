import { async, TestBed } from '@angular/core/testing';
import { NavController, IonicModule, Platform, Events } from 'ionic-angular';
//unit under test
import {LoginPage} from './login.ts'
//dependencies also being developed and requiring mocking
import { AuthProvider } from '../../providers/auth/auth'//to be mocked by:
import {AuthProviderMock} from '../../../testing/provider-mocks.js'

describe('The login page shall', () => {
  let fixture;
  let component;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [
        IonicModule.forRoot(LoginPage)
      ],
      providers:[
        NavController, Events,//stable dependencies
        //non stable dependencies 
        {provide: AuthProvider, useClass: AuthProviderMock}
      ]

    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
  });

  it('be created successfully', () => {
    expect(component instanceof LoginPage).toBe(true);
  });

});
