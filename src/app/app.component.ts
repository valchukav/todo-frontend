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
import {CookieUtils} from "./util/CookieUtils";
import {SpinnerService} from "./service/spinner.service";

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
  taskSearchValues: TaskSearchValues;
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

  cookieUtils = new CookieUtils();

  spinner: SpinnerService;

  readonly cookieTaskSearchValues = 'todo:searchValues';
  readonly cookieShowStat = 'todo:showStat';
  readonly cookieShowSearch = 'todo:showSearch';

  constructor(
    private categoryService: CategoryService,
    private taskService: TaskService,
    private priorityService: PriorityService,
    private statService: StatService,
    private dialog: MatDialog,
    private introService: IntroService,
    private deviceService: DeviceDetectorService,
    private spinnerService: SpinnerService
  ) {
    this.spinner = spinnerService;

    this.isMobile = this.deviceService.isMobile();
    this.isTablet = this.deviceService.isTablet();

    this.statService.getOverallStat().subscribe(result => {
      this.stat = result;
      this.uncompletedCountForCategoryAll = this.stat.uncompletedTotal;

      this.fillAllCategories().subscribe(result => {
        this.categories = result;

        if (!this.initSearchCookie()) {
          this.taskSearchValues = new TaskSearchValues();
        }

        this.initShowStatCookie();
        this.initShowSearchCookie();

        this.onSelectCategory(this.selectedCategory);
      });
    });
  }

  ngOnInit(): void {
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

    this.cookieUtils.setCookie(this.cookieTaskSearchValues, JSON.stringify(this.taskSearchValues));

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
    this.cookieUtils.setCookie(this.cookieShowStat, JSON.stringify(this.showStat));
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
    this.cookieUtils.setCookie(this.cookieShowSearch, JSON.stringify(this.showSearch));
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

  private initSearchCookie(): boolean {

    const cookie = this.cookieUtils.getCookie(this.cookieTaskSearchValues);

    if (!cookie) {
      return false;
    }

    const cookieJSON = JSON.parse(cookie);

    this.taskSearchValues = new TaskSearchValues();

    const tmpPageSize = cookieJSON.pageSize;
    if (tmpPageSize) {
      this.taskSearchValues.pageSize = Number(tmpPageSize);
    }

    const tmpCategoryId = cookieJSON.categoryId;
    if (tmpCategoryId) {
      this.taskSearchValues.categoryId = Number(tmpCategoryId);
      this.selectedCategory = this.getCategoryFromArray(tmpCategoryId);
    }

    const tmpPriorityId = cookieJSON.priorityId;
    if (tmpPriorityId) {
      this.taskSearchValues.priorityId = Number(tmpPriorityId);
    }

    const tmpTitle = cookieJSON.title;
    if (tmpTitle) {
      this.taskSearchValues.title = tmpTitle;
    }

    const tmpSortColumn = cookieJSON.sortColumn;
    if (tmpSortColumn) {
      this.taskSearchValues.sortColumn = tmpSortColumn;
    }

    const tmpSortDirection = cookieJSON.sortDirection;
    if (tmpSortDirection) {
      this.taskSearchValues.sortDirection = tmpSortDirection;
    }

    return true;
  }

  private initShowStatCookie() {
    if (!this.isMobile && !this.isTablet) {
      const val = this.cookieUtils.getCookie(this.cookieShowStat);
      if (val) {
        this.showStat = val === 'true';
      }
    }
  }

  private initShowSearchCookie() {
    const val = this.cookieUtils.getCookie(this.cookieShowSearch);
    if (val) {
      this.showSearch = val === 'true';
    }
  }

  private getCategoryFromArray(tmpCategoryId: number) {
    return this.categories.find(cat => cat.id === tmpCategoryId);
  }
}
