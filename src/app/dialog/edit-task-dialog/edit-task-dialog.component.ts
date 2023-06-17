import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Task} from "../../model/Task";
import {Category} from "../../model/Category";
import {Priority} from "../../model/Priority";
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";
import {OperType} from "../oper-type";
import {DeviceDetectorService} from "ngx-device-detector";
import {CompleteType} from "../../model/CompleteType";

@Component({
  selector: 'app-edit-task-dialog',
  templateUrl: './edit-task-dialog.component.html',
  styleUrls: ['./edit-task-dialog.component.css']
})
export class EditTaskDialogComponent implements OnInit {

  categories!: Category[];
  priorities!: Priority[];

  dialogTitle!: string;
  task!: Task;
  operType!: OperType;

  tmpTitle!: string;
  tmpCategory!: Category;
  tmpPriority!: Priority;
  tmpDate: Date;

  readonly completed = CompleteType.COMPLETED;
  readonly uncompleted = CompleteType.UNCOMPLETED;

  constructor(
    private dialogRef: MatDialogRef<EditTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: [Task, string, OperType],
    private dialog: MatDialog,
    private deviceService: DeviceDetectorService
  ) {
  }

  ngOnInit(): void {
    this.task = this.data[0];
    this.dialogTitle = this.data[1];
    this.operType = this.data[2];

    this.tmpTitle = this.task.title;
    this.tmpCategory = this.task.category;
    this.tmpPriority = this.task.priority;
    this.tmpDate = this.task.date;
  }

  onConfirm(): void {
    this.task.title = this.tmpTitle;
    this.task.category = this.tmpCategory;
    this.task.priority = this.tmpPriority;
    this.task.date = this.tmpDate;

    this.dialogRef.close(this.task);
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  delete(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent,
      {
        maxWidth: '500px',
        data: {
          dialogTitle: 'Подтвердите действие',
          message: 'Вы действительно хотите удалить задачу: "' + this.task.title + '"?'
        },
        autoFocus: false
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dialogRef.close('delete');
      }
    });
  }

  canDelete(): boolean {
    return this.operType === OperType.EDIT;
  }

  complete() {
    this.dialogRef.close('complete');
  }

  activate() {
    this.dialogRef.close('activate');
  }

  isMobile(): boolean {
    return this.deviceService.isMobile();
  }

  isTablet(): boolean {
    return this.deviceService.isTablet();
  }
}
