// tslint:disable:max-line-length
// tslint:disable:quotemark
import { NgWidgetContainer } from '../directives/NgWidgetContainer';
import { NgWidget } from '../directives/NgWidget';
import { INgWidgetPosition, INgWidgetSize } from '../interfaces/INgDraggableWidgetConfig';
import { Component, Directive, ElementRef, Renderer, EventEmitter, Host, ViewEncapsulation, Type, ComponentRef, KeyValueDiffer, KeyValueDiffers, OnInit, OnDestroy, DoCheck, ViewContainerRef, Output } from '@angular/core';

@Component({
	selector: 'ng-widget-placeholder',
	template: ''
})
export class NgWidgetPlaceholder implements OnInit {
	private _size: INgWidgetSize;
	private _position: INgWidgetPosition;
	private _ngWidgetContainer: NgWidgetContainer;
	private _cascadeMode: string;

	constructor(private _ngEl: ElementRef, private _renderer: Renderer) { }

	// tslint:disable:typedef
	// tslint:disable:curly
	public registerGrid(ngGrid: NgWidgetContainer) {
		this._ngWidgetContainer = ngGrid;
	}

	public ngOnInit(): void {
		this._renderer.setElementClass(this._ngEl.nativeElement, 'widget-placeholder', true);
		if (this._ngWidgetContainer.autoStyle) this._renderer.setElementStyle(this._ngEl.nativeElement, 'position', 'absolute');
	}

	public setSize(newSize: INgWidgetSize): void {
		this._size = newSize;
		this._recalculateDimensions();
	}

	public setGridPosition(newPosition: INgWidgetPosition): void {
		this._position = newPosition;
		this._recalculatePosition();
	}

	public setCascadeMode(cascade: string): void {
		this._cascadeMode = cascade;
		switch (cascade) {
			case 'up':
			case 'left':
			default:
				this._renderer.setElementStyle(this._ngEl.nativeElement, 'left', '0px');
				this._renderer.setElementStyle(this._ngEl.nativeElement, 'top', '0px');
				this._renderer.setElementStyle(this._ngEl.nativeElement, 'right', null);
				this._renderer.setElementStyle(this._ngEl.nativeElement, 'bottom', null);
				break;
			case 'right':
				this._renderer.setElementStyle(this._ngEl.nativeElement, 'right', '0px');
				this._renderer.setElementStyle(this._ngEl.nativeElement, 'top', '0px');
				this._renderer.setElementStyle(this._ngEl.nativeElement, 'left', null);
				this._renderer.setElementStyle(this._ngEl.nativeElement, 'bottom', null);
				break;
			case 'down':
				this._renderer.setElementStyle(this._ngEl.nativeElement, 'left', '0px');
				this._renderer.setElementStyle(this._ngEl.nativeElement, 'bottom', '0px');
				this._renderer.setElementStyle(this._ngEl.nativeElement, 'right', null);
				this._renderer.setElementStyle(this._ngEl.nativeElement, 'top', null);
				break;
		}
	}

	// 	private methods
	private _setDimensions(w: number, h: number): void {
		this._renderer.setElementStyle(this._ngEl.nativeElement, 'width', w + 'px');
		this._renderer.setElementStyle(this._ngEl.nativeElement, 'height', h + 'px');
	}

	private _setPosition(x: number, y: number): void {
		switch (this._cascadeMode) {
			case 'up':
			case 'left':
			default:
				this._renderer.setElementStyle(this._ngEl.nativeElement, 'transform', 'translate(' + x + 'px, ' + y + 'px)');
				break;
			case 'right':
				this._renderer.setElementStyle(this._ngEl.nativeElement, 'transform', 'translate(' + -x + 'px, ' + y + 'px)');
				break;
			case 'down':
				this._renderer.setElementStyle(this._ngEl.nativeElement, 'transform', 'translate(' + x + 'px, ' + -y + 'px)');
				break;
		}
	}

	private _recalculatePosition(): void {
		const x: number = (this._ngWidgetContainer.colWidth + this._ngWidgetContainer.marginLeft + this._ngWidgetContainer.marginRight) * (this._position.col - 1) + this._ngWidgetContainer.marginLeft;
		const y: number = (this._ngWidgetContainer.rowHeight + this._ngWidgetContainer.marginTop + this._ngWidgetContainer.marginBottom) * (this._position.row - 1) + this._ngWidgetContainer.marginTop;
		this._setPosition(x, y);
	}

	private _recalculateDimensions(): void {
		const w: number = (this._ngWidgetContainer.colWidth * this._size.x) + ((this._ngWidgetContainer.marginLeft + this._ngWidgetContainer.marginRight) * (this._size.x - 1));
		const h: number = (this._ngWidgetContainer.rowHeight * this._size.y) + ((this._ngWidgetContainer.marginTop + this._ngWidgetContainer.marginBottom) * (this._size.y - 1));
		this._setDimensions(w, h);
	}
}