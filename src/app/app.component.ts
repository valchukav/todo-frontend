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

  showStat!: boolean;

  showSidebar!: boolean;
  sidebarMode: MatDrawerMode;

  isMobile!: boolean;
  isTablet!: boolean;

  constructor(
    private categoryService: CategoryService,
    private taskService: TaskService,
    private introService: IntroService,
    private deviceService: DeviceDetectorService
  ) {
    this.isMobile = this.deviceService.isMobile();
    this.isTablet = this.deviceService.isTablet();

    this.showStat = !this.isMobile;
  }

  ngOnInit(): void {
    // this.dataHandler.getAllCategories().subscribe((categories: Category[]) => this.categories = categories);
    // this.dataHandler.getAllPriorities().subscribe((priorities: Priority[]) => this.priorities = priorities);

    this.fillAllCategories();

    this.onSelectCategory(null);

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

  private fillAllCategories(): void {
    this.categoryService.getAll().subscribe(result => {
      this.categories = result;
    });
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
    // this.dataHandler.updateTask(task).subscribe(() => {
    //     this.fillAllCategories();
    //     this.updateTasksAndStat();
    //   }
    // );
  }

  onDeleteTask(task: Task): void {
    // this.dataHandler.deleteTask(task).pipe(
    //   concatMap(task => {
    //     return this.dataHandler.getUncompletedCountInCategory(task.category).pipe(map(count => {
    //       return ({t: task, count});
    //     }))
    //   })).subscribe(result => {
    //   const t = result.t as Task;
    //
    //   if (t.category) {
    //     this.categoryMap.set(t.category, result.count);
    //   }
    //
    //   this.updateTasksAndStat();
    // });
  }

  onAddTask(task: Task): void {
    // this.dataHandler.addTask(task).pipe(
    //   concatMap(task => {
    //     return this.dataHandler.getUncompletedCountInCategory(task.category).pipe(map(count => {
    //       return ({t: task, count});
    //     }))
    //   })).subscribe(result => {
    //   const t = result.t as Task;
    //
    //   if (t.category) {
    //     this.categoryMap.set(t.category, result.count);
    //   }
    //
    //   this.updateTasksAndStat();
    // });
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

  private updateCategories() {
    // this.categories.forEach(
    //   () => this.dataHandler.getAllCategories().subscribe(categories => this.categories = categories)
    // );
  }

  onSearchTasks(searchValues: TaskSearchValues) {
    this.taskSearchValues = searchValues;

    this.taskService.search(this.taskSearchValues).subscribe(result => {
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

    console.log(pageEvent);

    if (this.taskSearchValues.pageSize !== pageEvent.pageSize) {
      this.taskSearchValues.pageNumber = 0;
    } else {
      this.taskSearchValues.pageNumber = pageEvent.pageIndex;
    }

    this.taskSearchValues.pageSize = pageEvent.pageSize;

    this.onSearchTasks(this.taskSearchValues);
  }
}
