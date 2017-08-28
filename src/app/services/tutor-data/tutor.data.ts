import { Injectable } from '@angular/core';


@Injectable() 
export class TutorAccess {
    tutors = [{
                            "name": "Albert Einstein",
                            "likes": "100",
                            "image": "assets/img/avatar-albert.jpg",
                            "institution": "University of Zürich",
                            "subjects": ["Mathematics","Physics"],
                            "status": "online",
                            "tutorid": "123albert"
                        },
                        {
                            "name": "Isaac Newton",
                            "likes": "981",
                            "image": "assets/img/isaac.jpg",
                            "institution": "Trinity College, Cambridge",
                            "subjects": ["Mathematics","Physics"],
                            "status": "offline",
                            "tutorid": "123isaac"
                        },
                        {
                            "name": "Pierre-Simon Laplace",
                            "likes": "11",
                            "image": "assets/img/man.png",
                            "institution": "University of Caen Normandy",
                            "subjects": ["Mathematics","Geology"],
                            "status": "away",
                            "tutorid": "123ricardo"
                        }]
    constructor () {}
    
    getTutors() {
        
        var data = JSON.parse(`{"tutors": ${JSON.stringify(this.tutors)}
                                }`)
        return data.tutors;
            
    }

    getTutor(id) {
        var result = this.tutors.filter(function( obj ) {
            return obj.tutorid == id;
        });
        return result;
    }
}