import { Injectable } from '@angular/core';
import { allUsers } from "./allusers"


@Injectable() 
export class userAccess {
    cellNum: string;
    currentUserMobile: string;
    currentType: string;
    private userInfo: string[];
    
    fname: string;
    sname: string;
    grade: string;
    school: string;
    subject: string;
    password: string = "123";
    email: string;
    users = [{              "userId": "123abc",
                            "firstname": "Sarah",
                            "lastname": "Johnson",
                            "mobile": "456",
                            "type": "student",
                            "email": "sjohnson@gmail.com",
                            "password": "456",
                            "picture": "assets/img/sarah-avatar.jpg"
                        },
                        {   "userId": "123abc",
                            "firstname": "Rick",
                            "lastname": "Sanchez",
                            "mobile": "789",
                            "type": "tutor",
                            "email": "ricksanchez@aswim.com",
                            "password": "789",
                            "picture": "assets/img/avatar-ben.png"
                        },
                        {   "userId": "123abc",
                            "firstname": "Marty",
                            "lastname": "McFly",
                            "mobile": "123",
                            "type": "student",
                            "email": "mmcfly@gmail.com",
                            "password": "123",
                            "picture": "assets/img/marty-avatar.png"
                        }]
    constructor(private driver: allUsers) {
        //alert(this.userInfo)
        this.userInfo = ["0","1","2","3","4","5","6","7"];
        //this.userInfo = driver.loggedIn;
        //alert(this.userInfo)
        this.fname = "TestFirst";
        this.sname = "TestSec";
        this.grade = "12";
        this.school = "dank";
        this.cellNum = "123";
        this.subject = "ion";
    }
    //Only occurs in profile.ts
    update(f: string, s: string, g: string, sc: string, c: string,
        sub: string){
        this.userInfo[0] = c;
        this.userInfo[2] = f;
        this.userInfo[3] = s;
        this.userInfo[4] = g;
        this.userInfo[5] = sc;
        this.userInfo[6] = sub;
        this.driver.update(c, this.userInfo);
        this.userInfo = this.driver.loggedIn;
    }
    //only occurs in register.ts
    registerUser(f: string, s: string, type: string, sc: string, c: string, sub: string, em:string, pass:string){
        var mock_userInfo = this.userInfo;
        
        mock_userInfo[0] = c;
        mock_userInfo[1] = pass;
        mock_userInfo[2] = f;
        mock_userInfo[3] = s;
        mock_userInfo[4] = type;
        mock_userInfo[5] = sc;
        mock_userInfo[6] = sub;
        mock_userInfo[7] = em;
        this.users.push({   "userId": f,
                            "firstname": f,
                            "lastname": s,
                            "mobile": c,
                            "type": type,
                            "email": em,
                            "password": pass,
                            "picture": "assets/img/man.png"
                        })
        if (this.driver.add(c, mock_userInfo)){
            this.userInfo = this.driver.loggedIn;
            return true;
        }
        else{
            return false;
        }
        
    }
    //only occurs in login.ts
    login(num: string, pw: string){
        if(this.driver.loginCheck(num, pw)){
            this.userInfo = this.driver.loggedIn;
            return true;
        }
        else{
            return false;
        }
    }
    logout(){
        this.driver.logout();
    }
    getDetails(num: string) {
        var foundResult = this.users.filter(function( obj ) {
            return obj.mobile == num;
        });

        return foundResult[0];
    }
    getName(num: string) {
        var foundResult = this.users.filter(function( obj ) {
            return obj.mobile == num;
        });

        return foundResult[0].firstname.charAt(0) + ' '+ foundResult[0].lastname
    }
    getType(num: string) {
        var foundResult = this.users.filter(function( obj ) {
            return obj.mobile == num;
        });  

        return foundResult[0].type;
    }
    loginCheck(mobileId: string, pw: string){
        //FIRST FIND OBJECT WITH CELLPHONE NUMBER
        var foundResult = this.users.filter(function( obj ) {
            return obj.mobile == mobileId;
        });
        if(foundResult.length > 0 && mobileId == foundResult[0].mobile && pw == foundResult[0].password){
            return true;
        }
        else{
            return false;
        }
    }
    alreadyReg(num:string){
        var foundResult = this.users.filter(function( obj ) {
            return obj.mobile == num;
        });
        if(foundResult.length > 0 && num == foundResult[0].mobile){
            return true;
        }
        else{
            return false;
        }
    }
}