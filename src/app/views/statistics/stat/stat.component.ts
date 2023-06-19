import {Component, Input, OnInit} from '@angular/core';
import {DashboardData} from "../../../object/DashboardData";

@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.css']
})
export class StatComponent implements OnInit {

  @Input()
  dash: DashboardData;

  @Input()
  showStat!: boolean;

  constructor() {
  }

  ngOnInit(): void {
  }

  getTotal(): number {
    if (this.dash) {
      return this.dash.completedTotal + this.dash.uncompletedTotal;
    } else return 0;
  }

  getCompletedCount(): number {
    if (this.dash) {
      return this.dash.completedTotal;
    } else return 0;
  }

  getUncompletedCount(): number {
    if (this.dash) {
      return this.dash.uncompletedTotal;
    } else return 0;
  }

  getCompletedPercent() {
    if (this.dash) {
      return this.dash.completedTotal? ((this.dash.completedTotal / this.getTotal()) * 100).toFixed(2) : 0;
    } else return 0;
  }

  getUncompletedPercent() {
    if (this.dash) {
      return this.dash.uncompletedTotal? ((this.dash.uncompletedTotal / this.getTotal()) * 100).toFixed(2) : 0;
    } else return 0;
  }
}
