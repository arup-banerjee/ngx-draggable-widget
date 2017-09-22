import { INgWidgetContainerConfig } from "ngx-draggable-widget";

export const WIDGET_TYPES = {
    DEMO_DASHBOARD: 'demodashboard',
  };

  // TODO: is there a way to improve this?
  export type WidgetType = string;
  // A fake API on the internets.
  export const URLS = {
    [WIDGET_TYPES.DEMO_DASHBOARD]: 'http://www.mocky.io/v2/59c4c3cc1100002c0599ce96',
  };
  
  export interface WidgetMetaData {
      id: number;
      config: any;
      name: string;
  }

  export interface IWidgetDashboard {
    WidgetContainer: INgWidgetContainerConfig;
    Widgets: WidgetMetaData[];
  }

  export const fromServer = (record: any): WidgetMetaData => ({
    id: record.id,
    config: record.config,
    name: record.name,
  });

  export const containerConfig = {
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

   export const widgetmetadatas = [{"id":1,"config":{"dragHandle":".handle","row":1,"col":1,"unitx":2, "resizable":false,"payload": 1},"name":"Widget Simple Product Market"},{"id":2,"config":{"dragHandle":".handle","row":1,"col":2,"unitx":2,"resizable":false,"payload":2},"name":"Widget Simple Product Market"},{"id":3,"config":{"dragHandle":".handle","row":1,"col":3,"unitx":1,"payload":3},"name":"Widget Small"},{"id":4,"config":{"dragHandle":".handle","row":26,"col":1,"unitx":5,"payload":4},"name":"Widget Complex Product Market"},{"id":5,"config":{"dragHandle":".handle","row":51,"col":1,"unitx":4,"payload":5},"name":"Widget Market Data"},{"id":6,"config":{"dragHandle":".handle","row":76,"col":89,"unitx":1,"payload":6},"name":"Widget Small"}]

