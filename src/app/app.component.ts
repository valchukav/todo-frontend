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
import {Stat} from "./model/Stat";
import {DashboardData} from "./object/DashboardData";
import {StatService} from "./data/dao/impl/stat.service";

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
  showSearch!: boolean;

  stat!: Stat;
  dash: DashboardData = new DashboardData();

  showSidebar!: boolean;
  sidebarMode: MatDrawerMode;

  isMobile!: boolean;
  isTablet!: boolean;

  constructor(
    private categoryService: CategoryService,
    private taskService: TaskService,
    private priorityService: PriorityService,
    private statService: StatService,
    private dialog: MatDialog,
    private introService: IntroService,
    private deviceService: DeviceDetectorService
  ) {
    this.isMobile = this.deviceService.isMobile();
    this.isTablet = this.deviceService.isTablet();

    this.showStat = (!this.isMobile && !this.isTablet);
    this.showSearch = (!this.isMobile && !this.isTablet);
  }

  ngOnInit(): void {
    this.statService.getOverallStat().subscribe(result => {
      this.stat = result;
      this.uncompletedCountForCategoryAll = this.stat.uncompletedTotal;

      this.fillAllCategories().subscribe(result => {
        this.categories = result;
        this.onSelectCategory(this.selectedCategory);
      });
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

  private fillDashData(completedCount: number, uncompletedCount: number) {
    this.dash.completedTotal = completedCount;
    this.dash.uncompletedTotal = uncompletedCount;
  }

  onSelectCategory(category: Category) {
    this.selectedCategory = category;

    this.taskSearchValues.categoryId = category ? category.id : null;

    if (this.selectedCategory) {
      this.fillDashData(this.selectedCategory.completedCount, this.selectedCategory.uncompletedCount);
    } else {
      this.fillDashData(this.stat.completedTotal, this.stat.uncompletedTotal);
    }

    this.onSearchTasks(this.taskSearchValues);

    if (this.isMobile) {
      this.onCloseMenu();
    }
  }

  onUpdateTask(task: Task): void {
    this.taskService.update(task).subscribe(result => {
      if (task.oldCategory) {
        this.updateCategoryCounter(task.oldCategory);
      }

      if (task.category) {
        this.updateCategoryCounter(task.category);
      }

      this.updateOverallCounter();
      this.onSearchTasks(this.taskSearchValues);
    });
  }

  onDeleteTask(task: Task): void {
    this.taskService.delete(task.id).subscribe(result => {
      if (task.category) {
        this.updateCategoryCounter(task.category);
      }

      this.updateOverallCounter();
      this.onSearchTasks(this.taskSearchValues);
    });
  }

  onAddTask(task: Task): void {
    this.taskService.add(task).subscribe(result => {

      if (task.category) {
        this.updateCategoryCounter(task.category);
      }

      this.updateOverallCounter();
      this.onSearchTasks(this.taskSearchValues);
    });
  }

  onDeleteCategory(category: Category) {
    this.categoryService.delete(category.id).subscribe(result => {
      this.selectedCategory = null;

      this.onSearchCategory(this.categorySearchValues);
      this.onSelectCategory(this.selectedCategory);
    })
  }

  onUpdateCategory(category: Category) {
    this.categoryService.update(category).subscribe(result => {
      this.onSearchCategory(this.categorySearchValues);
      this.onSearchTasks(this.taskSearchValues);
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

  toggleStat(showStat: boolean) {
    this.showStat = showStat;
  }

  onCloseMenu() {
    this.showSidebar = false;
  }

  toggleMenu() {
    this.showSidebar = !this.showSidebar;
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

  private updateCategoryCounter(category: Category) {
    this.categoryService.get(category.id).subscribe(result => {
      this.categories[this.getCategoryIndex(category)] = result;

      this.showCategoryDashboard(result);
    });
  }

  private getCategoryIndex(category: Category): number {
    const tmpCategory = this.categories.find(t => t.id === category.id);
    return this.categories.indexOf(tmpCategory);
  }

  private showCategoryDashboard(category: Category) {
    if (this.selectedCategory && this.selectedCategory.id === category.id) {
      this.fillDashData(category.completedCount, category.uncompletedCount);
    }
  }

  private updateOverallCounter() {
    this.statService.getOverallStat().subscribe(result => {
      this.stat = result;

      this.uncompletedCountForCategoryAll = this.stat.uncompletedTotal;
      if (!this.selectedCategory) {
        this.fillDashData(this.stat.completedTotal, this.stat.uncompletedTotal);
      }
    });
  }

  onSettingsChanged(priorities: Priority[]) {
    this.priorities = priorities;
    this.onSearchTasks(this.taskSearchValues);
  }
}
