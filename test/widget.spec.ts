import { NgWidgetContainer, NgWidget } from '../dist/main';

export function main() {
	describe("NgWidget Directive", () => {
		it("should generate a ngGrid item", () => {
			var ngWidget: NgWidget = new NgWidget(null, null, null);
		});

		it("should set the element class on init", () => {
			var renderSpy = jasmine.createSpyObj('renderSpy', ['setElementClass', 'setElementStyle']);
			var ngEl: any = {};
			var ngGrid: any = {
				autoStyle: false
			};
			var ngWidget: NgWidget = new NgWidget(ngEl, renderSpy, ngGrid);
			spyOn(ngWidget, '_recalculateDimensions');
			spyOn(ngWidget, '_recalculatePosition');
			ngWidget.ngOnInit();
			expect(renderSpy.setElementClass).toHaveBeenCalledWith(ngEl, 'grid-item', true);
			expect(renderSpy.setElementStyle).not.toHaveBeenCalled();
			expect((<any>ngWidget)._recalculateDimensions).toHaveBeenCalled();
			expect((<any>ngWidget)._recalculatePosition).toHaveBeenCalled();
		});

		it("should set the element style on init if autoStyle is enabled", () => {
			var renderSpy = jasmine.createSpyObj('renderSpy', ['setElementClass', 'setElementStyle']);
			var ngEl: any = {};
			var ngGrid: any = {
				autoStyle: true
			};
			var ngWidget: NgWidget = new NgWidget(ngEl, renderSpy, ngGrid);
			spyOn(ngWidget, '_recalculateDimensions');
			spyOn(ngWidget, '_recalculatePosition');
			ngWidget.ngOnInit();
			expect(renderSpy.setElementClass).toHaveBeenCalledWith(ngEl, 'grid-item', true);
			expect(renderSpy.setElementStyle).toHaveBeenCalledWith(ngEl, 'position', 'absolute');
			expect((<any>ngWidget)._recalculateDimensions).toHaveBeenCalled();
			expect((<any>ngWidget)._recalculatePosition).toHaveBeenCalled();
		});

		it("should drag", () => {
			var ngWidget: NgWidget = new NgWidget(null, null, null);
			expect(ngWidget.canDrag(null)).toBe(true);

			var target: any = {
				parentElement: jasmine.createSpyObj('parentElement', ['querySelector'])
			};
			target.parentElement.querySelector.and.returnValue(target);

			(<any>ngWidget)._dragHandle = "#id";
			expect(ngWidget.canDrag({ target: target })).toBe(true);
			expect(target.parentElement.querySelector).toHaveBeenCalledWith('#id');

			target.parentElement.querySelector.and.returnValue({});
			expect(ngWidget.canDrag({ target: target })).toBe(false);
			expect(target.parentElement.querySelector).toHaveBeenCalledWith('#id');
		});

		it("should resize", () => {
			var target: any = {
				parentElement: jasmine.createSpyObj('parentElement', ['querySelector'])
			};
			target.parentElement.querySelector.and.returnValue(target);
			var e: any = { target: target };

			var ngWidget: NgWidget = new NgWidget(null, null, null);
			var getMousePositionSpy = spyOn(ngWidget, '_getMousePosition');
			getMousePositionSpy.and.returnValue({ left: 0, top: 0 });

			for (let size of [5, 10, 15]) {

				(<any>ngWidget)._borderSize = size;
				(<any>ngWidget)._elemHeight = -150;
				expect(ngWidget.canResize(e)).toBe(null);

				(<any>ngWidget)._elemHeight = 0;
				expect(ngWidget.canResize(e)).toBe(null);

				(<any>ngWidget)._elemHeight = 1;
				expect(ngWidget.canResize(e)).toBe('height');

				(<any>ngWidget)._elemHeight = size - 1;
				expect(ngWidget.canResize(e)).toBe('height');

				(<any>ngWidget)._elemHeight = size;
				expect(ngWidget.canResize(e)).toBe(null);

				(<any>ngWidget)._elemHeight = 150;
				expect(ngWidget.canResize(e)).toBe(null);


				(<any>ngWidget)._elemWidth = -150;
				expect(ngWidget.canResize(e)).toBe(null);

				(<any>ngWidget)._elemWidth = 0;
				expect(ngWidget.canResize(e)).toBe(null);

				(<any>ngWidget)._elemWidth = 1;
				expect(ngWidget.canResize(e)).toBe('width');

				(<any>ngWidget)._elemWidth = size - 1;
				expect(ngWidget.canResize(e)).toBe('width');

				(<any>ngWidget)._elemWidth = size;
				expect(ngWidget.canResize(e)).toBe(null);

				(<any>ngWidget)._elemWidth = 150;
				expect(ngWidget.canResize(e)).toBe(null);


				(<any>ngWidget)._elemWidth = -150;
				(<any>ngWidget)._elemHeight = 150;
				expect(ngWidget.canResize(e)).toBe(null);

				(<any>ngWidget)._elemWidth = 0;
				(<any>ngWidget)._elemHeight = 0;
				expect(ngWidget.canResize(e)).toBe(null);

				(<any>ngWidget)._elemWidth = 1;
				(<any>ngWidget)._elemHeight = 1;
				expect(ngWidget.canResize(e)).toBe('both');

				(<any>ngWidget)._elemWidth = size - 1;
				(<any>ngWidget)._elemHeight = size - 1;
				expect(ngWidget.canResize(e)).toBe('both');

				(<any>ngWidget)._elemWidth = size;
				(<any>ngWidget)._elemHeight = size;
				expect(ngWidget.canResize(e)).toBe(null);

				(<any>ngWidget)._elemWidth = 150;
				(<any>ngWidget)._elemHeight = 150;
				expect(ngWidget.canResize(e)).toBe(null);
			}

			(<any>ngWidget)._resizeHandle = "#id";
			expect(ngWidget.canResize(e)).toBe('both');

			target.parentElement.querySelector.and.returnValue({});
			expect(ngWidget.canResize(e)).toBe(null);
		});

		it("should update the cursor", () => {
			var e: any = {};
			var ngEl: any = {};
			var renderSpy = jasmine.createSpyObj('renderSpy', ['setElementStyle']);
			var ngGrid: any = {
				autoStyle: false,
				dragEnable: false,
				resizeEnable: false,
			};
			var ngWidget: NgWidget = new NgWidget(ngEl, renderSpy, ngGrid);
			spyOn(ngWidget, 'canDrag');
			spyOn(ngWidget, 'canResize');
			spyOn(ngWidget, '_getMousePosition');

			ngWidget.onMouseMove(e);
			expect(ngWidget.canDrag).not.toHaveBeenCalled();
			expect(ngWidget.canResize).not.toHaveBeenCalled();
			expect((<any>ngWidget)._getMousePosition).not.toHaveBeenCalled();
			expect(renderSpy.setElementStyle).not.toHaveBeenCalled();
			(<any>ngWidget.canDrag).calls.reset();
			(<any>ngWidget.canResize).calls.reset();
			(<any>ngWidget)._getMousePosition.calls.reset();
			renderSpy.setElementStyle.calls.reset();

			ngGrid.autoStyle = true;
			ngWidget.onMouseMove(e);
			expect(ngWidget.canDrag).not.toHaveBeenCalled();
			expect(ngWidget.canResize).not.toHaveBeenCalled();
			expect((<any>ngWidget)._getMousePosition).not.toHaveBeenCalled();
			expect(renderSpy.setElementStyle).toHaveBeenCalledWith(ngEl, 'cursor', 'default');
			(<any>ngWidget.canDrag).calls.reset();
			(<any>ngWidget.canResize).calls.reset();
			(<any>ngWidget)._getMousePosition.calls.reset();
			renderSpy.setElementStyle.calls.reset();

			(<any>ngWidget)._resizeHandle = true;
			ngGrid.resizeEnable = true;
			(<any>ngWidget.canResize).and.returnValue(true);
			ngWidget.onMouseMove(e);
			expect(ngWidget.canDrag).not.toHaveBeenCalled();
			expect(ngWidget.canResize).toHaveBeenCalled();
			expect((<any>ngWidget)._getMousePosition).not.toHaveBeenCalled();
			expect(renderSpy.setElementStyle).toHaveBeenCalledWith(ngEl, 'cursor', 'nwse-resize');
			(<any>ngWidget.canDrag).calls.reset();
			(<any>ngWidget.canResize).calls.reset();
			(<any>ngWidget)._getMousePosition.calls.reset();
			renderSpy.setElementStyle.calls.reset();

			(<any>ngWidget)._resizeHandle = false;
			(<any>ngWidget)._elemWidth = 0;
			(<any>ngWidget)._elemHeight = 0;
			(<any>ngWidget)._borderSize = 15;
			ngGrid.resizeEnable = true;
			(<any>ngWidget)._getMousePosition.and.returnValue({});
			ngWidget.onMouseMove(e);
			expect(ngWidget.canDrag).not.toHaveBeenCalled();
			expect(ngWidget.canResize).not.toHaveBeenCalled();
			expect((<any>ngWidget)._getMousePosition).toHaveBeenCalled();
			expect(renderSpy.setElementStyle).toHaveBeenCalledWith(ngEl, 'cursor', 'default');
			(<any>ngWidget.canDrag).calls.reset();
			(<any>ngWidget.canResize).calls.reset();
			(<any>ngWidget)._getMousePosition.calls.reset();
			renderSpy.setElementStyle.calls.reset();

			(<any>ngWidget)._resizeHandle = false;
			(<any>ngWidget)._elemWidth = 0;
			(<any>ngWidget)._elemHeight = 10;
			(<any>ngWidget)._borderSize = 15;
			ngGrid.resizeEnable = true;
			(<any>ngWidget)._getMousePosition.and.returnValue({ left: 0, top: 0 });
			ngWidget.onMouseMove(e);
			expect(ngWidget.canDrag).not.toHaveBeenCalled();
			expect(ngWidget.canResize).not.toHaveBeenCalled();
			expect((<any>ngWidget)._getMousePosition).toHaveBeenCalled();
			expect(renderSpy.setElementStyle).toHaveBeenCalledWith(ngEl, 'cursor', 'ns-resize');
			(<any>ngWidget.canDrag).calls.reset();
			(<any>ngWidget.canResize).calls.reset();
			(<any>ngWidget)._getMousePosition.calls.reset();
			renderSpy.setElementStyle.calls.reset();

			(<any>ngWidget)._resizeHandle = false;
			(<any>ngWidget)._elemWidth = 10;
			(<any>ngWidget)._elemHeight = 0;
			(<any>ngWidget)._borderSize = 15;
			ngGrid.resizeEnable = true;
			(<any>ngWidget)._getMousePosition.and.returnValue({ left: 0, top: 0 });
			ngWidget.onMouseMove(e);
			expect(ngWidget.canDrag).not.toHaveBeenCalled();
			expect(ngWidget.canResize).not.toHaveBeenCalled();
			expect((<any>ngWidget)._getMousePosition).toHaveBeenCalled();
			expect(renderSpy.setElementStyle).toHaveBeenCalledWith(ngEl, 'cursor', 'ew-resize');
			(<any>ngWidget.canDrag).calls.reset();
			(<any>ngWidget.canResize).calls.reset();
			(<any>ngWidget)._getMousePosition.calls.reset();
			renderSpy.setElementStyle.calls.reset();

			(<any>ngWidget)._resizeHandle = false;
			(<any>ngWidget)._elemWidth = 10;
			(<any>ngWidget)._elemHeight = 10;
			(<any>ngWidget)._borderSize = 15;
			ngGrid.resizeEnable = true;
			(<any>ngWidget)._getMousePosition.and.returnValue({ left: 0, top: 0 });
			ngWidget.onMouseMove(e);
			expect(ngWidget.canDrag).not.toHaveBeenCalled();
			expect(ngWidget.canResize).not.toHaveBeenCalled();
			expect((<any>ngWidget)._getMousePosition).toHaveBeenCalled();
			expect(renderSpy.setElementStyle).toHaveBeenCalledWith(ngEl, 'cursor', 'nwse-resize');
			(<any>ngWidget.canDrag).calls.reset();
			(<any>ngWidget.canResize).calls.reset();
			(<any>ngWidget)._getMousePosition.calls.reset();
			renderSpy.setElementStyle.calls.reset();


			(<any>ngWidget)._resizeHandle = false;
			ngGrid.dragEnable = true;
			(<any>ngWidget.canDrag).and.returnValue(true);
			ngWidget.onMouseMove(e);
			expect(ngWidget.canDrag).toHaveBeenCalled();
			expect(ngWidget.canResize).not.toHaveBeenCalled();
			expect((<any>ngWidget)._getMousePosition).not.toHaveBeenCalled();
			expect(renderSpy.setElementStyle).toHaveBeenCalledWith(ngEl, 'cursor', 'move');
			(<any>ngWidget.canDrag).calls.reset();
			(<any>ngWidget.canResize).calls.reset();
			(<any>ngWidget)._getMousePosition.calls.reset();
			renderSpy.setElementStyle.calls.reset();
		});

		it("should remove the item", () => {
			var ngGridSpy: any = jasmine.createSpyObj('ngGridSpy', ['removeItem'])
			var ngWidget: NgWidget = new NgWidget(null, null, ngGridSpy);
			(<any>ngWidget)._added = false;
			ngWidget.ngOnDestroy();
			expect(ngGridSpy.removeItem).not.toHaveBeenCalled();

			(<any>ngWidget)._added = true;
			ngWidget.ngOnDestroy();
			expect(ngGridSpy.removeItem).toHaveBeenCalledWith(ngWidget);
		});

		it("should get element", () => {
			var ngWidget: NgWidget = new NgWidget(null, null, null);
			var ngEl: any = {};
			(<any>ngWidget)._ngEl = ngEl;
			expect(ngWidget.getElement()).toBe(ngEl);
			(<any>ngWidget)._ngEl = null;
			expect(ngWidget.getElement()).toBe(null);
		});

		it("should get the drag handle", () => {
			var ngWidget: NgWidget = new NgWidget(null, null, null);
			var dragHandle: string = "dragHandle";
			(<any>ngWidget)._dragHandle = dragHandle;
			expect(ngWidget.getDragHandle()).toBe(dragHandle);
			(<any>ngWidget)._dragHandle = null;
			expect(ngWidget.getDragHandle()).toBe(null);
		});

		it("should get the resize handle", () => {
			var ngWidget: NgWidget = new NgWidget(null, null, null);
			var resizeHandle: string = "resizeHandle";
			(<any>ngWidget)._resizeHandle = resizeHandle;
			expect(ngWidget.getResizeHandle()).toBe(resizeHandle);
			(<any>ngWidget)._resizeHandle = null;
			expect(ngWidget.getResizeHandle()).toBe(null);
		});

		it("should get the dimensions", () => {
			var ngWidget: NgWidget = new NgWidget(null, null, null);
			(<any>ngWidget)._elemWidth = 100;
			(<any>ngWidget)._elemHeight = 200;
			expect(ngWidget.getDimensions().width).toBe(100);
			expect(ngWidget.getDimensions().height).toBe(200);
			(<any>ngWidget)._elemWidth = null;
			(<any>ngWidget)._elemHeight = null;
			expect(ngWidget.getDimensions().width).toBe(null);
			expect(ngWidget.getDimensions().height).toBe(null);
		});

		it("should get the size", () => {
			var ngWidget: NgWidget = new NgWidget(null, null, null);
			(<any>ngWidget)._sizex = 100;
			(<any>ngWidget)._sizey = 200;
			expect(ngWidget.getSize().x).toBe(100);
			expect(ngWidget.getSize().y).toBe(200);
			(<any>ngWidget)._sizex = null;
			(<any>ngWidget)._sizey = null;
			expect(ngWidget.getSize().x).toBe(null);
			expect(ngWidget.getSize().y).toBe(null);
		});

		it("should get the position", () => {
			var ngWidget: NgWidget = new NgWidget(null, null, null);
			(<any>ngWidget)._elemLeft = 100;
			(<any>ngWidget)._elemTop = 200;
			expect(ngWidget.getPosition().left).toBe(100);
			expect(ngWidget.getPosition().top).toBe(200);
			(<any>ngWidget)._elemLeft = null;
			(<any>ngWidget)._elemTop = null;
			expect(ngWidget.getPosition().left).toBe(null);
			expect(ngWidget.getPosition().top).toBe(null);
		});

		it("should get the grid position", () => {
			var ngWidget: NgWidget = new NgWidget(null, null, null);
			(<any>ngWidget)._col = 100;
			(<any>ngWidget)._row = 200;
			expect(ngWidget.getGridPosition().col).toBe(100);
			expect(ngWidget.getGridPosition().row).toBe(200);
			(<any>ngWidget)._col = null;
			(<any>ngWidget)._row = null;
			expect(ngWidget.getGridPosition().col).toBe(null);
			expect(ngWidget.getGridPosition().row).toBe(null);
		});

		it("should set the config", () => {
			var ngWidget: NgWidget = new NgWidget(null, null, null);
			spyOn(ngWidget, '_recalculatePosition');
			spyOn(ngWidget, '_recalculateDimensions');
			var config: any = {
				col: 1,
				row: 2,
				sizex: 3,
				sizey: 4,
				dragHandle: '5',
				resizeHandle: '6'
			};
			ngWidget.setConfig(config);
			expect((<any>ngWidget)._col).toBe(1);
			expect((<any>ngWidget)._row).toBe(2);
			expect((<any>ngWidget)._sizex).toBe(3);
			expect((<any>ngWidget)._sizey).toBe(4);
			expect((<any>ngWidget)._dragHandle).toBe('5');
			expect((<any>ngWidget)._resizeHandle).toBe('6');
			expect((<any>ngWidget)._recalculatePosition).toHaveBeenCalled();
			expect((<any>ngWidget)._recalculateDimensions).toHaveBeenCalled();
		});

		it("should set the size", () => {
			var ngWidget: NgWidget = new NgWidget(null, null, null);
			spyOn(ngWidget, '_recalculateDimensions');
			var newSizeX = 31;
			var newSizeY = 27;
			ngWidget.setSize(newSizeX, newSizeY);
			expect((<any>ngWidget)._sizex).toBe(newSizeX);
			expect((<any>ngWidget)._sizey).toBe(newSizeY);
			expect((<any>ngWidget)._recalculateDimensions).toHaveBeenCalled();
		});

		it("should set the grid position", () => {
			var ngWidget: NgWidget = new NgWidget(null, null, null);
			spyOn(ngWidget, '_recalculatePosition');
			var newCol = 31;
			var newRow = 27;
			ngWidget.setGridPosition(newCol, newRow);
			expect((<any>ngWidget)._col).toBe(newCol);
			expect((<any>ngWidget)._row).toBe(newRow);
			expect((<any>ngWidget)._recalculatePosition).toHaveBeenCalled();
		});

		it("should set the position according to the cascade type", () => {
			var renderSpy = jasmine.createSpyObj('renderSpy', ['setElementStyle']);
			var ngEl: any = {};
			var ngGrid: any = {};
			var ngWidget: NgWidget = new NgWidget(ngEl, renderSpy, ngGrid);
			var newX = 31;
			var newY = 27;

			(<any>ngWidget).setPosition(newX, newY);
			expect(renderSpy.setElementStyle).toHaveBeenCalledWith(ngEl, 'left', "31px");
			expect(renderSpy.setElementStyle).toHaveBeenCalledWith(ngEl, 'top', "27px");
			expect(renderSpy.setElementStyle).toHaveBeenCalledWith(ngEl, 'right', null);
			expect(renderSpy.setElementStyle).toHaveBeenCalledWith(ngEl, 'bottom', null);
			(<any>renderSpy.setElementStyle).calls.reset();

			ngGrid.cascade = 'up';
			(<any>ngWidget).setPosition(newX, newY);
			expect(renderSpy.setElementStyle).toHaveBeenCalledWith(ngEl, 'left', "31px");
			expect(renderSpy.setElementStyle).toHaveBeenCalledWith(ngEl, 'top', "27px");
			expect(renderSpy.setElementStyle).toHaveBeenCalledWith(ngEl, 'right', null);
			expect(renderSpy.setElementStyle).toHaveBeenCalledWith(ngEl, 'bottom', null);
			(<any>renderSpy.setElementStyle).calls.reset();

			ngGrid.cascade = 'left';
			(<any>ngWidget).setPosition(newX, newY);
			expect(renderSpy.setElementStyle).toHaveBeenCalledWith(ngEl, 'left', "31px");
			expect(renderSpy.setElementStyle).toHaveBeenCalledWith(ngEl, 'top', "27px");
			expect(renderSpy.setElementStyle).toHaveBeenCalledWith(ngEl, 'right', null);
			expect(renderSpy.setElementStyle).toHaveBeenCalledWith(ngEl, 'bottom', null);
			(<any>renderSpy.setElementStyle).calls.reset();

			ngGrid.cascade = 'right';
			(<any>ngWidget).setPosition(newX, newY);
			expect(renderSpy.setElementStyle).toHaveBeenCalledWith(ngEl, 'right', "31px");
			expect(renderSpy.setElementStyle).toHaveBeenCalledWith(ngEl, 'top', "27px");
			expect(renderSpy.setElementStyle).toHaveBeenCalledWith(ngEl, 'left', null);
			expect(renderSpy.setElementStyle).toHaveBeenCalledWith(ngEl, 'bottom', null);
			(<any>renderSpy.setElementStyle).calls.reset();

			ngGrid.cascade = 'down';
			(<any>ngWidget).setPosition(newX, newY);
			expect(renderSpy.setElementStyle).toHaveBeenCalledWith(ngEl, 'left', "31px");
			expect(renderSpy.setElementStyle).toHaveBeenCalledWith(ngEl, 'bottom', "27px");
			expect(renderSpy.setElementStyle).toHaveBeenCalledWith(ngEl, 'right', null);
			expect(renderSpy.setElementStyle).toHaveBeenCalledWith(ngEl, 'top', null);
			(<any>renderSpy.setElementStyle).calls.reset();
		});

		it("should set the dimensions", () => {
			var renderSpy = jasmine.createSpyObj('renderSpy', ['setElementStyle']);
			var ngEl: any = {};
			var ngWidget: NgWidget = new NgWidget(ngEl, renderSpy, null);
			var newWidth = 31;
			var newHeight = 27;
			(<any>ngWidget).setDimensions(newWidth, newHeight);
			expect(renderSpy.setElementStyle).toHaveBeenCalledWith(ngEl, 'width', "31px");
			expect(renderSpy.setElementStyle).toHaveBeenCalledWith(ngEl, 'height', "27px");
		});

		it("should recalculate the position", () => {
			var ngGrid: any = {
				marginLeft: 1,
				marginRight: 2,
				colWidth: 3,
				marginTop: 4,
				marginBottom: 5,
				rowHeight: 6
			};
			var ngWidget: NgWidget = new NgWidget(null, null, ngGrid);
			spyOn(ngWidget, 'setPosition');
			(<any>ngWidget)._col = 7;
			(<any>ngWidget)._row = 8;

			(<any>ngWidget)._recalculatePosition();
			expect((<any>ngWidget).setPosition).toHaveBeenCalledWith(37, 109);
		});

		it("should recalculate dimensions", () => {
			var ngGrid: any = {
				marginLeft: 1,
				marginRight: 2,
				colWidth: 3,
				marginTop: 4,
				marginBottom: 5,
				rowHeight: 6,
				minCols: 1,
				minRows: 1,
			};
			var ngWidget: NgWidget = new NgWidget(null, null, ngGrid);
			spyOn(ngWidget, 'setDimensions');
			(<any>ngWidget)._sizex = 7;
			(<any>ngWidget)._sizey = 8;

			(<any>ngWidget)._recalculateDimensions();
			expect((<any>ngWidget).setDimensions).toHaveBeenCalledWith(39, 111);

			ngGrid.minCols = 7;
			ngGrid.minRows = 8;

			(<any>ngWidget)._sizex = 1;
			(<any>ngWidget)._sizey = 1;

			(<any>ngWidget)._recalculateDimensions();
			expect((<any>ngWidget).setDimensions).toHaveBeenCalledWith(39, 111);
		});

		it("should recalculate position and dimensions when recalculating self", () => {
			spyOn(NgWidget.prototype, "_recalculateDimensions");
			spyOn(NgWidget.prototype, "_recalculatePosition");

			var ngWidget: NgWidget = new NgWidget(null, null, null);

			ngWidget.recalculateSelf();

			expect((<any>ngWidget)._recalculatePosition).toHaveBeenCalled();
			expect((<any>ngWidget)._recalculateDimensions).toHaveBeenCalled();
		});

		it("should add moving class and styles on startMoving", () => {
			var renderSpy = jasmine.createSpyObj('renderSpy', ['setElementStyle', 'setElementClass']);
			var styleSpy = jasmine.createSpyObj('styleSpy', ['getPropertyValue']);
			styleSpy.getPropertyValue.and.returnValue(100);
			var oldGetCompStyle = window.getComputedStyle;
			(<any>window).getComputedStyle = jasmine.createSpy("getComputedStyle").and.returnValue(styleSpy);

			var ngGrid: any = { 'autoStyle': false };
			var elem: any = { 'nativeElement': {} };

			var ngWidget: NgWidget = new NgWidget(elem, renderSpy, ngGrid);
			ngWidget.startMoving();

			expect(window.getComputedStyle).toHaveBeenCalledWith(elem.nativeElement);
			expect(renderSpy.setElementClass).toHaveBeenCalledWith(elem, 'moving', true);
			expect(renderSpy.setElementStyle).not.toHaveBeenCalled();
			expect(styleSpy.getPropertyValue).not.toHaveBeenCalled();

			ngGrid.autoStyle = true;
			ngWidget.startMoving();

			expect(renderSpy.setElementStyle).toHaveBeenCalledWith(elem, 'z-index', '101');
			expect(styleSpy.getPropertyValue).toHaveBeenCalledWith('z-index');

			(<any>window).getComputedStyle = oldGetCompStyle;
		});

		it("should remove moving class and styles on stopMoving", () => {
			var renderSpy = jasmine.createSpyObj('renderSpy', ['setElementStyle', 'setElementClass']);
			var styleSpy = jasmine.createSpyObj('styleSpy', ['getPropertyValue']);
			styleSpy.getPropertyValue.and.returnValue(100);
			var oldGetCompStyle = window.getComputedStyle;
			(<any>window).getComputedStyle = jasmine.createSpy("getComputedStyle").and.returnValue(styleSpy);

			var ngGrid: any = { 'autoStyle': false };
			var elem: any = { 'nativeElement': {} };

			var ngWidget: NgWidget = new NgWidget(elem, renderSpy, ngGrid);
			ngWidget.stopMoving();

			expect(window.getComputedStyle).toHaveBeenCalledWith(elem.nativeElement);
			expect(renderSpy.setElementClass).toHaveBeenCalledWith(elem, 'moving', false);
			expect(renderSpy.setElementStyle).not.toHaveBeenCalled();
			expect(styleSpy.getPropertyValue).not.toHaveBeenCalled();

			ngGrid.autoStyle = true;
			ngWidget.stopMoving();

			expect(renderSpy.setElementStyle).toHaveBeenCalledWith(elem, 'z-index', '99');
			expect(styleSpy.getPropertyValue).toHaveBeenCalledWith('z-index');

			(<any>window).getComputedStyle = oldGetCompStyle;
		});

		it("should attempt to calculate the mouse position", () => {
			var event: any = {
				clientX: 14234,
				clientY: 24323,
				'originalEvent': {
					'touches': null,
					'changedTouches': null
				}
			};
			var elem: any = {
				'nativeElement': {
					'getBoundingClientRect': jasmine.createSpy('elemSpy').and.returnValue({ 'left': 4353, 'top': 3554 })
				}
			}

			var ngWidget: NgWidget = new NgWidget(elem, null, null);

			expect((<any>ngWidget)._getMousePosition(event)).toEqual({ 'left': 9881, 'top': 20769 });

			event.originalEvent.touches = [];
			event.originalEvent.changedTouches = [{ 'clientX': 8658, 'clientY': 9757 }];

			expect((<any>ngWidget)._getMousePosition(event)).toEqual({ 'left': 4305, 'top': 6203 });

			event.originalEvent.touches = [{ 'clientX': 34523, 'clientY': 7898 }];
			expect((<any>ngWidget)._getMousePosition(event)).toEqual({ 'left': 30170, 'top': 4344 });
		});

		it("should add self to ngGrid, store config and recalculate when config is set", () => {
			spyOn(NgWidget.prototype, '_recalculatePosition');
			spyOn(NgWidget.prototype, '_recalculateDimensions');
			spyOn(NgWidget.prototype, 'setConfig');

			var ngGrid: any = jasmine.createSpyObj('NgGridSpy', ['addItem']);
			var ngWidget: NgWidget = new NgWidget(null, null, ngGrid);

			ngWidget.config = { 'col': 5, 'row': 2 };

			expect(ngWidget.setConfig).toHaveBeenCalled();
			expect(ngGrid.addItem).toHaveBeenCalledWith(ngWidget);
			expect((<any>ngWidget)._recalculatePosition).toHaveBeenCalled();
			expect((<any>ngWidget)._recalculateDimensions).toHaveBeenCalled();
			expect((<any>ngWidget)._added).toBe(true);

			ngGrid.addItem.calls.reset();
			ngWidget.config = {};

			expect(ngGrid.addItem).not.toHaveBeenCalledWith(ngWidget);
		});
	});
}