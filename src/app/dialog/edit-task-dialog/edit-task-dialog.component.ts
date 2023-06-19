import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Task} from "../../model/Task";
import {Category} from "../../model/Category";
import {Priority} from "../../model/Priority";
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";
import {OperType} from "../oper-type";
import {DeviceDetectorService} from "ngx-device-detector";
import {CompleteType} from "../../model/CompleteType";
import {DialogAction, DialogResult} from "../../object/DialogResult";

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

  newTitle!: string;
  newPriorityId!: number;
  newCategoryId!: number;
  oldCategoryId!: number;
  newDate!: Date;

  today = new Date();

  readonly completed = CompleteType.COMPLETED;
  readonly uncompleted = CompleteType.UNCOMPLETED;

  constructor(
    private dialogRef: MatDialogRef<EditTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: [Task, string, OperType, Category[], Priority[]],
    private dialog: MatDialog,
    private deviceService: DeviceDetectorService
  ) {
  }

  ngOnInit(): void {
    this.task = this.data[0];
    this.dialogTitle = this.data[1];
    this.operType = this.data[2];
    this.categories = this.data[3];
    this.priorities = this.data[4];

    this.newTitle = this.task.title;

    if (this.task.priority) {
      this.newPriorityId = this.task.priority.id;
    }

    if (this.task.category) {
      this.newCategoryId = this.task.category.id;
      this.oldCategoryId = this.task.category.id;
    }

    if (this.task.date) {
      this.newDate = new Date(this.task.date);
    }
  }

  onConfirm(): void {
    this.task.title = this.newTitle;
    this.task.priority = this.findPriorityById(this.newPriorityId);
    this.task.category = this.findCategoryById(this.newCategoryId);
    this.task.oldCategory = this.findCategoryById(this.oldCategoryId);

    if (!this.newDate) {
      this.task.date = null;
    } else {
      this.task.date = this.newDate;
    }

    this.dialogRef.close(new DialogResult(DialogAction.SAVE, this.task));
  }

  onCancel(): void {
    this.dialogRef.close(new DialogResult(DialogAction.CANCEL));
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
      if (!result) {
        return;
      }

      if (result.action === DialogAction.OK) {
        this.dialogRef.close(new DialogResult(DialogAction.DELETE));
      }
    });
  }

  canDelete(): boolean {
    return this.operType === OperType.EDIT;
  }

  complete() {
    this.dialogRef.close(new DialogResult(DialogAction.COMPLETE));
  }

  activate() {
    this.dialogRef.close(new DialogResult(DialogAction.ACTIVATE));
  }

  isMobile(): boolean {
    return this.deviceService.isMobile();
  }

  isTablet(): boolean {
    return this.deviceService.isTablet();
  }

  private findPriorityById(priorityId: number): Priority {
    return this.priorities.find(t => t.id === priorityId);
  }

  private findCategoryById(categoryId: number): Category {
    return this.categories.find(t => t.id === categoryId);
  }

  addDays(days: number) {
    this.newDate = new Date();
    this.newDate.setDate(this.today.getDate() + days)
  }

  setToday() {
    this.newDate = this.today;
  }
}
