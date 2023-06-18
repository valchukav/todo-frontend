import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Task} from "../../model/Task";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
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
import {TaskSearchValues} from "../../data/dao/search/SearchObjects";
import {DialogAction} from "../../object/DialogResult";

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  displayedColumns: string[] = ['color', 'id', 'title', 'date', 'priority', 'category', 'operations', 'select'];
  dataSource!: MatTableDataSource<Task>;

  @ViewChild(MatPaginator, {static: false, read: true}) private paginator!: MatPaginator;
  @ViewChild(MatSort, {static: false}) private sort!: MatSort;

  tasks!: Task[];
  categories!: Category[];
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
  paging = new EventEmitter<PageEvent>();

  @Output()
  toggleSearch = new EventEmitter<boolean>();

  @Output()
  searchAction = new EventEmitter<TaskSearchValues>();

  @Input()
  selectedCategory!: Category;

  @Input()
  totalTasksFounded!: number;

  @Input()
  showSearch: boolean;

  private _taskSearchValues!: TaskSearchValues;

  readonly defaultSortColumn = 'title';
  readonly defaultSortDirection = 'asc';

  filterTitle!: string;
  filterCompleted!: CompleteType;
  filterPriorityId!: number;
  filterSortColumn = this.defaultSortColumn;
  filterSortDirection = this.defaultSortDirection;

  changed = false;

  isMobile!: boolean;
  isTablet!: boolean;

  readonly completed = CompleteType.COMPLETED;
  readonly uncompleted = CompleteType.UNCOMPLETED;

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
    this.initSearchValues();
  }

  @Input('categories')
  set setCategories(value: Category[]) {
    this.categories = value;
  }

  @Input('priorities')
  set setPriorities(value: Priority[]) {
    this.priorities = value;
  }

  @Input('taskSearchValues')
  set taskSearchValues(value: TaskSearchValues) {
    this._taskSearchValues = value;
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
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
      {data: [task, 'Редактирование задачи', OperType.EDIT, this.categories, this.priorities], autoFocus: false}
    );

    dialogRef.afterClosed().subscribe(result => {

      if (!result) {
        return
      }

      if (result.action === DialogAction.DELETE) {
        this.deleteTask.emit(task);
        return;
      }

      if (result.action === DialogAction.COMPLETE) {
        task.completeType = CompleteType.COMPLETED;
        this.updateTask.emit(task);
        return;
      }

      if (result.action === DialogAction.ACTIVATE) {
        task.completeType = CompleteType.UNCOMPLETED;
        this.updateTask.emit(task);
        return;
      }

      if (result.action === DialogAction.SAVE) {
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

  openAddTaskDialog() {
    const task = new Task(null, '', CompleteType.UNCOMPLETED, null, this.selectedCategory, null);

    const dialogRef = this.dialog.open(EditTaskDialogComponent,
      {data: [task, "Добавление задачи", OperType.ADD, this.categories, this.priorities]}
    );

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return
      }

      if (result.action === DialogAction.SAVE) {
        this.addTask.emit(task);
      }
    });
  }

  onPageChange(pageEvent: PageEvent) {
    this.paging.emit(pageEvent);
  }

  get taskSearchValues(): TaskSearchValues {
    return this._taskSearchValues;
  }

  onToggleSearch() {
    this.toggleSearch.emit(!this.showSearch);
  }

  checkFilterChanged() {
    this.changed = false;

    if (this.taskSearchValues.title !== this.filterTitle) {
      this.changed = true;
    }

    if (this.taskSearchValues.completeType !== this.filterCompleted) {
      this.changed = true;
    }

    if (this.taskSearchValues.priorityId !== this.filterPriorityId) {
      this.changed = true;
    }

    if (this.taskSearchValues.sortColumn !== this.filterSortColumn) {
      this.changed = true;
    }

    if (this.taskSearchValues.sortDirection !== this.filterSortDirection) {
      this.changed = true;
    }

    return this.changed;
  }

  changeSortDirection() {
    if (this.filterSortDirection === 'asc') {
      this.filterSortDirection = 'desc';
    } else {
      this.filterSortDirection = 'asc';
    }
  }

  initSearch() {
    this.taskSearchValues.title = this.filterTitle;
    this.taskSearchValues.completeType = this.filterCompleted;
    this.taskSearchValues.priorityId = this.filterPriorityId;
    this.taskSearchValues.sortColumn = this.filterSortColumn;
    this.taskSearchValues.sortDirection = this.filterSortDirection;

    this.searchAction.emit(this.taskSearchValues);

    this.changed = false;
  }

  clearSearchValues() {
    this.filterTitle = '';
    this.filterCompleted = null;
    this.filterPriorityId = null;
    this.filterSortColumn = this.defaultSortColumn;
    this.filterSortDirection = this.defaultSortDirection;

    this.changed = false;

    this.initSearch();
  }

  private initSearchValues() {
    if (!this.taskSearchValues) return;

    this.filterTitle = this.taskSearchValues.title;
    this.filterCompleted = this.taskSearchValues.completeType;
    this.filterPriorityId = this.taskSearchValues.priorityId;
    this.filterSortColumn = this.taskSearchValues.sortColumn;
    this.filterSortDirection = this.taskSearchValues.sortDirection;
  }
}
