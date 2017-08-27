import { NgWidgetContainer, NgWidget, NgWidgetPlaceholder } from '../dist/main';

export function main() {
	describe("NgWidgetPlaceholder Component", () => {
		it("should generate a ngGrid placeholder", () => {
			var NgWidgetPlaceholder: NgWidgetPlaceholder = new NgWidgetPlaceholder(null, null, null);
		});

		it("should set the element class on init", () => {
			var renderSpy = jasmine.createSpyObj('renderSpy', ['setElementClass', 'setElementStyle']);
			var ngEl: any = {};
			var ngGrid: any = {
				autoStyle: false
			};
			var NgWidgetPlaceholder: NgWidgetPlaceholder = new NgWidgetPlaceholder(ngEl, renderSpy, ngGrid);
			NgWidgetPlaceholder.ngOnInit();
			expect(renderSpy.setElementClass).toHaveBeenCalledWith(ngEl, 'grid-placeholder', true);
			expect(renderSpy.setElementStyle).not.toHaveBeenCalled();
		});

		it("should set the element style on init if autoStyle is enabled", () => {
			var renderSpy = jasmine.createSpyObj('renderSpy', ['setElementClass', 'setElementStyle']);
			var ngEl: any = {};
			var ngGrid: any = {
				autoStyle: true
			};
			var NgWidgetPlaceholder: NgWidgetPlaceholder = new NgWidgetPlaceholder(ngEl, renderSpy, ngGrid);
			NgWidgetPlaceholder.ngOnInit();
			expect(renderSpy.setElementClass).toHaveBeenCalledWith(ngEl, 'grid-placeholder', true);
			expect(renderSpy.setElementStyle).toHaveBeenCalledWith(ngEl,'position', 'absolute');
		});

		it("should set the size", () => {
			var NgWidgetPlaceholder: NgWidgetPlaceholder = new NgWidgetPlaceholder(null, null, null);
			spyOn(NgWidgetPlaceholder, '_recalculateDimensions');
			var newSizeX = 31;
			var newSizeY = 27;
			NgWidgetPlaceholder.setSize(newSizeX, newSizeY);
			expect((<any>NgWidgetPlaceholder)._sizex).toBe(newSizeX);
			expect((<any>NgWidgetPlaceholder)._sizey).toBe(newSizeY);
			expect((<any>NgWidgetPlaceholder)._recalculateDimensions).toHaveBeenCalled();
		});

		it("should set the grid position", () => {
			var NgWidgetPlaceholder: NgWidgetPlaceholder = new NgWidgetPlaceholder(null, null, null);
			spyOn(NgWidgetPlaceholder, '_recalculatePosition');
			var newCol = 31;
			var newRow = 27;
			NgWidgetPlaceholder.setGridPosition(newCol, newRow);
			expect((<any>NgWidgetPlaceholder)._col).toBe(newCol);
			expect((<any>NgWidgetPlaceholder)._row).toBe(newRow);
			expect((<any>NgWidgetPlaceholder)._recalculatePosition).toHaveBeenCalled();
		});

		it("should set the position according to the cascade type", () => {
			var renderSpy = jasmine.createSpyObj('renderSpy', ['setElementStyle']);
			var ngEl: any = {};
			var ngGrid: any = {};
			var NgWidgetPlaceholder: NgWidgetPlaceholder = new NgWidgetPlaceholder(ngEl, renderSpy, ngGrid);
			var newX = 31;
			var newY = 27;

			(<any>NgWidgetPlaceholder)._setPosition(newX, newY);
			expect(renderSpy.setElementStyle).toHaveBeenCalledWith(ngEl, 'left', "31px");
			expect(renderSpy.setElementStyle).toHaveBeenCalledWith(ngEl, 'top', "27px");
			expect(renderSpy.setElementStyle).toHaveBeenCalledWith(ngEl, 'right', null);
			expect(renderSpy.setElementStyle).toHaveBeenCalledWith(ngEl, 'bottom', null);
			(<any>renderSpy.setElementStyle).calls.reset();

			ngGrid.cascade = 'up';
			(<any>NgWidgetPlaceholder)._setPosition(newX, newY);
			expect(renderSpy.setElementStyle).toHaveBeenCalledWith(ngEl, 'left', "31px");
			expect(renderSpy.setElementStyle).toHaveBeenCalledWith(ngEl, 'top', "27px");
			expect(renderSpy.setElementStyle).toHaveBeenCalledWith(ngEl, 'right', null);
			expect(renderSpy.setElementStyle).toHaveBeenCalledWith(ngEl, 'bottom', null);
			(<any>renderSpy.setElementStyle).calls.reset();

			ngGrid.cascade = 'left';
			(<any>NgWidgetPlaceholder)._setPosition(newX, newY);
			expect(renderSpy.setElementStyle).toHaveBeenCalledWith(ngEl, 'left', "31px");
			expect(renderSpy.setElementStyle).toHaveBeenCalledWith(ngEl, 'top', "27px");
			expect(renderSpy.setElementStyle).toHaveBeenCalledWith(ngEl, 'right', null);
			expect(renderSpy.setElementStyle).toHaveBeenCalledWith(ngEl, 'bottom', null);
			(<any>renderSpy.setElementStyle).calls.reset();
			
			ngGrid.cascade = 'right';
			(<any>NgWidgetPlaceholder)._setPosition(newX, newY);
			expect(renderSpy.setElementStyle).toHaveBeenCalledWith(ngEl, 'right', "31px");
			expect(renderSpy.setElementStyle).toHaveBeenCalledWith(ngEl, 'top', "27px");
			expect(renderSpy.setElementStyle).toHaveBeenCalledWith(ngEl, 'left', null);
			expect(renderSpy.setElementStyle).toHaveBeenCalledWith(ngEl, 'bottom', null);
			(<any>renderSpy.setElementStyle).calls.reset();

			ngGrid.cascade = 'down';
			(<any>NgWidgetPlaceholder)._setPosition(newX, newY);
			expect(renderSpy.setElementStyle).toHaveBeenCalledWith(ngEl, 'left', "31px");
			expect(renderSpy.setElementStyle).toHaveBeenCalledWith(ngEl, 'bottom', "27px");
			expect(renderSpy.setElementStyle).toHaveBeenCalledWith(ngEl, 'right', null);
			expect(renderSpy.setElementStyle).toHaveBeenCalledWith(ngEl, 'top', null);
			(<any>renderSpy.setElementStyle).calls.reset();
		});

		it("should set the dimensions", () => {
			var renderSpy = jasmine.createSpyObj('renderSpy', ['setElementStyle']);
			var ngEl: any = {};
			var NgWidgetPlaceholder: NgWidgetPlaceholder = new NgWidgetPlaceholder(ngEl, renderSpy, null);
			var newWidth = 31;
			var newHeight = 27;
			(<any>NgWidgetPlaceholder)._setDimensions(newWidth, newHeight);
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
			var NgWidgetPlaceholder: NgWidgetPlaceholder = new NgWidgetPlaceholder(null, null, ngGrid);
			spyOn(NgWidgetPlaceholder, '_setPosition');
			(<any>NgWidgetPlaceholder)._col = 7;
			(<any>NgWidgetPlaceholder)._row = 8;

			(<any>NgWidgetPlaceholder)._recalculatePosition();
			expect((<any>NgWidgetPlaceholder)._setPosition).toHaveBeenCalledWith(37, 109);
		});

		it("should recalculate dimensions", () => {
			var ngGrid: any = {
				marginLeft: 1,
				marginRight: 2,
				colWidth: 3,
				marginTop: 4,
				marginBottom: 5,
				rowHeight: 6
			};
			var NgWidgetPlaceholder: NgWidgetPlaceholder = new NgWidgetPlaceholder(null, null, ngGrid);
			spyOn(NgWidgetPlaceholder, '_setDimensions');
			(<any>NgWidgetPlaceholder)._sizex = 7;
			(<any>NgWidgetPlaceholder)._sizey = 8;

			(<any>NgWidgetPlaceholder)._recalculateDimensions();
			expect((<any>NgWidgetPlaceholder)._setDimensions).toHaveBeenCalledWith(39, 111);
		});
	});
}