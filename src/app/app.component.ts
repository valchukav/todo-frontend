import {Component, OnInit} from '@angular/core';
import {Task} from "./model/Task";
import {Category} from "./model/Category";
import {Priority} from "./model/Priority";
import {IntroService} from "./service/intro.service";
import {DeviceDetectorService} from "ngx-device-detector";
import {MatDrawerMode} from "@angular/material/sidenav";
import {CategoryService} from "./data/dao/impl/category.service";
import {CategorySearchValues, TaskSearchValues} from "./data/dao/search/SearchObjects";
import {TaskService} from "./data/dao/impl/task.service";
import {PageEvent} from "@angular/material/paginator";
import {PriorityService} from "./data/dao/impl/priority.service";
import {MatDialog} from "@angular/material/dialog";
import {Observable} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'todo';

  categories!: Category[];
  selectedCategory!: Category;
  uncompletedCountForCategoryAll!: number;
  categorySearchValues = new CategorySearchValues(null);

  tasks!: Task[];
  taskSearchValues = new TaskSearchValues();
  totalTasksFounded!: number;

  priorities!: Priority[];

  showStat!: boolean;
  showSearch = true;

  showSidebar!: boolean;
  sidebarMode: MatDrawerMode;

  isMobile!: boolean;
  isTablet!: boolean;

  constructor(
    private categoryService: CategoryService,
    private taskService: TaskService,
    private priorityService: PriorityService,
    private dialog: MatDialog,
    private introService: IntroService,
    private deviceService: DeviceDetectorService
  ) {
    this.isMobile = this.deviceService.isMobile();
    this.isTablet = this.deviceService.isTablet();

    this.showStat = !this.isMobile;
  }

  ngOnInit(): void {
    this.fillAllCategories().subscribe(result => {
      this.categories = result;
      this.onSelectCategory(this.selectedCategory);
    });

    this.fillAllPriorities();

    if (!this.isMobile && !this.isTablet) {
      this.introService.startIntroJS(true);
    }

    this.setSidebarSettings();
  }

  private setSidebarSettings() {
    if (this.isMobile || this.isTablet) {
      this.showSidebar = false;
      this.sidebarMode = 'push';
    } else {
      this.showSidebar = true;
      this.sidebarMode = 'side';
    }
  }

  private fillAllCategories(): Observable<Category[]> {
    return this.categoryService.getAll();
  }

  onSelectCategory(category: Category) {
    this.selectedCategory = category;

    this.taskSearchValues.categoryId = category? category.id : null;

    this.onSearchTasks(this.taskSearchValues);

    if (this.isMobile) {
      this.onCloseMenu();
    }
  }

  onUpdateTask(task: Task): void {
    this.taskService.update(task).subscribe(result => {
      this.onSearchTasks(this.taskSearchValues);
    });
  }

  onDeleteTask(task: Task): void {
    this.taskService.delete(task.id).subscribe(result => {
      this.onSearchTasks(this.taskSearchValues);
    });
  }

  onAddTask(task: Task): void {
    this.taskService.add(task).subscribe(result => {
      this.onSearchTasks(this.taskSearchValues);
    });
  }

  onDeleteCategory(category: Category) {
    this.categoryService.delete(category.id).subscribe(result => {
      this.onSearchCategory(this.categorySearchValues);
    })
  }

  onUpdateCategory(category: Category) {
    this.categoryService.update(category).subscribe(result => {
      this.onSearchCategory(this.categorySearchValues);
    })
  }

  onAddCategory(category: Category): void {
    this.categoryService.add(category).subscribe(result => {
      this.onSearchCategory(this.categorySearchValues);
    })
  }

  onSearchCategory(searchValues: CategorySearchValues) {
    this.categoryService.search(searchValues).subscribe(result => {
      this.categories = result;
    });
  }

  onSearchTasks(searchValues: TaskSearchValues) {
    this.taskSearchValues = searchValues;

    // this.cookiesUtils.setCookie(this.cookieTaskSearchValues, JSON.stringify(this.taskSearchValues));

    this.taskService.search(this.taskSearchValues).subscribe(result => {
      if (result.totalPages > 0 && this.taskSearchValues.pageNumber >= result.totalPages) {
        this.taskSearchValues.pageNumber = 0;
        this.onSearchTasks(this.taskSearchValues);
      }

      this.totalTasksFounded = result.totalElements;
      this.tasks = result.content;
    })
  }

  onFilterTasksByStatus(status: boolean) {
    // this.statusFilter = status;
    this.updateTasks();
  }

  onFilterTasksByPriority(priority: Priority): void {
    // this.priorityFilter = priority;
    this.updateTasks();
  }

  toggleStat(showStat: boolean) {
    this.showStat = showStat;
  }

  onCloseMenu() {
    this.showSidebar = false;
  }

  toggleMenu() {
    this.showSidebar = !this.showSidebar;
  }

  private updateTasksAndStat(): void {
    this.updateTasks();
    this.updateStat();
  }

  private updateTasks() {
    // this.dataHandler.searchTasks(
    //   this.selectedCategory,
    //   this.searchTaskText,
    //   this.statusFilter,
    //   this.priorityFilter
    // ).subscribe((tasks: Task[]) => this.tasks = tasks);
  }

  private updateStat(): void {
    // zip(
    //   this.dataHandler.getTotalCountInCategory(this.selectedCategory),
    //   this.dataHandler.getCompletedCountInCategory(this.selectedCategory),
    //   this.dataHandler.getUncompletedCountInCategory(this.selectedCategory),
    //   this.dataHandler.getUncompletedTotalCount())
    //   .subscribe((array: number[]) => {
    //     this.totalTasksCountInCategory = array[0];
    //     this.completedTasksCountInCategory = array[1];
    //     this.uncompletedTasksCountInCategory = array[2];
    //     this.uncompletedTotalTasksCount = array[3];
    //   });
  }

  paging(pageEvent: PageEvent) {

    if (this.taskSearchValues.pageSize !== pageEvent.pageSize) {
      this.taskSearchValues.pageNumber = 0;
    } else {
      this.taskSearchValues.pageNumber = pageEvent.pageIndex;
    }

    this.taskSearchValues.pageSize = pageEvent.pageSize;

    this.onSearchTasks(this.taskSearchValues);
  }

  private fillAllPriorities() {
    this.priorityService.getAll().subscribe(result => {
      this.priorities = result;
    })
  }

  onToggleSearch(showSearch: boolean) {
    this.showSearch = showSearch;
  }
}
