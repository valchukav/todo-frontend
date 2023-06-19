import {Component, OnInit} from '@angular/core';
import {Priority} from "../../model/Priority";
import {MatDialogRef} from "@angular/material/dialog";
import {PriorityService} from "../../data/dao/impl/priority.service";
import {DialogAction, DialogResult} from "../../object/DialogResult";

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.css']
})
export class SettingsDialogComponent implements OnInit {

  priorities!: Priority[];
  settingsChanged = false;

  constructor(
    private dialogRef: MatDialogRef<SettingsDialogComponent>,
    private priorityService: PriorityService
  ) {
  }

  ngOnInit(): void {
    this.priorityService.getAll().subscribe(result => this.priorities = result);
  }

  onClose() {
    if (this.settingsChanged) {
      this.dialogRef.close(new DialogResult(DialogAction.SETTINGS_CHANGE, this.priorities));
    } else {
      this.dialogRef.close(new DialogResult(DialogAction.CANCEL));
    }
  }

  onAddPriority(priority: Priority): void {
    this.settingsChanged = true;

    this.priorityService.add(priority).subscribe(result => {
      this.priorities.push(result);
    });
  }

  onDeletePriority(priority: Priority): void {
    this.settingsChanged = true;

    this.priorityService.delete(priority.id).subscribe(() => {
        this.priorities.splice(this.getPriorityIndex(priority), 1);
      }
    );
  }

  onUpdatePriority(priority: Priority): void {
    this.settingsChanged = true;

    this.priorityService.update(priority).subscribe(() => {
        this.priorities[this.getPriorityIndex(priority)] = priority;
      }
    );
  }

  private getPriorityIndex(priority: Priority): number {
    const tmpPriority = this.priorities.find(t => t.id === priority.id);
    return this.priorities.indexOf(tmpPriority);
  }
}
