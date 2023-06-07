import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {AboutComponent} from "../../dialog/about/about/about.component";
import {DeviceDetectorService} from "ngx-device-detector";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  year: string;

  constructor(
    private dialog: MatDialog,
    private deviceService: DeviceDetectorService
  ) {
  }

  ngOnInit(): void {
    this.year = new Date().getFullYear().toString();
  }

  openAboutDialog(): void {
    this.dialog.open(AboutComponent,
      {
        autoFocus: false,
        data: {
          dialogTitle: 'О программе',
          message: 'Учебное приложение на платформе Angular'
        },
        width: '400px'
      });
  }

  isMobile(): boolean {
    return this.deviceService.isMobile();
  }
}
