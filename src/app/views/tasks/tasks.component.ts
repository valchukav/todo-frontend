import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Task} from "../../model/Task";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {EditTaskDialogComponent} from "../../dialog/edit-task-dialog/edit-task-dialog.component";
import {ConfirmDialogComponent} from "../../dialog/confirm-dialog/confirm-dialog.component";
import {Category} from "../../model/Category";
import {Priority} from "../../model/Priority";
import {OperType} from "../../dialog/oper-type";
import {PrioritiesComponent} from "../priorities/priorities.component";
import {DeviceDetectorService} from "ngx-device-detector";
import {CompleteType} from "../../model/CompleteType";

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  displayedColumns: string[] = ['color', 'id', 'title', 'date', 'priority', 'category', 'operations', 'select'];
  dataSource!: MatTableDataSource<Task>;

  @ViewChild(MatPaginator, {static: false}) private paginator!: MatPaginator;
  @ViewChild(MatSort, {static: false}) private sort!: MatSort;

  tasks!: Task[];
  priorities!: Priority[];

  @Output()
  updateTask = new EventEmitter<Task>();

  @Output()
  deleteTask = new EventEmitter<Task>();

  @Output()
  addTask = new EventEmitter<Task>();

  @Output()
  selectCategory = new EventEmitter<Category>();

  @Output()
  filterByTitle = new EventEmitter<string>();

  @Output()
  filterByStatus = new EventEmitter<boolean>();

  @Output()
  filterByPriority = new EventEmitter<Priority>();

  @Input()
  selectedCategory!: Category;

  searchTaskText!: string;
  selectedStatusFilter!: boolean;
  selectedPriorityFilter!: Priority;

  isMobile!: boolean;
  isTablet!: boolean;

  completed = CompleteType.COMPLETED;
  uncompleted = CompleteType.UNCOMPLETED;

  constructor(
    private dialog: MatDialog,
    private deviceService: DeviceDetectorService
  ) {

    this.isMobile = deviceService.isMobile();
    this.isTablet = deviceService.isTablet();
  }

  @Input('tasks')
  set setTasks(tasks: Task[]) {
    this.tasks = tasks;
    this.fillTable();
  }

  @Input('priorities')
  set setPriorities(value: Priority[]) {
    this.priorities = value;
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();

    this.onSelectCategory(null);
  }

  getPriorityColor(task: Task): string {
    if (task.completeType === CompleteType.COMPLETED) {
      return '#F8F9FA'
    }

    if (task.priority && task.priority.color) {
      return task.priority.color;
    }

    return PrioritiesComponent.defaultColor;
  }

  getMobilePriorityBgColor(task: Task): string {
    if (task.priority != null && task.completeType === CompleteType.UNCOMPLETED) {
      return task.priority.color;
    }

    return 'none';
  }

  private fillTable(): void {

    if (!this.dataSource) return;

    this.dataSource.data = this.tasks;

    this.addTableObjects();

    this.dataSource.sortingDataAccessor = (task: Task, colName: string): any => {

      switch (colName) {
        case 'priority':
          return task.priority ? task.priority.id : null;
        case 'category':
          return task.category ? task.category.title : null;
        case 'date':
          return task.date ? task.date : null;
        case 'title':
          return task.title;
      }
    };
  }

  private addTableObjects() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  openEditTaskDialog(task: Task): void {
    const dialogRef = this.dialog.open(
      EditTaskDialogComponent,
      {data: [task, 'Редактирование задачи', OperType.EDIT], autoFocus: false}
    );

    dialogRef.afterClosed().subscribe(result => {

      if (result === 'delete') {
        this.deleteTask.emit(task);
        return;
      }

      if (result === 'complete') {
        task.completeType = CompleteType.COMPLETED;
        this.updateTask.emit(task);
        return;
      }

      if (result === 'activate') {
        task.completeType = CompleteType.UNCOMPLETED;
        this.updateTask.emit(task);
        return;
      }

      if (result as Task) {
        this.updateTask.emit(task);
        return;
      }
    });
  }

  onToggleStatus(task: Task): void {
    if (task.completeType === CompleteType.COMPLETED) {
      task.completeType = CompleteType.UNCOMPLETED;
    } else {
      task.completeType = CompleteType.COMPLETED;
    }
    this.updateTask.emit(task);
  }

  openDeleteDialog(task: Task): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent,
      {
        maxWidth: '500px',
        data: {
          dialogTitle: 'Подтвердите действие',
          message: 'Вы действительно хотите удалить задачу: "' + task.title + '"?'
        },
        autoFocus: false
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteTask.emit(task);
      }
    });
  }

  onSelectCategory(category: Category): void {
    this.selectCategory.emit(category);
  }

  onFilterByTitle(): void {
    this.filterByTitle.emit(this.searchTaskText);
  }

  onFilterByStatus(param: boolean): void {
    if (param != this.selectedStatusFilter) {
      this.selectedStatusFilter = param;
      this.filterByStatus.emit(this.selectedStatusFilter);
    }
  }

  onFilterByPriority(priority: Priority): void {
    if (priority != this.selectedPriorityFilter) {
      this.selectedPriorityFilter = priority;
      this.filterByPriority.emit(this.selectedPriorityFilter);
    }
  }

  openAddTaskDialog() {
    const task = new Task(null, '', CompleteType.UNCOMPLETED, null, this.selectedCategory);

    const dialogRef = this.dialog.open(EditTaskDialogComponent,
      {data: [task, "Добавление задачи", OperType.ADD]}
    );

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addTask.emit(task);
      }
    });
  }
}
