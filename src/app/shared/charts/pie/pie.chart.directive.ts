import { Component, Input, ViewChild,ElementRef, OnChanges, SimpleChanges, ViewEncapsulation,  AfterViewInit, OnInit } from '@angular/core';
import { PieChartConfig } from './pie.chart.config';
import { PieChart } from "./pie.chart";
import * as d3Select from 'd3-selection';
import * as deepEqual from "deep-equal";

@Component({
    moduleId: module.id,

    selector: 'pie-chart',
    template: "<div #nChart class='n-chart-container'></div>",
    styleUrls: ["../style.scss"],
    encapsulation: ViewEncapsulation.None
})
export class PieChartComponent implements AfterViewInit, OnInit, OnChanges {
    /**
	 * Data passed to charts library for displaying
	 */
    set data(newData) {
        this._data = newData;
    }

    get data() {
        return this._data;
    }

    /**
	 * Options passed to charts library
	 */
    @Input() options: PieChartConfig;

    @ViewChild("nChart") chartRef;
	/**
	 * Chart object instance
	 *
	 */
    chart;

    private _data: any;
    private _update: any;
    
    /**
    * We request angular for the element reference 
    * and then we create a d3 Wrapper for our host element
    **/
    constructor(private element: ElementRef) {
        this._update = false;
    }

    ngOnInit() {
        // Width prop is mandatory
        if (!this.options){
            console.error("Missing `options` Input!");
            return;
        } 
        if (!this.options.config.width) {
            console.error("Missing `width` Input!");
            //this.options.config.width = this.chartRef.nativeElement.clientWidth ;//- this.margin.left - this.margin.right;
        }

        // Height prop is mandatory
        if (!this.options.config.height) {
            console.error("Missing `height` Input!");
            //this.options.config.height = this.chartRef.nativeElement.clientHeight;// - this.margin.top - this.margin.bottom;
        }

        // Data prop is mandatory for the wrappers
        if (!this.options.data || this.options.data.length==0 ) {
            console.error("Missing `data` Input!");
            return;
        }
    }
    /**
	 * Runs after view init to create a chart, attach it to `_htmlElement` and draw it.
	 */
    ngAfterViewInit() {
        this.chart = new PieChart(
            this.chartRef.nativeElement,
            {
                data: this.options.data,
                options: this.options
            }
        );
        this._update = true;
        Object.assign(this, this.chart);
    }
    /**
	 * Runs after chart data or chat option is updated to refesh the chart.
	 */
    ngOnChanges(changes: SimpleChanges): void {
        // update data set

        // If data already exists, that means the chart has been initialized
        const dataExistsAlready = this._data !== null && this._data !== undefined;
        // Check if 
            //1. chart data already existed , if not set it to current value
        // else check if 
            //1. chart data is set
            //2. chart data has values
            //3. chart data is not same as old chart data
        // and update is data is new compared to previous data
        if (!dataExistsAlready){
            this._data = this.options.data;  
            if (this._update){
                this.chart = new PieChart(
                    this.chartRef.nativeElement,
                    {
                        data: this.options.data,
                        options: this.options
                    }
                );
                Object.assign(this, this.chart);
            }  
        }else if (this.options.data && this.options.data.length> 0 && !deepEqual(this._data,this.options.data) ) {
            this._data = this.options.data;
            this.chart.setData(this._data);
        }else if (!this.options.data || this.options.data.length <= 0){
            this._data = this.options.data;
            d3Select.select(this.chartRef.nativeElement).html('');
        }
    }
}
