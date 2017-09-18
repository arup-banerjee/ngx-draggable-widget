[![GitHub version](http://img.shields.io/github/release/arup-banerjee%2Fngx-draggable-widget.svg)](https://github.com/arup-banerjee/ngx-draggable-widget) 
[![npm version](http://img.shields.io/npm/v/ngx-draggable-widget.svg)](https://www.npmjs.com/package/ngx-draggable-widget) 
[![bower version](http://img.shields.io/bower/v/ngx-draggable-widget.svg)](https://libraries.io/bower/ngx-draggable-widget) 
[![license](http://img.shields.io/github/license/arup-banerjee%2Fngx-draggable-widget.svg)](https://github.com/arup-banerjee/ngx-draggable-widget/blob/master/LICENSE) 
[![open issues](http://img.shields.io/github/issues/arup-banerjee%2Fngx-draggable-widget.svg)](https://github.com/arup-banerjee/ngx-draggable-widget/issues) 
[![Chat on Gitter](https://img.shields.io/gitter/room/ngx-draggable-widget/lobby.svg)](https://gitter.im/ngx-draggable-widget/Lobby#) 

# Ngx Draggable Widget
Ngx Draggable Widget is a **_drag & drop , resize , cascade , overlap_** capable __"[ngWidgetContainer]"__ and __"[ngWidget]"__ structural directive component library for [Angular 4](http://angular.io).
The demo included in this repo follows the [Angular CLI based quick start](https://cli.angular.io/)

Check the live example at [Ngx Draggable Widget Demo with dynamic configuration](http://draggablewidgets.alanaamy.net/)

Or Check another live working example [Draggable Dashboard](http://draggabledashboard.alanaamy.net) which is a working typescript angular cli example project located at [draggable dashboard folder in the source](https://github.com/arup-banerjee/ngx-draggable-widget/tree/master/draggable-dashboard) using ngx-draggable-widget

#### Setup
----------

To use the Ngx Draggable Widget, simply run `npm install ngx-draggable-widget` and then include the `NgDraggableWidgetModule` in your project module imports (see Example for more details).

If you want help with development or try the demo, it's not hard. First you'll need to install [Node](http://nodejs.org) and check out a copy of the repo. Then run:

```shell
$ npm install
$ ng serve
```

This will give you a fully compiled version of the demo that you can run using the HTTP server of your choice.

`ng serve` will compile the demo and watch for any changes.

NOTE: By default Angular 4 and System.js are not listed as actual dependencies, but as peer dependencies, so that npm doesn't install them on systems that just require the install file. If they are not installed, this could cause `ng serve` or `ng build` to fail. To fix this, run `npm install angular systemjs` and rerun the build command.

## Angular cli projects and styles
If you are already using a cli project or creating a new cli project, you may find useful to add the NgDraggableWidget.css to the styles in .angular-cli.json. 
```javascript
        "styles": [
            "../node_modules/ngx-draggable-widget/NgDraggableWidget.css"
        ],
```
You can change the widget-container background-color for default to whichever suits you in your suitable scss , css file for example in style.scss or app.component.scss .. or wherever logical suits your need
like below
```javascript
.widget-container {
    background-color: #282828;
} 
```

#### Config
-----------

To use this in your own application, all you need to do is add the **`[ngWidgetContainer]`** attribute to your container element and **`[ngWidget]`** to each item. You can use this in conjunction with `NgFor` and or `ngSwitch` to create a truly dynamic Angular 4 dashboard of widgets.

To configure the widget container with your own options, it is as easy as adding them as the attribute value. The defaults for the widget container are:

#### Widget Container Defaults
|Property|Deafult|Description|
|:-------|:------|:----------|
|margins|10|The size of the margins of each widget item. Supports up to four values in the same way as CSS margins. Can be updated using setMargins()
|draggable|true|Whether the widgets can be dragged. Can be updated using enableDrag()/disableDrag()
|resizable|true|Whether the widgets can be resized. Can be updated using enableResize()/disableResize()
|max_cols|0|The maximum number of columns allowed. Set to 0 for infinite. Cannot be used with max_rows
|max_rows|0|The maximum number of rows allowed. Set to 0 for infinite. Cannot be used with max_cols
|visible_cols|0|The number of columns shown on screen when auto_resize is set to true. Set to 0 to not auto_resize. Will be overriden by max_cols
|visible_rows|0|The number of rows shown on screen when auto_resize is set to true. Set to 0 to not auto_resize. Will be overriden by max_rows
|min_cols|0|The minimum number of columns allowed. Can be any number greater than or equal to 1.
|min_rows|0|The minimum number of rows allowed. Can be any number greater than or equal to 1.
|col_width|2|The width of each column
|row_height|2|The height of each row
|cascade|up|The direction to cascade widgets ('up', 'right', 'down', 'left')
|min_width|100|The minimum width of a widget. If greater than col_width, this will update the value of min_cols
|min_height|100|The minimum height of an item. If greater than row_height, this will update the value of min_rows
|fix_to_grid|false|Fix all item movements to the widget container grid
|auto_style|true|Automatically add required element styles at run-time
|auto_resize|false|Automatically set col_width/row_height so that max_cols/max_rows fills the screen. Only has effect is max_cols or max_rows is set
|maintain_ratio|false|Attempts to maintain aspect ratio based on the colWidth/rowHeight values set in the config
|prefer_new|false|When adding new items, will use that items position ahead of existing items
|zoom_on_drag|false|Zoom out when dragging. Useful when widgets are outside the limits of the screen
|allow_overlap|false|When dragging or resize , the widegts will not cascade, instead they would overlap
|limit_to_screen|false|When resizing the screen, with this true and auto_resize false, the grid will re-arrange to fit the screen size. Please note, at present this only works with cascade direction up.
|widget_width_factor|22|number of pixels that defines a logical user defined width. By default this is not set.However if this is set then unitx in the respective widget will be used to set the initial size of the the widget and override sizex of the widget. Note this is only meaningful to the widgets if they specifically have unitx defined. Else this value has no effect
|widget_height_factor|22|number of pixels that defines a logical user defined height. By default this is not set.However if this is set then unity in the respective widget will be used to set the initial size of the the widget height and override sizey of the widget. Note this is only meaningful to the widgets if they specifically have unity defined. Else this value has no effect

#### The defaults for the widget item are:

|Property|Default|Description|
|:-------|:-----|:---------|
|col|1|The start column for the widget|
|row|1|The start row for the widget
|sizex|1|The start width in terms of columns for the widget
|sizey|1|The start height in terms of rows for the widget
|dragHandle|null|The selector to be used for the drag handle. If null, uses the whole widget
|resizeHandle|null|The selector to be used for the resize handle. If null, uses 'borderSize' pixels from the right for horizontal resize,
|borderSize|15|'borderSize' pixels from the bottom for vertical, and the square in the corner bottom-right for both
|fixed|false|If the widget should be cascaded or not. If yes, manual movement is required
|draggable|true|If the widget can be dragged. If this or the global setting is set to false, the widget cannot be dragged.
|resizable|true|If the widget can be resized. If this or the global setting is set to false, the widget cannot be resized.
|payload|null|An optional custom payload (string/number/object) to be used to identify the item for serialization
|maxCols|0|The maximum number of columns for a particular widget. This value will only override the value from the widget container (if set) if it is smaller
|minCols|0|The minimum number of columns for a particular widget. This value will only override the value from the widget if larger
|maxRows|0|The maximum number of rows for a particular widget. This value will only override the value from the widget container (if set) if it is smaller
|minRows|0|The minimum number of rows for a particular widget. This value will only override the value from the widget container if larger
|minWidth|0|The minimum width of a particular widget. This value will override the value from the widget container, as well as the minimum columns if the resulting size is larger
|minHeight|0|The minimum height of a particular widget. This value will override the value from the widget container, as well as the minimum rows if the resulting size is larger
|unitx|0|The unitx defines the initial logical width of the widget. The actual width in pixels is the multiple of this logical unit with the corresponding widget_width_factor
|unity|0|The unity defines the initial logical height of the widget. The actual height in pixels is the multiple of this logical unit with the corresponding widget_height_factor

#### Event Handling
-------------------

Both the `NgWidgetContainer` and `NgWidget` throw events when an item is moved or resized. The grid has the following:

```javascript
onDragStart(item)     //  When an item starts being dragged. Returns reference to corresponding NgGridItem
onDrag(item)          //  When an item moves while dragging. Returns reference to corresponding NgGridItem
onDragStop(item)      //  When an item stops being dragged. Returns reference to corresponding NgGridItem
onResizeStart(item)   //  When an item starts being resized. Returns reference to corresponding NgGridItem
onResize(item)        //  When an item is resized. Returns reference to corresponding NgGridItem
onResizeStop(item)    //  When an item stops being resized. Returns reference to corresponding NgGridItem
onItemChange(items)   //  When any item stops being dragged or resized. Returns an array of NgGridItemEvents in the order in which each item was added to the grid
```

The individual items will also throw the following events:

```javascript
onDragStart()     //  When the item starts being dragged.
onDrag()          //  When the item moves while dragging.
onDragStop()      //  When the item stops being dragged.
onDragAny()       //  When the item starts/stops/is being dragged.
onResizeStart()   //  When the item starts being resized.
onResize()        //  When the item is resized.
onResizeStop()    //  When the item stops being resized.
onResizeAny()     //  When the item starts/stops/is being resized.
onChangeStart()   //  When the item starts being dragged or resized.
onChange()        //  When the item is dragged or resized.
onChangeStop()    //  When the item stops being dragged or resized.
onChangeAny()     //  When the item starts/stops/is being dragged or resized.
onItemChange()    //  When either the item's grid size or position is changed.
```

Each event will also provide the following object to any callback functions:

```javascript
interface NgWidgetEvent {
    payload: any,   //  The item's optional custom payload (string/number/object) to be used to identify the item for serialization
    col: number,    //  The item's column position within the grid
    row: number,    //  The item's row position within the grid
    sizex: number,  //  The item's column size within the grid
    sizey: number,  //  The item's row size within the grid
    width: number,  //  The item's raw width value
    height: number, //  The item's raw height value
    left: number,   //  The item's offset left value
    top: number     //  The item's offset top value
}
```

#### Styling
------------

There are three elements that can be styled with ngx-draggable-widget, the container itself `.widget-container`, the items `.widget` and the placeholder `.widget-placeholder`. The demo includes some basic styling in NgWidgetContainer.css which you can include in your app's `styleUrls` property. It also includes some @media queries styles to handle responsiveness on smaller screens. This simple force the boxes to full width and puts them inline in their original order. This is optional functionality and does not need to be included. In order for correct functionality, the required styles are added by the classes themselves at run-time:

```css
.widget-container {
    position: relative;
}

.widget {
    position: absolute;
}

.widget.moving {
    z-index: z-index + 1;
}

.widget-placeholder {
    position: absolute;
}
```

You can prevent these styles being automatically added by setting the value of `'auto_size'` to be `false`. You will then need to ensure that they are correctly incorporated into your user styles instead.

NOTE: The widget container sets the values `width, height, left, top` in CSS to move and resize the elements. This cannot be disabled.

#### Example
------------

The **`NgDraggableContainer`** and **`NgWidget`** can be configured by binding directly to the directive. The `NgWidget` supports two-way binding so you don't need to bind to any of the above events. The `NgWidgetChange` event emits under the same conditions as `onChangeStop`. The only config values that will change are `col`, `row`, `sizex` and `sizey`; the rest of your configuration will persist. You can then use these values for serialization of the grid. By binding the configuration this way, you are able to update the values on the fly. Here is an example template of the grid with two-way item bindings:

```html
<div [ngWidgetContainer]="{'resizeable': false, 'margins': [5, 10]}">
    <div *ngFor="let widget of widgets" [(ngWidget)]="widget.config">
        <div class="title">{{widget.title}}</div>
        <p>{{widget.text}}</p>
    </div>
</div>
```

In order to include the relevant files, you will need to import the `NgDraggableWidgetModule` to your app and add them to the `@NgModule` imports. This can be achieved by adding:

```typescript
import { NgDraggableWidgetModule } from 'ngx-draggable-widget';
```

to your typescript imports, and ensuring that your `@NgModule` annotation looks similar to the following:

```typescript
@NgModule({
    ...,
    imports: [
        ...,
        NgDraggableWidgetModule,
        ...
    ],
    ...
})
```

As of the Angular 4 Release Candidate you will now need to have the following in your System.js configuration, assuming that you are following the same format as the [Angular 2 Quick Start](https://angular.io/docs/ts/latest/quickstart.html):

```
map: {
    'ngx-draggable-widget': 'node_modules/ngx-draggable-widget/dist/js'
}

packages: {
    'ngx-draggable-widget': { main: 'main.js',  defaultExtension: 'js' }
}
```

Alternatively, you can use the bundled version by setting the `map` value to `'node_modules/ngx-draggable-widget/dist/bundles'` and the `main` value within packages to `NgDraggableWidget.min.js`.

## Credits

The library is inspired by [angular2-grid](https://github.com/BTMorton/angular2-grid)