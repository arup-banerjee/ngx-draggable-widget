import { Component, ViewEncapsulation } from '@angular/core';
import { INgWidgetContainerConfig, INgWidgetConfig, INgWidgetEvent, NgWidgetContainer } from 'ngx-draggable-widget';

interface Box {
    id: number;
    config: any;
    name: string;
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  public boxes: Array<Box> = [];
  private rgb: string = '#efefef';
  private curNum;
  public gridConfig: INgWidgetContainerConfig = <INgWidgetContainerConfig> {
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
                  const dashconf = this._generateDefaultDashConfig();
                  for (let i = 0; i < dashconf.length; i++) {
                    const conf = dashconf[i];
                    conf.payload = 1 + i;
                    switch (i) {
                      case 0:
                        this.boxes[i] = { id: i + 1, config: conf, name: 'Simple Product Market' };
                        break;

                      case 1:
                         this.boxes[i] = { id: i + 1, config: conf, name: 'Simple Product Market' };
                         break;

                      case 2:
                         this.boxes[i] = { id: i + 1, config: conf, name: 'Assessment' };
                         break;

                      case 3:
                         this.boxes[i] = { id: i + 1, config: conf, name: 'Complex Product Market' };
                         break;

                      case 4:
                         this.boxes[i] = { id: i + 1, config: conf, name: 'Market Data' };
                         break;

                      default:
                        this.boxes[i] = { id: i + 1, config: conf, name: 'Assessment' };
                        break;
                    }
                  }
                  this.curNum = dashconf.length + 1;
  }

addBox(): void {
      const conf: INgWidgetConfig = this._generateDefaultItemConfig();
      conf.payload = this.curNum++;
      this.boxes.push({ id: conf.payload, config: conf, name: 'Some Market' });
}

removeWidget(index: number): void {
      if (this.boxes[index]) {
        this.boxes.splice(index, 1);
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

private _generateDefaultItemConfig(): INgWidgetConfig {
  return { 'dragHandle': '.handle', 'col': 1, 'row': 1, 'sizex': 1, 'sizey': 1 };
}


private _generateDefaultDashConfig(): INgWidgetConfig[] {
    return [
      //{ 'dragHandle': '.handle', 'col': 1, 'row': 1, 'sizex': 44, 'sizey': 25, 'resizable': false},
      //{ 'dragHandle': '.handle', 'col': 45, 'row': 1, 'sizex': 44, 'sizey': 25, 'resizable': false},
      //{ 'dragHandle': '.handle', 'col': 1, 'row': 2, 'sizex': 102, 'sizey': 1},
      //{ 'dragHandle': '.handle', 'col': 1, 'row': 3, 'sizex': 75, 'sizey': 1},
      //{ 'dragHandle': '.handle', 'col': 51, 'row': 26, 'sizex': 32, 'sizey': 40},
      //{ 'dragHandle': '.handle', 'col': 89, 'row': 1, 'sizex': 1, 'sizey': 1}];
        { 'dragHandle': '.handle', 'row': 1,  'col': 1,  'resizable': false, 'unitx': 2 },
        { 'dragHandle': '.handle', 'row': 1,  'col': 45, 'resizable': false, 'unitx': 2 },
        { 'dragHandle': '.handle', 'row': 1,  'col': 51, 'unitx': 1 },
        { 'dragHandle': '.handle', 'row': 26, 'col': 1,  'unitx': 4.6 },
        { 'dragHandle': '.handle', 'row': 51, 'col': 1,  'unitx': 4 },
        { 'dragHandle': '.handle', 'row': 76, 'col': 89, 'unitx': 1 }];
  }
}
