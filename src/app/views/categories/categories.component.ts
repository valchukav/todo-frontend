import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Category} from "../../model/Category";
import {MatDialog} from "@angular/material/dialog";
import {EditCategoryDialogComponent} from "../../dialog/edit-category-dialog/edit-category-dialog.component";
import {OperType} from "../../dialog/oper-type";
import {DeviceDetectorService} from "ngx-device-detector";
import {CategorySearchValues} from "../../data/dao/search/SearchObjects";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  private _categories!: Category[];

  private _categorySearchValues!: CategorySearchValues;

  @Output()
  selectCategory = new EventEmitter<Category>();

  @Output()
  deleteCategory = new EventEmitter<Category>();

  @Output()
  updateCategory = new EventEmitter<Category>();

  @Output()
  addCategory = new EventEmitter<string>();

  @Output()
  searchCategory = new EventEmitter<CategorySearchValues>();

  @Input()
  selectedCategory!: Category;

  @Input()
  uncompletedCountForCategoryAll!: number;

  filterTitle!: string;
  filterChanged = false;

  indexMouseMove: number;

  @Input('categories')
  set categories(value: Category[]) {
    this._categories = value;
  }

  @Input('categorySearchValues')
  set categorySearchValues(value: CategorySearchValues) {
    this._categorySearchValues = value;
  }

  constructor(
    private dialog: MatDialog,
    private deviceService: DeviceDetectorService
  ) {
  }

  ngOnInit(): void {
    this._categorySearchValues = new CategorySearchValues(null);
  }

  showTasksByCategory(category: Category) {
    if (this.selectedCategory === category) return;

    this.selectedCategory = category;

    this.selectCategory.emit(this.selectedCategory);
  }

  showEditIcon(index: number): void {
    this.indexMouseMove = index;
  }

  openEditDialog(category: Category): void {
    const dialogRef = this.dialog.open(EditCategoryDialogComponent, {
      data: [category.title, 'Редактирование категории', OperType.EDIT],
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'delete') {
        this.deleteCategory.emit(category);
        return;
      }

      if (typeof (result) === 'string') {
        category.title = result as string;

        this.updateCategory.emit(category);
        return;
      }
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(EditCategoryDialogComponent, {
      data: ['', 'Добавление категории', OperType.ADD],
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addCategory.emit(result as string);
      }
    });
  }

  search(): void {
    this.filterChanged = false;

    if (!this._categorySearchValues) {
      return;
    }

    this._categorySearchValues.title = this.filterTitle;
    this.searchCategory.emit(this._categorySearchValues);
  }

  clearAndSearch(): void {
    this.filterTitle = null;
    this.search();
  }

  checkFilterChanged(): boolean {
    this.filterChanged = this.filterTitle !== this._categorySearchValues.title;
    return this.filterChanged;
  }

  isTabletOrMobile(): boolean {
    return this.deviceService.isMobile() || this.deviceService.isTablet();
  }

  get categories(): Category[] {
    return this._categories;
  }

  get categorySearchValues(): CategorySearchValues {
    return this._categorySearchValues;
  }
}
