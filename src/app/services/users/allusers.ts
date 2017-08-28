import { Injectable } from '@angular/core';
import { userAccess } from "./users"


@Injectable() 
export class allUsers {
    private allusers: string[] =[];
    private alluserInfo: any[];
    public loggedIn: string[] = ["0","1","2","3","4","5","6","7"];
    private reg: boolean = false;
    private log: boolean = false;

    add(accNo: string, info: string[]){
        this.alreadyReg(accNo);
        if (!this.reg){
            localStorage.setItem(accNo, JSON.stringify(info));
            this.allusers.push(accNo);
            this.loggedIn = info;
            return true;
        }
        else{
            this.reg = false;
            return false;
        }

    }
    update(accNo: string, info: string[]){
        for (let a in allUsers){
            if(a == accNo){
                localStorage.setItem(accNo, JSON.stringify(info));
                this.loggedIn = info;
            }
        }
    }
    loginCheck(accNo: string, pw: string){
        for (let a in allUsers){
            if(a == accNo){
                let check: any = localStorage.getItem(accNo);
                let i: string[] = check ? JSON.parse(check): [];
                if(i[1] == pw){
                    this.log = true;
                    this.loggedIn = i;
                }
                else{
                    this.log = false;
                }
            }
        }
        if(this.log){
            this.log = false;
            return true;
        }
        else{
            return false;
        }
    }
    private alreadyReg(num:string){
        for (let a in allUsers){
            if(a == num){
                this.reg = true;
            }
        }
        
    }
    logout(){
        this.reg = false;
        this.log = false;
        this.loggedIn = [];
    }
}