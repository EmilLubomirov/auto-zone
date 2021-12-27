import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CloudinaryWidgetManager } from 'ngx-cloudinary-upload-widget';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-image-uploader',
    templateUrl: './image-uploader.component.html',
    styleUrls: ['./image-uploader.component.css']
})
export class ImageUploaderComponent implements OnInit {
    @Output() imageUploadEvent = new EventEmitter<string>();
    
    constructor (private manager: CloudinaryWidgetManager){ }

    ngOnInit(): void {
      
    }

    upload(): void {
        this.manager.open({ uploadPreset:environment.ANGULAR_APP_UPLOAD_PRESET }).subscribe((resp) => {
            if(resp.event === "success"){
                this.imageUploadEvent.emit(resp.info.secure_url);
            }
        }, (err) => {
          console.log('err', err);
        }, () => {
          console.log('complete');
        });
      }
}
