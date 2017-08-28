import { Injectable } from '@angular/core';


@Injectable() 
export class SubjectsAccess {
    subjects = [{
                            "name": "Mathematics",
                            "founded": "1829",
                            "info": "assets/img/avatar-albert.jpg"
                        },
                        {
                            "name": "Physical Sciences",
                            "founded": "1829",
                            "info": "assets/img/avatar-albert.jpg"
                        },
                        {
                            "name": "Life Sciences",
                            "founded": "1829",
                            "info": "assets/img/avatar-albert.jpg"
                        },{
                            "name": "Geography",
                            "founded": "1829",
                            "info": "assets/img/avatar-albert.jpg"
                        },{
                            "name": "Mathematics Literacy",
                            "founded": "1829",
                            "info": "assets/img/avatar-albert.jpg"
                        },{
                            "name": "English Home Language",
                            "founded": "1829",
                            "info": "assets/img/avatar-albert.jpg"
                        },]
    constructor () {}
    
    getSubjects() {
        
        var data = JSON.parse(`{"tutors": ${JSON.stringify(this.subjects)}
                                }`)
        return data.tutors;
            
    }

    getSubject(id) {
        var result = this.subjects.filter(function( obj ) {
            return obj.name == id;
        });
        return result;
    }
}