// tslint:disable:max-line-length
// tslint:disable:quotemark
import { Component, Directive, ElementRef, Renderer, EventEmitter, ComponentFactoryResolver, Host, ViewEncapsulation, Type, ComponentRef, KeyValueDiffer, KeyValueDiffers, OnInit, OnDestroy, DoCheck, ViewContainerRef, Output } from '@angular/core';
import { INgWidgetConfig, INgWidgetEvent, INgWidgetPosition, INgWidgetSize, INgWidgetContainerRawPosition, INgWidgetDimensions, INgWidgetContainerConfig } from "../interfaces/INgDraggableWidgetConfig";
import { NgWidget } from './NgWidget';
import { NgWidgetPlaceholder } from '../components/NgWidgetPlaceholder';

@Directive({
	selector: '[ngWidgetContainer]',
	inputs: ['config: ngWidgetContainer'],
	host: {
		'(mousedown)': 'mouseDownEventHandler($event)',
		'(mousemove)': 'mouseMoveEventHandler($event)',
		'(mouseup)': 'mouseUpEventHandler($event)',
		'(touchstart)': 'mouseDownEventHandler($event)',
		'(touchmove)': 'mouseMoveEventHandler($event)',
		'(touchend)': 'mouseUpEventHandler($event)',
		'(window:resize)': 'resizeEventHandler($event)',
		'(document:mousemove)': 'mouseMoveEventHandler($event)',
		'(document:mouseup)': 'mouseUpEventHandler($event)'
	}
})
export class NgWidgetContainer implements OnInit, DoCheck, OnDestroy {
	// 	default config
	private static CONST_DEFAULT_CONFIG: INgWidgetContainerConfig = {
		margins: [10],
		draggable: true,
		resizable: true,
		max_cols: 0,
		max_rows: 0,
		visible_cols: 0,
		visible_rows: 0,
		col_width: 250,
		row_height: 250,
		cascade: 'left',
		min_width: 100,
		min_height: 100,
		fix_to_grid: false,
		auto_style: true,
		auto_resize: false,
		maintain_ratio: false,
		prefer_new: false,
		zoom_on_drag: false,
		allow_overlap: false,
		widget_width_factor: 0,
		widget_height_factor: 0
	};

	// 	event Emitters
	@Output() public onDragStart: EventEmitter<NgWidget> = new EventEmitter<NgWidget>();
	@Output() public onDrag: EventEmitter<NgWidget> = new EventEmitter<NgWidget>();
	@Output() public onDragStop: EventEmitter<NgWidget> = new EventEmitter<NgWidget>();
	@Output() public onResizeStart: EventEmitter<NgWidget> = new EventEmitter<NgWidget>();
	@Output() public onResize: EventEmitter<NgWidget> = new EventEmitter<NgWidget>();
	@Output() public onResizeStop: EventEmitter<NgWidget> = new EventEmitter<NgWidget>();
	@Output() public onItemChange: EventEmitter<Array<INgWidgetEvent>> = new EventEmitter<Array<INgWidgetEvent>>();

	// 	public variables
	public colWidth = 250;
	public rowHeight = 250;
	public minCols = 1;
	public minRows = 1;
	public marginTop = 10;
	public marginRight = 10;
	public marginBottom = 10;
	public marginLeft = 10;
	public isDragging = false;
	public isResizing = false;
	public autoStyle = true;
	public resizeEnable = true;
	public dragEnable = true;
	public cascade = 'up';
	public minWidth = 100;
	public minHeight = 100;
	public zIndex = 1;
	public allowOverlap = false;
	public widget_width_factor = 0;
	public widget_height_factor = 0;

	// 	private variables
	private _items: Array<NgWidget> = [];
	private _draggingItem: NgWidget = null;
	private _resizingItem: NgWidget = null;
	private _resizeDirection: string = null;
	private _itemGrid: { [key: number]: { [key: number]: NgWidget } } = {}; // { 1: { 1: null } };
	private _containerWidth: number;
	private _containerHeight: number;
	private _maxCols = 0;
	private _maxRows = 0;
	private _visibleCols = 0;
	private _visibleRows = 0;
	private _setWidth = 250;
	private _setHeight = 250;
	private _posOffset: INgWidgetContainerRawPosition = null;
	private _adding = false;
	private _placeholderRef: ComponentRef<NgWidgetPlaceholder> = null;
	private _fixToGrid = false;
	private _autoResize = false;
	private _differ: KeyValueDiffer<String,any>;
	private _destroyed = false;
	private _maintainRatio = false;
	private _aspectRatio: number;
	private _preferNew = false;
	private _zoomOnDrag = false;
	private _limitToScreen = false;
	private _curMaxRow = 0;
	private _curMaxCol = 0;
	private _dragReady = false;
	private _resizeReady = false;


	private _config = NgWidgetContainer.CONST_DEFAULT_CONFIG;

	// 	[ng-widget-container] attribute handler
	set config(v: INgWidgetContainerConfig) {
		this.setConfig(v);

		if (this._differ == null && v != null) {
			this._differ = this._differs.find(this._config).create(null);
		}
	}

	// 	constructor
	constructor(private _differs: KeyValueDiffers,
				private _ngEl: ElementRef,
				private _renderer: Renderer,
				private componentFactoryResolver: ComponentFactoryResolver,
				private _containerRef: ViewContainerRef) {}

	// 	public methods
	public ngOnInit(): void {
		this._renderer.setElementClass(this._ngEl.nativeElement, 'widget-container', true);
		if (this.autoStyle) {
			this._renderer.setElementStyle(this._ngEl.nativeElement, 'position', 'relative');
		}
		this.setConfig(this._config);
	}

	public ngOnDestroy(): void {
		this._destroyed = true;
	}

	public getConfig(): INgWidgetContainerConfig {
		return this._config;
	}

	public setConfig(config: INgWidgetContainerConfig): void {
		this._config = config;

		let maxColRowChanged = false;
		for (const x in config) {
			if (config.hasOwnProperty(x)) {
			const val = config[x];
			const intVal = !val ? 0 : parseInt(val, 10);

				switch (x) {
					case 'margins':
						this.setMargins(val);
						break;
					case 'col_width':
						this.colWidth = Math.max(intVal, 1);
						break;
					case 'row_height':
						this.rowHeight = Math.max(intVal, 1);
						break;
					case 'auto_style':
						this.autoStyle = val ? true : false;
						break;
					case 'auto_resize':
						this._autoResize = val ? true : false;
						break;
					case 'draggable':
						this.dragEnable = val ? true : false;
						break;
					case 'resizable':
						this.resizeEnable = val ? true : false;
						break;
					case 'max_rows':
						maxColRowChanged = maxColRowChanged || this._maxRows !== intVal;
						this._maxRows = intVal < 0 ? 0 : intVal;
						break;
					case 'max_cols':
						maxColRowChanged = maxColRowChanged || this._maxCols !== intVal;
						this._maxCols = intVal < 0 ? 0 : intVal;
						break;
					case 'visible_rows':
						this._visibleRows = Math.max(intVal, 0);
						break;
					case 'visible_cols':
						this._visibleCols = Math.max(intVal, 0);
						break;
					case 'min_rows':
						this.minRows = Math.max(intVal, 1);
						break;
					case 'min_cols':
						this.minCols = Math.max(intVal, 1);
						break;
					case 'min_height':
						this.minHeight = Math.max(intVal, 1);
						break;
					case 'min_width':
						this.minWidth = Math.max(intVal, 1);
						break;
					case 'zoom_on_drag':
						this._zoomOnDrag = val ? true : false;
						break;
					case 'cascade':
						if (this.cascade !== val) {
							this.cascade = val;
							this._cascadeGrid();
						}
						break;
					case 'fix_to_grid':
						this._fixToGrid = val ? true : false;
						break;
					case 'maintain_ratio':
						this._maintainRatio = val ? true : false;
						break;
					case 'prefer_new':
						this._preferNew = val ? true : false;
						break;
					case 'limit_to_screen':
						this._limitToScreen = !this._autoResize && !!val;

						if (this._limitToScreen) {
							this._maxCols = this._getContainerColumns();
						}
						break;
					case 'allow_overlap':
						this.allowOverlap = val ? true : false;
						break;
					case 'widget_width_factor':
						this.widget_width_factor = Math.max(intVal, 0);
						break;
					case 'widget_height_factor':
						this.widget_height_factor = Math.max(intVal, 0);
						break;
				}
			}
		}

		if (this._maintainRatio) {
			if (this.colWidth && this.rowHeight) {
				this._aspectRatio = this.colWidth / this.rowHeight;
			} else {
				this._maintainRatio = false;
			}
		}

		if (maxColRowChanged) {
			if (this._maxCols > 0 && this._maxRows > 0) {	// 	Can't have both, prioritise on cascade
				switch (this.cascade) {
					case 'left':
					case 'right':
						this._maxCols = 0;
						break;
					case 'up':
					case 'down':
					default:
						this._maxRows = 0;
						break;
				}
			}

			this.updatePositionsAfterMaxChange();
		}

		this._calculateColWidth();
		this._calculateRowHeight();

		const maxWidth = this._maxCols * this.colWidth;
		const maxHeight = this._maxRows * this.rowHeight;

		if (maxWidth > 0 && this.minWidth > maxWidth) this.minWidth = 0.75 * this.colWidth;
		if (maxHeight > 0 && this.minHeight > maxHeight) this.minHeight = 0.75 * this.rowHeight;

		if (this.minWidth > this.colWidth) this.minCols = Math.max(this.minCols, Math.ceil(this.minWidth / this.colWidth));
		if (this.minHeight > this.rowHeight) this.minRows = Math.max(this.minRows, Math.ceil(this.minHeight / this.rowHeight));

		if (this._maxCols > 0 && this.minCols > this._maxCols) this.minCols = 1;
		if (this._maxRows > 0 && this.minRows > this._maxRows) this.minRows = 1;

		this._updateRatio();

		for (const item of this._items) {
			this._removeFromGrid(item);
			item.setCascadeMode(this.cascade);
		}

		for (const item of this._items) {
			item.recalculateSelf();
			this._addToGrid(item);
		}

		this._cascadeGrid();
		this._filterGrid();
		this._updateSize();
	}

	public getItemPosition(index: number): INgWidgetPosition {
		return this._items[index].getWidgetPosition();
	}

	public getItemSize(index: number): INgWidgetSize {
		return this._items[index].getSize();
	}

	public ngDoCheck(): boolean {
		if (this._differ != null) {
			const changes = this._differ.diff(this._config);

			if (changes != null) {
				console.log('ngDoCheck -> NgWidgetContainer');
				this._applyChanges(changes);

				return true;
			}
		}

		return false;
	}

	public setMargins(margins: Array<string>): void {
		this.marginTop = Math.max(parseInt(margins[0], 10), 0);
		this.marginRight = margins.length >= 2 ? Math.max(parseInt(margins[1], 10), 0) : this.marginTop;
		this.marginBottom = margins.length >= 3 ? Math.max(parseInt(margins[2], 10), 0) : this.marginTop;
		this.marginBottom = margins.length >= 3 ? Math.max(parseInt(margins[2], 10), 0) : this.marginTop;
		this.marginLeft = margins.length >= 4 ? Math.max(parseInt(margins[3], 10), 0) : this.marginRight;
	}

	public enableDrag(): void {
		this.dragEnable = true;
	}

	public disableDrag(): void {
		this.dragEnable = false;
	}

	public enableResize(): void {
		this.resizeEnable = true;
	}

	public disableResize(): void {
		this.resizeEnable = false;
	}

	public addItem(ngItem: NgWidget): void {
		ngItem.setCascadeMode(this.cascade);

		if (!this._preferNew) {
			const newPos = this._fixGridPosition(ngItem.getWidgetPosition(), ngItem.getSize());
			ngItem.setGridPosition(newPos);
		}

		this._items.push(ngItem);
		this._addToGrid(ngItem);

		this._updateSize();

		ngItem.recalculateSelf();
		ngItem.onCascadeEvent();

		this._emitOnItemChange();
	}

	public removeItem(ngItem: NgWidget): void {
		this._removeFromGrid(ngItem);

		for (let x = 0; x < this._items.length; x++) {
			if (this._items[x] === ngItem) {
				this._items.splice(x, 1);
			}
		}

		if (this._destroyed) return;
		if (this.allowOverlap) return;

		this._cascadeGrid();
		this._updateSize();
		this._items.forEach((item: NgWidget) => item.recalculateSelf());
		this._emitOnItemChange();
	}

	public updateItem(ngWidget: NgWidget): void {
		this._removeFromGrid(ngWidget);
		this._addToGrid(ngWidget);
		this._cascadeGrid();
		this._updateSize();
		ngWidget.onCascadeEvent();
	}

	public triggerCascade(): void {
		this._cascadeGrid(null, null);
	}

	public triggerResize(): void {
		this.resizeEventHandler(null);
	}

	public resizeEventHandler(e: any): void {
		this._calculateColWidth();
		this._calculateRowHeight();

		this._updateRatio();

		if (this._limitToScreen) {
			if (this._maxCols !== this._getContainerColumns()) {
				this._maxCols = this._getContainerColumns();
				this.updatePositionsAfterMaxChange();
				this._cascadeGrid();
			}
		}

		this._filterGrid();
		this._updateSize();
	}

	public mouseDownEventHandler(e: MouseEvent): void {
		const mousePos = this._getMousePosition(e);
		const widget = this._getItemFromPosition(mousePos);

		if (widget != null) {
			if (this.resizeEnable && widget.canResize(e)) {
				this._resizeReady = true;
				e.preventDefault();
			} else if (this.dragEnable && widget.canDrag(e)) {
				this._dragReady = true;
				e.preventDefault();
			}
		}
	}

	public mouseUpEventHandler(e: any): void {
		if (this.isDragging) {
			this._dragStop(e);
		} else if (this.isResizing) {
			this._resizeStop(e);
		} else if (this._dragReady || this._resizeReady) {
			this._dragReady = false;
			this._resizeReady = false;
		}
	}

	public mouseMoveEventHandler(e: any): void {
		if (this._resizeReady) {
			this._resizeStart(e);
			e.preventDefault();
			return;
		} else if (this._dragReady) {
			this._dragStart(e);
			e.preventDefault();
			return;
		}

		if (this.isDragging) {
			this._drag(e);
		} else if (this.isResizing) {
			this._resize(e);
		} else {
			const mousePos = this._getMousePosition(e);
			const item = this._getItemFromPosition(mousePos);

			if (item) {
				item.onMouseMove(e);
			}
		}
	}

	// 	Private methods
	private updatePositionsAfterMaxChange(): void {
		for (const item of this._items) {
			const pos = item.getWidgetPosition();
			const dims = item.getSize();

			if (!this._hasGridCollision(pos, dims) && this._isWithinBounds(pos, dims) && dims.x <= this._maxCols && dims.y <= this._maxRows) {
				continue;
			}

			this._removeFromGrid(item);

			if (this._maxCols > 0 && dims.x > this._maxCols) {
				dims.x = this._maxCols;
				item.setSize(dims);
			} else if (this._maxRows > 0 && dims.y > this._maxRows) {
				dims.y = this._maxRows;
				item.setSize(dims);
			}

			if (this._hasGridCollision(pos, dims) || !this._isWithinBounds(pos, dims)) {
				const newPosition = this._fixGridPosition(pos, dims);
				item.setGridPosition(newPosition);
			}

			this._addToGrid(item);
		}
	}

	private _calculateColWidth(): void {
		if (this._autoResize) {
			if (this._maxCols > 0 || this._visibleCols > 0) {
				const maxCols = this._maxCols > 0 ? this._maxCols : this._visibleCols;
				const maxWidth: number = this._ngEl.nativeElement.getBoundingClientRect().width;

				let colWidth: number = Math.floor(maxWidth / maxCols);
				colWidth -= (this.marginLeft + this.marginRight);
				if (colWidth > 0) this.colWidth = colWidth;
			}
		}

		if (this.colWidth < this.minWidth || this.minCols > this._config.min_cols) {
			this.minCols = Math.max(this._config.min_cols, Math.ceil(this.minWidth / this.colWidth));
		}
	}

	private _calculateRowHeight(): void {
		if (this._autoResize) {
			if (this._maxRows > 0 || this._visibleRows > 0) {
				const maxRows = this._maxRows > 0 ? this._maxRows : this._visibleRows;
				const maxHeight: number = window.innerHeight - this.marginTop - this.marginBottom;

				let rowHeight: number = Math.max(Math.floor(maxHeight / maxRows), this.minHeight);
				rowHeight -= (this.marginTop + this.marginBottom);
				if (rowHeight > 0) this.rowHeight = rowHeight;
			}
		}

		if (this.rowHeight < this.minHeight || this.minRows > this._config.min_rows) {
			this.minRows = Math.max(this._config.min_rows, Math.ceil(this.minHeight / this.rowHeight));
		}
	}

	private _updateRatio(): void {
		if (this._autoResize && this._maintainRatio) {
			if (this._maxCols > 0 && this._visibleRows <= 0) {
				this.rowHeight = this.colWidth / this._aspectRatio;
			} else if (this._maxRows > 0 && this._visibleCols <= 0) {
				this.colWidth = this._aspectRatio * this.rowHeight;
			} else if (this._maxCols === 0 && this._maxRows === 0) {
				if (this._visibleCols > 0) {
					this.rowHeight = this.colWidth / this._aspectRatio;
				} else if (this._visibleRows > 0) {
					this.colWidth = this._aspectRatio * this.rowHeight;
				}
			}
		}
	}

	private _applyChanges(changes: any): void {
		changes.forEachAddedItem((record: any) => { this._config[record.key] = record.currentValue; });
		changes.forEachChangedItem((record: any) => { this._config[record.key] = record.currentValue; });
		changes.forEachRemovedItem((record: any) => { delete this._config[record.key]; });

		this.setConfig(this._config);
	}

	private _resizeStart(e: any): void {
		if (this.resizeEnable) {
			const mousePos = this._getMousePosition(e);
			const item = this._getItemFromPosition(mousePos);

			if (item) {
				item.startMoving();
				this._resizingItem = item;
				this._resizeDirection = item.canResize(e);
				this._removeFromGrid(item);
				this._createPlaceholder(item);
				this.isResizing = true;
				this._resizeReady = false;
				this.onResizeStart.emit(item);
				item.onResizeStartEvent();
			}
		}
	}

	private _dragStart(e: any): void {
		if (this.dragEnable) {
			const mousePos = this._getMousePosition(e);
			const item = this._getItemFromPosition(mousePos);

			if (item) {
				const itemPos = item.getPosition();
				const pOffset = { 'left': (mousePos.left - itemPos.left), 'top': (mousePos.top - itemPos.top) };
				item.setWidgetDragStartPosition(item.getWidgetPosition());
				console.log('_dragStart -> dragStartPosition', item.getWidgetDragStartPosition());

				item.startMoving();
				this._draggingItem = item;
				this._posOffset = pOffset;
				this._removeFromGrid(item);
				this._createPlaceholder(item);
				this.isDragging = true;
				this._dragReady = false;

				this.onDragStart.emit(item);
				item.onDragStartEvent();

				if (this._zoomOnDrag) {
					this._zoomOut();
				}
			}
		}
	}

	private _zoomOut(): void {
		this._renderer.setElementStyle(this._ngEl.nativeElement, 'transform', 'scale(0.5, 0.5)');
	}

	private _resetZoom(): void {
		this._renderer.setElementStyle(this._ngEl.nativeElement, 'transform', '');
	}

	private _drag(e: any): void {
		if (this.isDragging) {
			console.log('_drag');
			if (window.getSelection) {
				if (window.getSelection().empty) {
					window.getSelection().empty();
				} else if (window.getSelection().removeAllRanges) {
					window.getSelection().removeAllRanges();
				}
			} else if ((<any>document).selection) {
				(<any>document).selection.empty();
			}

			const mousePos = this._getMousePosition(e);
			const newL = (mousePos.left - this._posOffset.left);
			const newT = (mousePos.top - this._posOffset.top);

			const itemPos = this._draggingItem.getWidgetPosition();
			let gridPos = this._calculateGridPosition(newL, newT);
			const dims = this._draggingItem.getSize();

			gridPos = this._fixPosToBoundsX(gridPos, dims);

			if (!this._isWithinBoundsY(gridPos, dims)) {
				gridPos = this._fixPosToBoundsY(gridPos, dims);
			}

			if (gridPos.col !== itemPos.col || gridPos.row !== itemPos.row) {
			// if (Math.abs(gridPos.col - itemPos.col) > 10 || Math.abs(gridPos.row - itemPos.row) > 10) {
				console.log('_drag', gridPos, itemPos);
				this._draggingItem.setGridPosition(gridPos, this._fixToGrid);
				this._placeholderRef.instance.setGridPosition(gridPos);

				if (['up', 'down', 'left', 'right'].indexOf(this.cascade) >= 0) {
					if (Math.abs(gridPos.col - itemPos.col) > 10 || Math.abs(gridPos.row - itemPos.row) > 10) {
						console.log('_drag fixGridCollision', gridPos, dims);
						this._fixGridCollisions(gridPos, dims);
					}
					console.log('_drag cascade', gridPos, dims);
					this._cascadeGrid(gridPos, dims);
				}
			}

			if (!this._fixToGrid) {
				this._draggingItem.setPosition(newL, newT);
			}

			this.onDrag.emit(this._draggingItem);
			this._draggingItem.onDragEvent();
		}
	}

	private _resize(e: any): void {
		if (this.isResizing) {
			if (window.getSelection) {
				if (window.getSelection().empty) {
					window.getSelection().empty();
				} else if (window.getSelection().removeAllRanges) {
					window.getSelection().removeAllRanges();
				}
			} else if ((<any>document).selection) {
				(<any>document).selection.empty();
			}

			const mousePos = this._getMousePosition(e);
			const itemPos = this._resizingItem.getPosition();
			const itemDims = this._resizingItem.getDimensions();
			let newW = this._resizeDirection === 'height' ? itemDims.width : (mousePos.left - itemPos.left + 10);
			let newH = this._resizeDirection === 'width' ? itemDims.height : (mousePos.top - itemPos.top + 10);

			if (newW < this.minWidth) newW = this.minWidth;
			if (newH < this.minHeight) newH = this.minHeight;
			if (newW < this._resizingItem.minWidth) newW = this._resizingItem.minWidth;
			if (newH < this._resizingItem.minHeight) newH = this._resizingItem.minHeight;

			let calcSize = this._calculateGridSize(newW, newH);
			const itemSize = this._resizingItem.getSize();
			const iGridPos = this._resizingItem.getWidgetPosition();

			if (!this._isWithinBoundsX(iGridPos, calcSize)) calcSize = this._fixSizeToBoundsX(iGridPos, calcSize);

			if (!this._isWithinBoundsY(iGridPos, calcSize)) calcSize = this._fixSizeToBoundsY(iGridPos, calcSize);

			calcSize = this._resizingItem.fixResize(calcSize);

			if (calcSize.x !== itemSize.x || calcSize.y !== itemSize.y) {
				this._resizingItem.setSize(calcSize, this._fixToGrid);
				this._placeholderRef.instance.setSize(calcSize);

				if (['up', 'down', 'left', 'right'].indexOf(this.cascade) >= 0) {
					this._fixGridCollisions(iGridPos, calcSize);
					this._cascadeGrid(iGridPos, calcSize);
				}
			}

			if (!this._fixToGrid) this._resizingItem.setDimensions(newW, newH);

			const bigGrid = this._maxGridSize(itemPos.left + newW + (2 * e.movementX), itemPos.top + newH + (2 * e.movementY));

			if (this._resizeDirection === 'height') bigGrid.x = iGridPos.col + itemSize.x;
			if (this._resizeDirection === 'width') bigGrid.y = iGridPos.row + itemSize.y;

			this.onResize.emit(this._resizingItem);
			this._resizingItem.onResizeEvent();
		}
	}

	private _dragStop(e: any): void {
		if (this.isDragging) {
			this.isDragging = false;

			const itemPos = this._draggingItem.getWidgetPosition();
			const itemDragStartPos = this._draggingItem.getWidgetDragStartPosition();
			console.log('_dragStop itemPos, dragStartPos', itemPos, itemDragStartPos);
			this._draggingItem.setGridPosition(itemPos);
			// if (this.allowOverlap) {
			// 	this._draggingItem.setGridPosition(itemPos);
			// } else {
			// 	if (Math.abs(itemPos.row - itemDragStartPos.row) > 4 ) {
			// 		console.log('_dragStop setGrid itemPos');
			// 		this._draggingItem.setGridPosition(itemPos);
			// 	} else {
			// 		console.log('_dragStop setGrid itemDragStartPos');
			// 		const newPos: INgWidgetPosition = { col: itemPos.col, row: itemDragStartPos.row };
			// 		this._draggingItem.setGridPosition(newPos);
			// 	}
			// }
			this._addToGrid(this._draggingItem);

			this._cascadeGrid();
			this._updateSize();
			this._filterGrid();

			this._draggingItem.stopMoving();
			this._draggingItem.onDragStopEvent();
			this.onDragStop.emit(this._draggingItem);
			this._draggingItem = null;
			this._posOffset = null;
			this._placeholderRef.destroy();

			this._emitOnItemChange();

			if (this._zoomOnDrag) {
				this._resetZoom();
			}
		}
	}

	private _resizeStop(e: any): void {
		if (this.isResizing) {
			this.isResizing = false;

			const itemDims = this._resizingItem.getSize();

			this._resizingItem.setSize(itemDims);
			this._addToGrid(this._resizingItem);

			this._cascadeGrid();
			this._updateSize();
			this._filterGrid();

			this._resizingItem.stopMoving();
			this._resizingItem.onResizeStopEvent();
			this.onResizeStop.emit(this._resizingItem);
			this._resizingItem = null;
			this._resizeDirection = null;
			this._placeholderRef.destroy();

			this._emitOnItemChange();
		}
	}

	private _maxGridSize(w: number, h: number): INgWidgetSize {
		const sizex = Math.ceil(w / (this.colWidth + this.marginLeft + this.marginRight));
		const sizey = Math.ceil(h / (this.rowHeight + this.marginTop + this.marginBottom));
		return { 'x': sizex, 'y': sizey };
	}

	private _calculateGridSize(width: number, height: number): INgWidgetSize {
		width += this.marginLeft + this.marginRight;
		height += this.marginTop + this.marginBottom;

		let sizex = Math.max(this.minCols, Math.round(width / (this.colWidth + this.marginLeft + this.marginRight)));
		let sizey = Math.max(this.minRows, Math.round(height / (this.rowHeight + this.marginTop + this.marginBottom)));

		if (!this._isWithinBoundsX({ col: 1, row: 1 }, { x: sizex, y: sizey })) sizex = this._maxCols;
		if (!this._isWithinBoundsY({ col: 1, row: 1 }, { x: sizex, y: sizey })) sizey = this._maxRows;

		return { 'x': sizex, 'y': sizey };
	}

	private _calculateGridPosition(left: number, top: number): INgWidgetPosition {
		let col = Math.max(1, Math.round(left / (this.colWidth + this.marginLeft + this.marginRight)) + 1);
		let row = Math.max(1, Math.round(top / (this.rowHeight + this.marginTop + this.marginBottom)) + 1);

		if (!this._isWithinBoundsX({ col: col, row: row }, { x: 1, y: 1 })) col = this._maxCols;
		if (!this._isWithinBoundsY({ col: col, row: row }, { x: 1, y: 1 })) row = this._maxRows;

		return { 'col': col, 'row': row };
	}

	private _hasGridCollision(pos: INgWidgetPosition, dims: INgWidgetSize): boolean {
		const positions = this._getCollisions(pos, dims);

		if (positions == null || positions.length === 0) return false;

		return positions.some((v: NgWidget) => {
			return !(v === null);
		});
	}

	private _getCollisions(pos: INgWidgetPosition, dims: INgWidgetSize): Array<NgWidget> {
		const returns: Array<NgWidget> = [];

		if(!pos.col) {
			pos.col = 1;
		}
		if(!pos.row) {
			pos.row = 1;
		}

		for (let j = 0; j < dims.y; j++) {
			if (this._itemGrid[pos.row + j] != null) {
				for (let i = 0; i < dims.x; i++) {
					if (this._itemGrid[pos.row + j][pos.col + i] != null) {
						const item: NgWidget = this._itemGrid[pos.row + j][pos.col + i];

						if (returns.indexOf(item) < 0) returns.push(item);

						const itemPos: INgWidgetPosition = item.getWidgetPosition();
						const itemDims: INgWidgetSize = item.getSize();

						i = itemPos.col + itemDims.x - pos.col;
					}
				}
			}
		}

		return returns;
	}

	private _fixGridCollisions(pos: INgWidgetPosition, dims: INgWidgetSize): void {
		if (this.allowOverlap)  return;

		while (this._hasGridCollision(pos, dims)) {
			const collisions: Array<NgWidget> = this._getCollisions(pos, dims);

			this._removeFromGrid(collisions[0]);

			const itemPos: INgWidgetPosition = collisions[0].getWidgetPosition();
			const itemDims: INgWidgetSize = collisions[0].getSize();

			switch (this.cascade) {
				case 'up':
				case 'down':
				default:
					const oldRow: number = itemPos.row;
					itemPos.row = pos.row + dims.y;

					if (!this._isWithinBoundsY(itemPos, itemDims)) {
						itemPos.col = pos.col + dims.x;
						itemPos.row = oldRow;
					}
					break;
				case 'left':
				case 'right':
					const oldCol: number = itemPos.col;
					itemPos.col = pos.col + dims.x;

					if (!this._isWithinBoundsX(itemPos, itemDims)) {
						itemPos.col = oldCol;
						itemPos.row = pos.row + dims.y;
					}
					break;
			}

			collisions[0].setGridPosition(itemPos);

			this._fixGridCollisions(itemPos, itemDims);
			this._addToGrid(collisions[0]);
			collisions[0].onCascadeEvent();
		}
	}

	private _cascadeGrid(pos?: INgWidgetPosition, dims?: INgWidgetSize): void {
		if (this._destroyed) return;
		if (this.allowOverlap) {
			return;
		}
		if (pos && !dims) throw new Error('Cannot cascade with only position and not dimensions');

		if (this.isDragging && this._draggingItem && !pos && !dims) {
			pos = this._draggingItem.getWidgetPosition();
			dims = this._draggingItem.getSize();
		} else if (this.isResizing && this._resizingItem && !pos && !dims) {
			pos = this._resizingItem.getWidgetPosition();
			dims = this._resizingItem.getSize();
		}

		switch (this.cascade) {
			case 'up':
			case 'down':
				const lowRow: Array<number> = [0];

				for (let i = 1; i <= this._curMaxCol; i++) lowRow[i] = 1;

				for (let r = 1; r <= this._curMaxRow; r++) {
					if (this._itemGrid[r] === undefined) continue;

					for (let c = 1; c <= this._curMaxCol; c++) {
						if (this._itemGrid[r] === undefined) break;
						if (r < lowRow[c]) continue;

						if (this._itemGrid[r][c] != null) {
							const item: NgWidget = this._itemGrid[r][c];
							if (item.isFixed) continue;

							const itemPos: INgWidgetPosition = item.getWidgetPosition();
							const itemDims: INgWidgetSize = item.getSize();

							if (itemPos.col !== c || itemPos.row !== r) continue;	// 	if this is not the element's start

							let lowest: number = lowRow[c];

							for (let i = 1; i < itemDims.x; i++) {
								lowest = Math.max(lowRow[(c + i)], lowest);
							}

							if (pos && (c + itemDims.x) > pos.col && c < (pos.col + dims.x)) {          // 	if our element is in one of the item's columns
								if ((r >= pos.row && r < (pos.row + dims.y)) ||                         // 	if this row is occupied by our element
									((itemDims.y > (pos.row - lowest)) &&                               // 	or the item can't fit above our element
										(r >= (pos.row + dims.y) && lowest < (pos.row + dims.y)))) {    // 	and this row is below our element, but we haven't caught it
									lowest = Math.round(Math.max(lowest, pos.row + dims.y));                        // 	set the lowest row to be below it
								}
							}

							const newPos: INgWidgetPosition = { col: c, row: lowest };

							if (lowest !== itemPos.row && this._isWithinBoundsY(newPos, itemDims)) {	// 	if the item is not already on this row move it up
								this._removeFromGrid(item);

								item.setGridPosition(newPos);

								item.onCascadeEvent();
								this._addToGrid(item);
							}

							for (let i = 0; i < itemDims.x; i++) {
								lowRow[c + i] = lowest + itemDims.y;	// 	update the lowest row to be below the item
							}
						}
					}
				}
				break;
			case 'left':
			case 'right':
				const lowCol: Array<number> = [0];

				for (let i = 1; i <= this._curMaxRow; i++) lowCol[i] = 1;

				for (let r = 1; r <= this._curMaxRow; r++) {
					if (this._itemGrid[r] === undefined) continue;

					for (let c = 1; c <= this._curMaxCol; c++) {
						if (this._itemGrid[r] === undefined) break;
						if (c < lowCol[r]) continue;

						if (this._itemGrid[r][c] != null) {
							const item: NgWidget = this._itemGrid[r][c];
							const itemDims: INgWidgetSize = item.getSize();
							const itemPos: INgWidgetPosition = item.getWidgetPosition();

							if (itemPos.col !== c || itemPos.row !== r) continue;	// 	if this is not the element's start

							let lowest: number = lowCol[r];

							for (let i = 1; i < itemDims.y; i++) {
								lowest = Math.max(lowCol[(r + i)], lowest);
							}

							if (pos && (r + itemDims.y) > pos.row && r < (pos.row + dims.y)) {          // 	if our element is in one of the item's rows
								if ((c >= pos.col && c < (pos.col + dims.x)) ||                         // 	if this col is occupied by our element
									((itemDims.x > (pos.col - lowest)) &&                               // 	or the item can't fit above our element
										(c >= (pos.col + dims.x) && lowest < (pos.col + dims.x)))) {    // 	and this col is below our element, but we haven't caught it
									lowest = Math.max(lowest, pos.col + dims.x);                        // 	set the lowest col to be below it
								}
							}

							const newPos: INgWidgetPosition = { col: Math.round(lowest), row: r };

							// if (lowest !== itemPos.col && this._isWithinBoundsX(newPos, itemDims)) {	// 	if the item is not already on this col move it up
							if (lowest !== itemPos.col && lowest < itemPos.col && this._isWithinBoundsX(newPos, itemDims)) {	// 	if the item is not already on this col move it up
								this._removeFromGrid(item);
								console.log('_cascadeGrid called setGridPosition', this.cascade, lowest, itemPos, newPos, itemDims);

								item.setGridPosition(newPos);

								item.onCascadeEvent();
								this._addToGrid(item);
							}

							for (let i = 0; i < itemDims.y; i++) {
								lowCol[r + i] = lowest + itemDims.x;	// 	update the lowest col to be below the item
							}
						}
					}
				}
				break;
			default:
				break;
		}
	}

	private _cascadePlaceHolder(pos?: INgWidgetPosition, dims?: INgWidgetSize): void {
		if (this._destroyed) return;
		if (this.allowOverlap) {
			return;
		}
		if (pos && !dims) throw new Error('Cannot cascade with only position and not dimensions');

		if (this.isDragging && this._draggingItem && !pos && !dims) {
			pos = this._draggingItem.getWidgetPosition();
			dims = this._draggingItem.getSize();
		} else if (this.isResizing && this._resizingItem && !pos && !dims) {
			pos = this._resizingItem.getWidgetPosition();
			dims = this._resizingItem.getSize();
		}

		switch (this.cascade) {
			case 'up':
			case 'down':
				const lowRow: Array<number> = [0];

				for (let i = 1; i <= this._curMaxCol; i++) lowRow[i] = 1;

				for (let r = 1; r <= this._curMaxRow; r++) {
					if (this._itemGrid[r] === undefined) continue;

					for (let c = 1; c <= this._curMaxCol; c++) {
						if (this._itemGrid[r] === undefined) break;
						if (r < lowRow[c]) continue;

						if (this._itemGrid[r][c] != null) {
							const item: NgWidget = this._itemGrid[r][c];
							if (item.isFixed) continue;

							const itemPos: INgWidgetPosition = item.getWidgetPosition();
							const itemDims: INgWidgetSize = item.getSize();

							if (itemPos.col !== c || itemPos.row !== r) continue;	// 	if this is not the element's start

							let lowest: number = lowRow[c];

							for (let i = 1; i < itemDims.x; i++) {
								lowest = Math.max(lowRow[(c + i)], lowest);
							}

							if (pos && (c + itemDims.x) > pos.col && c < (pos.col + dims.x)) {          // 	if our element is in one of the item's columns
								if ((r >= pos.row && r < (pos.row + dims.y)) ||                         // 	if this row is occupied by our element
									((itemDims.y > (pos.row - lowest)) &&                               // 	or the item can't fit above our element
										(r >= (pos.row + dims.y) && lowest < (pos.row + dims.y)))) {    // 	and this row is below our element, but we haven't caught it
									lowest = Math.max(lowest, pos.row + dims.y);                        // 	set the lowest row to be below it
								}
							}

							const newPos: INgWidgetPosition = { col: c, row: lowest };

							if (lowest !== itemPos.row && this._isWithinBoundsY(newPos, itemDims)) {	// 	if the item is not already on this row move it up
								// this._removeFromGrid(item);

								// item.setGridPosition(newPos);

								// item.onCascadeEvent();
								// this._addToGrid(item);
								this._placeholderRef.instance.setGridPosition(newPos);
							}

							for (let i = 0; i < itemDims.x; i++) {
								lowRow[c + i] = lowest + itemDims.y;	// 	update the lowest row to be below the item
							}
						}
					}
				}
				break;
			case 'left':
			case 'right':
				const lowCol: Array<number> = [0];

				for (let i = 1; i <= this._curMaxRow; i++) lowCol[i] = 1;

				for (let r = 1; r <= this._curMaxRow; r++) {
					if (this._itemGrid[r] === undefined) continue;

					for (let c = 1; c <= this._curMaxCol; c++) {
						if (this._itemGrid[r] === undefined) break;
						if (c < lowCol[r]) continue;

						if (this._itemGrid[r][c] != null) {
							const item: NgWidget = this._itemGrid[r][c];
							const itemDims: INgWidgetSize = item.getSize();
							const itemPos: INgWidgetPosition = item.getWidgetPosition();

							if (itemPos.col !== c || itemPos.row !== r) continue;	// 	if this is not the element's start

							let lowest: number = lowCol[r];

							for (let i = 1; i < itemDims.y; i++) {
								lowest = Math.max(lowCol[(r + i)], lowest);
							}

							if (pos && (r + itemDims.y) > pos.row && r < (pos.row + dims.y)) {          // 	if our element is in one of the item's rows
								if ((c >= pos.col && c < (pos.col + dims.x)) ||                         // 	if this col is occupied by our element
									((itemDims.x > (pos.col - lowest)) &&                               // 	or the item can't fit above our element
										(c >= (pos.col + dims.x) && lowest < (pos.col + dims.x)))) {    // 	and this col is below our element, but we haven't caught it
									lowest = Math.max(lowest, pos.col + dims.x);                        // 	set the lowest col to be below it
								}
							}

							const newPos: INgWidgetPosition = { col: lowest, row: r };

							if (lowest !== itemPos.col && lowest < itemPos.col && this._isWithinBoundsX(newPos, itemDims)) {	// 	if the item is not already on this col move it up
								// this._removeFromGrid(item);
								// console.log('_cascadeGrid called setGridPosition', this.cascade, lowest, itemPos, newPos, itemDims);

								// item.setGridPosition(newPos);

								// item.onCascadeEvent();
								// this._addToGrid(item);
								this._placeholderRef.instance.setGridPosition(newPos);
							}

							for (let i = 0; i < itemDims.y; i++) {
								lowCol[r + i] = lowest + itemDims.x;	// 	update the lowest col to be below the item
							}
						}
					}
				}
				break;
			default:
				break;
		}
	}

	private _fixGridPosition(pos: INgWidgetPosition, dims: INgWidgetSize): INgWidgetPosition {
		while (this._hasGridCollision(pos, dims) || !this._isWithinBounds(pos, dims)) {
			if (this._hasGridCollision(pos, dims)) {
				const collisions: NgWidget[] = this._getCollisions(pos, dims);

				switch (this.cascade) {
					case 'up':
					case 'down':
					default:
						pos.row = Math.max.apply(null, collisions.map((item: NgWidget) => item.row + item.sizey));
						break;
					case 'left':
					case 'right':
						pos.col = Math.max.apply(null, collisions.map((item: NgWidget) => item.col + item.sizex));
						break;
				}
			}


			if (!this._isWithinBoundsY(pos, dims)) {
				pos.col++;
				pos.row = 1;
			}
			if (!this._isWithinBoundsX(pos, dims)) {
				pos.row++;
				pos.col = 1;
			}
		}
		return pos;
	}

	private _isWithinBoundsX(pos: INgWidgetPosition, dims: INgWidgetSize) {
		return (this._maxCols === 0 || pos.col === 1 || (pos.col + dims.x - 1) <= this._maxCols);
	}

	private _fixPosToBoundsX(pos: INgWidgetPosition, dims: INgWidgetSize): INgWidgetPosition {
		if (!this._isWithinBoundsX(pos, dims)) {
			pos.col = Math.max(this._maxCols - (dims.x - 1), 1);
			pos.row ++;
		}
		return pos;
	}

	private _fixSizeToBoundsX(pos: INgWidgetPosition, dims: INgWidgetSize): INgWidgetSize {
		if (!this._isWithinBoundsX(pos, dims)) {
			dims.x = Math.max(this._maxCols - (pos.col - 1), 1);
			dims.y++;
		}
		return dims;
	}

	private _isWithinBoundsY(pos: INgWidgetPosition, dims: INgWidgetSize) {
		return (this._maxRows === 0 || pos.row === 1 || (pos.row + dims.y - 1) <= this._maxRows);
	}

	private _fixPosToBoundsY(pos: INgWidgetPosition, dims: INgWidgetSize): INgWidgetPosition {
		if (!this._isWithinBoundsY(pos, dims)) {
			pos.row = Math.max(this._maxRows - (dims.y - 1), 1);
			pos.col++;
		}
		return pos;
	}

	private _fixSizeToBoundsY(pos: INgWidgetPosition, dims: INgWidgetSize): INgWidgetSize {
		if (!this._isWithinBoundsY(pos, dims)) {
			dims.y = Math.max(this._maxRows - (pos.row - 1), 1);
			dims.x++;
		}
		return dims;
	}

	private _isWithinBounds(pos: INgWidgetPosition, dims: INgWidgetSize) {
		return this._isWithinBoundsX(pos, dims) && this._isWithinBoundsY(pos, dims);
	}

	private _fixPosToBounds(pos: INgWidgetPosition, dims: INgWidgetSize): INgWidgetPosition {
		return this._fixPosToBoundsX(this._fixPosToBoundsY(pos, dims), dims);
	}

	private _fixSizeToBounds(pos: INgWidgetPosition, dims: INgWidgetSize): INgWidgetSize {
		return this._fixSizeToBoundsX(pos, this._fixSizeToBoundsY(pos, dims));
	}

	private _addToGrid(item: NgWidget): void {
		// if( (this.isDragging || this.isResizing) && this.allowOverlap) {
		// 	return;
		// }
		let pos: INgWidgetPosition = item.getWidgetPosition();
		const dims: INgWidgetSize = item.getSize();

		if (this._hasGridCollision(pos, dims)) {
			this._fixGridCollisions(pos, dims);
			pos = item.getWidgetPosition();
		}

		for (let j = 0; j < dims.y; j++) {
			if (this._itemGrid[pos.row + j] == null) this._itemGrid[pos.row + j] = {};

			for (let i = 0; i < dims.x; i++) {
				this._itemGrid[pos.row + j][pos.col + i] = item;
			}
		}
	}

	private _removeFromGrid(item: NgWidget): void {
		for (const y in this._itemGrid)
			for (const x in this._itemGrid[y])
				if (this._itemGrid[y][x] === item)
					delete this._itemGrid[y][x];
	}

	private _filterGrid(): void {
		// tslint:disable:forin
		for (const y in this._itemGrid) {
			for (const x in this._itemGrid[y]) {
				const item: NgWidget = this._itemGrid[y][x];
				const withinRow = <any>y < (item.row + item.sizey) && <any>y >= item.row;
				const withinCol = <any>x < (item.col + item.sizex) && <any>x >= item.col;

				if (this._items.indexOf(this._itemGrid[y][x]) < 0 || !withinRow || !withinCol) {
					delete this._itemGrid[y][x];
				}
			}

			if (Object.keys(this._itemGrid[y]).length === 0) {
				delete this._itemGrid[y];
			}
		}
	}

	private _updateSize(): void {
		if (this._destroyed) return;
		const maxCol: number = this._getMaxCol();
		const maxRow: number = this._getMaxRow();

		if (maxCol !== this._curMaxCol || maxRow !== this._curMaxRow) {
			this._curMaxCol = maxCol;
			this._curMaxRow = maxRow;
		}

		this._renderer.setElementStyle(this._ngEl.nativeElement, 'width', '100%'); // (maxCol * (this.colWidth + this.marginLeft + this.marginRight))+'px');
		this._renderer.setElementStyle(this._ngEl.nativeElement, 'height', (maxRow * (this.rowHeight + this.marginTop + this.marginBottom)) + 'px');
	}

	private _getMaxRow(): number {
		return Math.max.apply(null, this._items.map((item: NgWidget) => item.row + item.sizey - 1));
	}

	private _getMaxCol(): number {
		return Math.max.apply(null, this._items.map((item: NgWidget) => item.col + item.sizex - 1));
	}

	private _getMousePosition(e: any): INgWidgetContainerRawPosition {
		if (((<any>window).TouchEvent && e instanceof TouchEvent) || (e.touches || e.changedTouches)) {
			e = e.touches.length > 0 ? e.touches[0] : e.changedTouches[0];
		}

		const refPos: any = this._ngEl.nativeElement.getBoundingClientRect();

		let left: number = e.clientX - refPos.left;
		let top: number = e.clientY - refPos.top;

		if (this.cascade === 'down') top = refPos.top + refPos.height - e.clientY;
		if (this.cascade === 'right') left = refPos.left + refPos.width - e.clientX;

		if (this.isDragging && this._zoomOnDrag) {
			left *= 2;
			top *= 2;
		}

		return {
			left: left,
			top: top
		};
	}

	private _getAbsoluteMousePosition(e: any): INgWidgetContainerRawPosition {
		if (((<any>window).TouchEvent && e instanceof TouchEvent) || (e.touches || e.changedTouches)) {
			e = e.touches.length > 0 ? e.touches[0] : e.changedTouches[0];
		}

		return {
			left: e.clientX,
			top: e.clientY
		};
	}

	private _getContainerColumns(): number {
		const maxWidth: number = this._ngEl.nativeElement.getBoundingClientRect().width;
		return Math.floor(maxWidth / (this.colWidth + this.marginLeft + this.marginRight));
	}

	private _getContainerRows(): number {
		const maxHeight: number = window.innerHeight - this.marginTop - this.marginBottom;
		return Math.floor(maxHeight / (this.rowHeight + this.marginTop + this.marginBottom));
	}

	private _getItemFromPosition(position: INgWidgetContainerRawPosition): NgWidget {
		for (const item of this._items) {
			const size: INgWidgetDimensions = item.getDimensions();
			const pos: INgWidgetContainerRawPosition = item.getPosition();

			if (position.left > (pos.left + this.marginLeft) && position.left < (pos.left + this.marginLeft + size.width) &&
				position.top > (pos.top + this.marginTop) && position.top < (pos.top + this.marginTop + size.height)) {
				return item;
			}
		}

		return null;
	}

	private _createPlaceholder(item: NgWidget): void {
		const pos: INgWidgetPosition = item.getWidgetPosition();
		const dims: INgWidgetSize = item.getSize();

		const factory = this.componentFactoryResolver.resolveComponentFactory(NgWidgetPlaceholder);
		const componentRef: ComponentRef<NgWidgetPlaceholder> = item.containerRef.createComponent(factory);
		this._placeholderRef = componentRef;
		const placeholder: NgWidgetPlaceholder = componentRef.instance;
		placeholder.registerGrid(this);
		placeholder.setCascadeMode(this.cascade);
		placeholder.setGridPosition({ col: pos.col, row: pos.row });
		placeholder.setSize({ x: dims.x, y: dims.y });
	}

	private _emitOnItemChange() {
		this.onItemChange.emit(this._items.map((item: NgWidget) => item.getEventOutput()));
	}
}
