import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";
import {OperType} from "../oper-type";
import {Category} from "../../model/Category";
import {DialogAction, DialogResult} from "../../object/DialogResult";

@Component({
  selector: 'app-edit-category-dialog',
  templateUrl: './edit-category-dialog.component.html',
  styleUrls: ['./edit-category-dialog.component.css']
})
export class EditCategoryDialogComponent implements OnInit {

  dialogTitle!: string;
  category!: Category;
  operType!: OperType;

  constructor(
    private dialogRef: MatDialogRef<EditCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: [Category, string, OperType],
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.category = this.data[0];
    this.dialogTitle = this.data[1];
    this.operType = this.data[2];
  }

  onConfirm(): void {
    this.dialogRef.close(new DialogResult(DialogAction.SAVE, this.category));
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
          message: 'Вы действительно хотите удалить категорию: "' + this.category.title + '"? (задачи не будут удалены)'
        },
        autoFocus: false
      });

    dialogRef.afterClosed().subscribe(result => {
      if (!(result)) {
        return
      }

      if (result.action === DialogAction.OK) {
        this.dialogRef.close(new DialogResult(DialogAction.DELETE));
      }
    });
  }

  canDelete(): boolean {
    return this.operType === OperType.EDIT;
  }
}
