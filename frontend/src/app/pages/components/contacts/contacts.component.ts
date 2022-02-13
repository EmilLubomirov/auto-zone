import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-contacts',
    templateUrl: './contacts.component.html',
    styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
    mapUrl: string = (
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2933.348163315956!2d23." +
        "294734914918074!3d42.67516677916703!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13." +
        "1!3m3!1m2!1s0x40aa84e0f10b9af3%3A0xe208f424e0dcffa0!2z0LHRg9C7LiDigJ7QkdGK0L" +
        "vQs9Cw0YDQuNGP4oCcIDM3LCAxNDA4INC2LtC6LiDQodGC0YDQtdC70LHQuNGJ0LUsINCh0L7RhNC40Y8!" +
        "5e0!3m2!1sbg!2sbg!4v1604503335025!5m2!1sen!2sbg"
    );
    isMapLoading = true;

    constructor() { }

    ngOnInit(): void {
    }

    handleMapLoad(){
        this.isMapLoading = false;
    }

}
