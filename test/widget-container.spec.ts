import { Renderer, KeyValueDiffers } from '@angular/core';
import { NgWidgetContainer, NgWidget, NgWidgetPlaceholder } from '../dist/main';

export function main(): void {
	describe("NgWidgetContainer Directive", () => {
		it("should initialise element styles and config ngOnInit", () => {
			spyOn(NgWidgetContainer.prototype, "setConfig");
			var renderSpy:any = jasmine.createSpyObj('renderSpy', ['setElementStyle', 'setElementClass']);

			var ngWidgetContainer:NgWidgetContainer = new NgWidgetContainer(null, null, renderSpy, null,null);

			ngWidgetContainer.ngOnInit();

			expect(renderSpy.setElementClass).toHaveBeenCalled();
			expect(renderSpy.setElementStyle).toHaveBeenCalled();
			expect(ngWidgetContainer.setConfig).toHaveBeenCalled();
			
			(<any>renderSpy.setElementStyle).calls.reset();
			(<any>renderSpy.setElementClass).calls.reset();
			(<any>ngWidgetContainer.setConfig).calls.reset();
			
			ngWidgetContainer.autoStyle = false;
			ngWidgetContainer.ngOnInit();
			
			expect(renderSpy.setElementClass).toHaveBeenCalled();
			expect(renderSpy.setElementStyle).not.toHaveBeenCalled();
			expect(ngWidgetContainer.setConfig).toHaveBeenCalled();
		});
		
		it("should set dragEnable to the relevant value on enable/disable drag", () => {
			var ngWidgetContainer = new NgWidgetContainer(null, null, null, null,null);
			
			ngWidgetContainer.dragEnable = false;
			ngWidgetContainer.enableDrag();
			
			expect(ngWidgetContainer.dragEnable).toBe(true);
			
			ngWidgetContainer.disableDrag();
			
			expect(ngWidgetContainer.dragEnable).toBe(false);
		});
		
		it("should set resizeEnable to the relevant value on enable/disable resize", () => {
			var ngWidgetContainer = new NgWidgetContainer(null, null, null, null,null);
			
			ngWidgetContainer.resizeEnable = false;
			ngWidgetContainer.enableResize();
			
			expect(ngWidgetContainer.resizeEnable).toBe(true);
			
			ngWidgetContainer.disableResize();
			
			expect(ngWidgetContainer.resizeEnable).toBe(false);
		});
		
		it("should set the margins when calling setMargins", () => {
			var ngWidgetContainer = new NgWidgetContainer(null, null, null, null,null);
			
			ngWidgetContainer.setMargins(['5']);
			
			expect(ngWidgetContainer.marginTop).toBe(5);
			expect(ngWidgetContainer.marginRight).toBe(5);
			expect(ngWidgetContainer.marginBottom).toBe(5);
			expect(ngWidgetContainer.marginLeft).toBe(5);
			
			ngWidgetContainer.setMargins(['5', '10']);
			
			expect(ngWidgetContainer.marginTop).toBe(5);
			expect(ngWidgetContainer.marginRight).toBe(10);
			expect(ngWidgetContainer.marginBottom).toBe(5);
			expect(ngWidgetContainer.marginLeft).toBe(10);
			
			ngWidgetContainer.setMargins(['5', '10', '7']);
			
			expect(ngWidgetContainer.marginTop).toBe(5);
			expect(ngWidgetContainer.marginRight).toBe(10);
			expect(ngWidgetContainer.marginBottom).toBe(7);
			expect(ngWidgetContainer.marginLeft).toBe(10);
			
			ngWidgetContainer.setMargins(['5', '10', '7', '12']);
			
			expect(ngWidgetContainer.marginTop).toBe(5);
			expect(ngWidgetContainer.marginRight).toBe(10);
			expect(ngWidgetContainer.marginBottom).toBe(7);
			expect(ngWidgetContainer.marginLeft).toBe(12);
		});
		
		it("should fix collisions with other items", ()=> {
			var renderSpy = jasmine.createSpyObj("Renderer", ["setElementStyle", "setElementClass"]);
			var ngWidgetContainer: NgWidgetContainer = new NgWidgetContainer(null, null, renderSpy, null,null);
			var item1 = new NgWidget(null, null,renderSpy, ngWidgetContainer,null);
			var item2 = new NgWidget(null, null, renderSpy, ngWidgetContainer,null);
			var item3 = new NgWidget(null, null, renderSpy, ngWidgetContainer, null);
			var item4 = new NgWidget(null, null, renderSpy, ngWidgetContainer,null);
			
			item1.config = {col: 1, row: 1, sizex: 1, sizey: 1};
			item2.config = {col: 2, row: 1, sizex: 1, sizey: 3};
			item3.config = {col: 2, row: 2, sizex: 1, sizey: 1};
			item4.config = {col: 1, row: 3, sizex: 1, sizey: 1};
			
			expect((<any>item1)._col).toBe(1);
			expect((<any>item1)._row).toBe(1);
			expect((<any>item2)._col).toBe(2);
			expect((<any>item2)._row).toBe(1);
			expect((<any>item3)._col).toBe(3);
			expect((<any>item3)._row).toBe(2);
			expect((<any>item4)._col).toBe(1);
			expect((<any>item4)._row).toBe(3);
		});
		
		it("should fix cascade items up", ()=> {
			var renderSpy = jasmine.createSpyObj("Renderer", ["setElementStyle", "setElementClass"]);
            var ngWidgetContainer = new NgWidgetContainer(null, null, renderSpy, null, null);
            var item1 = new NgWidget(null, null, renderSpy, ngWidgetContainer, null);
			var item2 = new NgWidget(null, null, renderSpy, ngWidgetContainer,null);
			var item3 = new NgWidget(null, null, renderSpy, ngWidgetContainer, null);
			var item4 = new NgWidget(null, null, renderSpy, ngWidgetContainer, null);
			
			item1.config = {col: 1, row: 1, sizex: 4, sizey: 1};
			item2.config = {col: 2, row: 3, sizex: 1, sizey: 3};
			item3.config = {col: 2, row: 7, sizex: 2, sizey: 1};
			item4.config = {col: 1, row: 3, sizex: 1, sizey: 1};
			
			(<any>ngWidgetContainer)._cascadeGrid();
			
			expect((<any>item1)._col).toBe(1);
			expect((<any>item1)._row).toBe(1);
			expect((<any>item2)._col).toBe(2);
			expect((<any>item2)._row).toBe(2);
			expect((<any>item3)._col).toBe(2);
			expect((<any>item3)._row).toBe(5);
			expect((<any>item4)._col).toBe(1);
			expect((<any>item4)._row).toBe(2);
			
			try {
				(<any>ngWidgetContainer)._cascadeGrid({});
				expect(false).toBe(true);
			} catch(err) {
				
			}
			
			(<any>ngWidgetContainer)._cascadeGrid({col: 4, row: 1}, {x: 1, y: 1});
			
			expect((<any>item1)._col).toBe(1);
			expect((<any>item1)._row).toBe(2);
			expect((<any>item2)._col).toBe(2);
			expect((<any>item2)._row).toBe(3);
			expect((<any>item3)._col).toBe(2);
			expect((<any>item3)._row).toBe(6);
			expect((<any>item4)._col).toBe(1);
			expect((<any>item4)._row).toBe(3);
		});
	});
}