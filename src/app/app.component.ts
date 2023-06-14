import {Component, OnInit} from '@angular/core';
import {Task} from "./model/Task";
import {Category} from "./model/Category";
import {Priority} from "./model/Priority";
import {concatMap, map, zip} from "rxjs";
import {IntroService} from "./service/intro.service";
import {DeviceDetectorService} from "ngx-device-detector";
import {MatDrawerMode} from "@angular/material/sidenav";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'todo';

  categoryMap = new Map<Category, number>();

  tasks!: Task[];
  categories!: Category[];
  priorities!: Priority[];

  selectedCategory!: Category;
  searchTaskText = '';
  statusFilter!: boolean;
  priorityFilter!: Priority;

  searchCategoryTitle!: string;

  totalTasksCountInCategory!: number;
  completedTasksCountInCategory!: number;
  uncompletedTasksCountInCategory!: number;
  uncompletedTotalTasksCount!: number;

  showStat!: boolean;

  showSidebar!: boolean;
  sidebarMode: MatDrawerMode;

  isMobile!: boolean;
  isTablet!: boolean;

  constructor(
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

    this.fillCategories();

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

  private fillCategories(): void {

    if (this.categoryMap) {
      this.categoryMap.clear();
    }

    this.categories = this.categories.sort((a, b) => a.title.localeCompare(b.title));

    // this.categories.forEach(cat => {
    //   this.dataHandler.getUncompletedCountInCategory(cat).subscribe(count => {
    //     this.categoryMap.set(cat, count);
    //   })
    // });
  }

  onSelectCategory(category: Category) {
    this.selectedCategory = category;

    this.updateTasksAndStat();
  }

  onUpdateTask(task: Task): void {
    // this.dataHandler.updateTask(task).subscribe(() => {
    //     this.fillCategories();
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
    // this.dataHandler.deleteCategory(category.id).subscribe(cat => {
    //   this.selectedCategory = null;
    //   this.categoryMap.delete(cat);
    //   this.onSearchCategory(this.searchCategoryTitle);
    //   this.updateTasks();
    // });
  }

  onUpdateCategory(category: Category) {
    // this.dataHandler.updateCategory(category).subscribe(() => {
    //   this.onSearchCategory(this.searchCategoryTitle);
    // });
  }

  onAddCategory(title: string): void {
    // this.dataHandler.addCategory(title).subscribe(() => this.fillCategories());
  }

  onSearchCategory(title: string): void {
    this.searchCategoryTitle = title;

    // this.dataHandler.searchCategories(title).subscribe(
    //   categories => {
    //     this.categories = categories
    //     this.fillCategories();
    //   }
    // );
  }

  private updateCategories() {
    // this.categories.forEach(
    //   () => this.dataHandler.getAllCategories().subscribe(categories => this.categories = categories)
    // );
  }

  onSearchTasks(searchText: string) {
    this.searchTaskText = searchText;
    this.updateTasks();
  }

  onFilterTasksByStatus(status: boolean) {
    this.statusFilter = status;
    this.updateTasks();
  }

  onFilterTasksByPriority(priority: Priority): void {
    this.priorityFilter = priority;
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
}
