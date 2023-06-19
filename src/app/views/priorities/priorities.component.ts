import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Priority} from "../../model/Priority";
import {MatDialog} from "@angular/material/dialog";
import {OperType} from "../../dialog/oper-type";
import {EditPriorityDialogComponent} from "../../dialog/edit-priority-dialog/edit-priority-dialog.component";
import {ConfirmDialogComponent} from "../../dialog/confirm-dialog/confirm-dialog.component";
import {DialogAction} from "../../object/DialogResult";

@Component({
  selector: 'app-priorities',
  templateUrl: './priorities.component.html',
  styleUrls: ['./priorities.component.css']
})
export class PrioritiesComponent implements OnInit {

  static defaultColor = '#fff';

  @Input()
  priorities!: Priority[];

  @Output()
  deletePriority = new EventEmitter<Priority>;

  @Output()
  updatePriority = new EventEmitter<Priority>;

  @Output()
  addPriority = new EventEmitter<Priority>;

  constructor(private dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  delete(priority: Priority): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '500px',
      data: {
        dialogTitle: 'Подтвердите действие',
        message: 'Вы действительно хотите удалить приоритет "' + priority.title + '"? В случае удаления задачи с данным приоритетом будут иметь статус "без приоритета".'
      },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!(result)) return;

      if (result.action === DialogAction.OK) {
        this.deletePriority.emit(priority);
      }
    });
  }

  onEditPriority(priority: Priority): void {
    const dialogRef = this.dialog.open(EditPriorityDialogComponent, {
      data: [new Priority(priority.id, priority.title, priority.color),
        'Редактирование приоритета',
        OperType.EDIT
      ]
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!(result)) return;

      if (result.action === DialogAction.DELETE) {
        this.deletePriority.emit(priority);
        return;
      }

      if (result.action === DialogAction.SAVE) {
        priority = result.obj as Priority;
        this.updatePriority.emit(priority);
        return;
      }
    });
  }

  onAddPriority(): void {
    const dialogRef = this.dialog.open(EditPriorityDialogComponent, {
      data: [new Priority(null, '', PrioritiesComponent.defaultColor),
        'Добавление приоритета',
        OperType.ADD
      ]
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!(result)) return;

      if (result.action === DialogAction.SAVE) {
        this.addPriority.emit(result.obj as Priority);
      }
    });
  }
}
