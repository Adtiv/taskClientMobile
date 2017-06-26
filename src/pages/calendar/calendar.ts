import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
//import { CalendarEvent } from 'angular-calendar'; 

@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html'
})
export class CalendarPage implements OnInit{
    public date: Date = new Date(Date.now());
	events: any[];
    constructor(){
    }
    ngOnInit() {
        this.events = [
            {
                "title": "All Day Event",
                "start": "2016-01-01"
            },
            {
                "title": "Long Event",
                "start": "2016-01-07",
                "end": "2016-01-10"
            },
            {
                "title": "Repeating Event",
                "start": "2016-01-09T16:00:00"
            },
            {
                "title": "Repeating Event",
                "start": "2016-01-16T16:00:00"
            },
            {
                "title": "Conference",
                "start": "2016-01-11",
                "end": "2016-01-13"
            }
        ];
        console.log(this.events);
    }
}
