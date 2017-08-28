import { Injectable } from '@angular/core';


@Injectable() 
export class AppointmentAccess {
    constructor () {}

    getAppointments() {
        var appointments = `{
                            "subject": "Physics",
                            "type": "contact",
                            "duration": "25 minutes",
                            "module": "Electromagnetism",
                            "date": "Tuesday, Jun 20",
                            "price": "R100",
                            "tutorid": "123albert"
                        },
                        {
                            "subject": "Mathematics",
                            "type": "contacts",
                            "duration": "1 hour",
                            "module": "Double Integration",
                            "date": "Saturday, Jul 29",
                            "price": "R250",
                            "tutorid": "123isaac"
                        },
                        {
                            "subject": "Geology",
                            "type": "contact",
                            "duration": "1 hour",
                            "module": "The Rock Cycle",
                            "date": "Thursday, Jun 29",
                            "price": "R250",
                            "tutorid": "123ricardo"
                        }`
        var data = JSON.parse(`{"appointments": [${appointments}]
                                }`)
        return data.appointments;
            
    }
}