import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {CategoriesComponent} from './views/categories/categories.component';
import {TasksComponent} from './views/tasks/tasks.component';
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatPaginatorModule} from "@angular/material/paginator";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatDialogModule} from "@angular/material/dialog";
import {EditTaskDialogComponent} from './dialog/edit-task-dialog/edit-task-dialog.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatNativeDateModule, MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {ConfirmDialogComponent} from './dialog/confirm-dialog/confirm-dialog.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {TaskDatePipe} from './pipe/task-date.pipe';

import {registerLocaleData} from "@angular/common";
import localeRu from "@angular/common/locales/ru";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {EditCategoryDialogComponent} from './dialog/edit-category-dialog/edit-category-dialog.component';
import {FooterComponent} from './views/footer/footer.component';
import {AboutComponent} from './dialog/about/about/about.component';
import {HeaderComponent} from './views/header/header/header.component';
import {StatComponent} from './views/statistics/stat/stat.component';
import {StatCardComponent} from './views/statistics/stat/stat-card/stat-card.component';
import {ColorPickerModule} from "ngx-color-picker";
import {PrioritiesComponent} from './views/priorities/priorities.component';
import {SettingsDialogComponent} from './dialog/settings-dialog/settings-dialog.component';
import {EditPriorityDialogComponent} from './dialog/edit-priority-dialog/edit-priority-dialog.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatDividerModule} from "@angular/material/divider";
import {DeviceDetectorService} from "ngx-device-detector";
import {HttpClientModule} from "@angular/common/http";
import {TASK_URL_TOKEN} from "./data/dao/impl/task.service";
import {CATEGORY_URL_TOKEN} from "./data/dao/impl/category.service";
import {PRIORITY_URL_TOKEN} from "./data/dao/impl/priority.service";
import {STAT_URL_TOKEN} from "./data/dao/impl/stat.service";

registerLocaleData(localeRu);

@NgModule({
  declarations: [
    AppComponent,
    CategoriesComponent,
    TasksComponent,
    EditTaskDialogComponent,
    ConfirmDialogComponent,
    TaskDatePipe,
    EditCategoryDialogComponent,
    FooterComponent,
    AboutComponent,
    HeaderComponent,
    StatComponent,
    StatCardComponent,
    PrioritiesComponent,
    SettingsDialogComponent,
    EditPriorityDialogComponent
  ],
  imports: [
    BrowserModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatOptionModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    ColorPickerModule,
    MatSidenavModule,
    MatDividerModule,
    HttpClientModule
  ],
  providers: [DeviceDetectorService,
    {provide: TASK_URL_TOKEN, useValue: 'http://localhost:8080/task'},
    {provide: CATEGORY_URL_TOKEN, useValue: 'http://localhost:8080/category'},
    {provide: PRIORITY_URL_TOKEN, useValue: 'http://localhost:8080/priority'},
    {provide: STAT_URL_TOKEN, useValue: 'http://localhost:8080/stat'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
