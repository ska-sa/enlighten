import { Injectable } from '@angular/core';


@Injectable() 
export class InstitutionsAccess {
    institutions = [{
                            "name": "University of Cape Town",
                            "founded": "1829",
                            "info": "assets/img/avatar-albert.jpg"
                        },
                        {
                            "name": "University of Pretoria",
                            "founded": "1829",
                            "info": "assets/img/avatar-albert.jpg"
                        },
                        {
                            "name": "Stellenbosch University",
                            "founded": "1829",
                            "info": "assets/img/avatar-albert.jpg"
                        },{
                            "name": "University of Witwatersrand",
                            "founded": "1829",
                            "info": "assets/img/avatar-albert.jpg"
                        },{
                            "name": "University of Johannesburg",
                            "founded": "1829",
                            "info": "assets/img/avatar-albert.jpg"
                        },{
                            "name": "Cape Peninsula University of Technology",
                            "founded": "1829",
                            "info": "assets/img/avatar-albert.jpg"
                        },]
    constructor () {}
    
    getUniversities() {
        
        var data = JSON.parse(`{"tutors": ${JSON.stringify(this.institutions)}
                                }`)
        return data.tutors;
            
    }

    getUniversity(id) {
        var result = this.institutions.filter(function( obj ) {
            return obj.name == id;
        });
        return result;
    }
}