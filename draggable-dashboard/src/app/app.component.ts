import { Component, ViewEncapsulation } from '@angular/core';
import { INgWidgetContainerConfig, INgWidgetConfig, INgWidgetEvent, NgWidgetContainer } from 'ngx-draggable-widget';
import { MdToolbarModule } from '@angular/material';
import { MdButtonModule } from '@angular/material';

interface WidgetMetaData {
    id: number;
    config: any;
    name: string;
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  public widgets: Array<WidgetMetaData> = [];
  private rgb = '#efefef';
  private curNum;
  public widgetConfig: INgWidgetContainerConfig = <INgWidgetContainerConfig> {
                                      'margins': [5],
                                      'draggable': true,
                                      'resizable': true,
                                      'max_cols': 0,
                                      'max_rows': 0,
                                      'visible_cols': 0,
                                      'visible_rows': 0,
                                      'min_cols': 1,
                                      'min_rows': 1,
                                      'col_width': 2,
                                      'row_height': 2,
                                      'cascade': 'left',
                                      'min_width': 50,
                                      'min_height': 50,
                                      'fix_to_grid': false,
                                      'auto_style': true,
                                      'auto_resize': false,
                                      'maintain_ratio': false,
                                      'prefer_new': false,
                                      'zoom_on_drag': false,
                                      'limit_to_screen': false,
                                      'allow_overlap': false,
                                      'widget_width_factor': 22};
  private itemPositions: Array<any> = [];
  title = 'app';

  constructor() {
                  const dashboardconfig = this._generateDefaultDashBoardConfig();
                  for (let i = 0; i < dashboardconfig.length; i++) {
                    const conf = dashboardconfig[i];
                    conf.payload = 1 + i;
                    switch (i) {
                      case 0:
                        this.widgets[i] = { id: i + 1, config: conf, name: 'Widget Simple Product Market' };
                        break;

                      case 1:
                        this.widgets[i] = { id: i + 1, config: conf, name: 'Widget Simple Product Market' };
                         break;

                      case 2:
                        this.widgets[i] = { id: i + 1, config: conf, name: 'Widget Small' };
                         break;

                      case 3:
                        this.widgets[i] = { id: i + 1, config: conf, name: 'Widget Complex Product Market' };
                         break;

                      case 4:
                        this.widgets[i] = { id: i + 1, config: conf, name: 'Widget Market Data' };
                         break;

                      default:
                        this.widgets[i] = { id: i + 1, config: conf, name: 'Widget Small' };
                        break;
                    }
                  }
                  this.curNum = dashboardconfig.length + 1;
  }

  addWidget(): void {
      const conf: INgWidgetConfig = this._generateDefaultWidgetConfig();
      conf.payload = this.curNum++;
      this.widgets.push({ id: conf.payload, config: conf, name: 'Some Market' });
  }

  removeWidget(index: number): void {
    if (this.widgets[index]) {
      this.widgets.splice(index, 1);
      }
  }

  updateItem(index: number, event: INgWidgetEvent): void {
  // Do something here
  }

  onDrag(index: number, event: INgWidgetEvent): void {
  // Do something here
  }

  onResize(index: number, event: INgWidgetEvent): void {
  // Do something here
}

private _generateDefaultWidgetConfig(): INgWidgetConfig {
  return { 'dragHandle': '.handle', 'col': 1, 'row': 1, 'sizex': 1, 'sizey': 1 };
}


private _generateDefaultDashBoardConfig(): INgWidgetConfig[] {
    return [
      { 'dragHandle': '.handle', 'row': 1, 'col': 1, 'unitx': 2,  'resizable': false},
      { 'dragHandle': '.handle', 'row': 1, 'col': 2, 'unitx': 2,  'resizable': false},
      { 'dragHandle': '.handle', 'row': 1,  'col': 3,  'unitx': 1 },
      { 'dragHandle': '.handle', 'row': 26, 'col': 1,  'unitx': 5 },
      { 'dragHandle': '.handle', 'row': 51, 'col': 1,  'unitx': 4 },
      { 'dragHandle': '.handle', 'row': 76, 'col': 89, 'unitx': 1 }];
  }
}
      //{ 'dragHandle': '.handle', 'col': 1, 'row': 1, 'sizex': 44, 'sizey': 25, 'resizable': false},
      //{ 'dragHandle': '.handle', 'col': 45, 'row': 1, 'sizex': 44, 'sizey': 25, 'resizable': false},
      //{ 'dragHandle': '.handle', 'col': 1, 'row': 2, 'sizex': 102, 'sizey': 1},
      //{ 'dragHandle': '.handle', 'col': 1, 'row': 3, 'sizex': 75, 'sizey': 1},
      //{ 'dragHandle': '.handle', 'col': 51, 'row': 26, 'sizex': 32, 'sizey': 40},
      //{ 'dragHandle': '.handle', 'col': 89, 'row': 1, 'sizex': 1, 'sizey': 1}];
