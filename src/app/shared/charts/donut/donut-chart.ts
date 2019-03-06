// D3 Imports
import { select, selectAll, mouse } from "d3-selection";
import { scaleOrdinal } from "d3-scale";
import { pie, arc } from "d3-shape";
import { interpolate, interpolateNumber } from "d3-interpolate";
import * as ease from "d3-ease";
import * as array from "d3-array";
import { BaseChart } from "../base.chart";
import * as Configuration from "./donut.chart.config";
import { Tools } from "../tools";

export class DonutChart extends BaseChart {
	pie: any;
	arc: any;
	path: any;

	// Used to assign colors to each slice by their label
	colorScale: any;

	constructor(holder: Element, configs: any, type: string = "donut") {
		super(holder, configs);

		this.options.type = type;

		// Assign colors to each slice using their label
		this.colorScale = scaleOrdinal(this.options.colors);
	}

	// Sort data by value (descending)
	// Cap number of slices at a specific number, and group the remaining items into the label "Other"
	dataProcessor(dataObject: any) {
		// Check for duplicate keys in the data
		const duplicates = Tools.getDuplicateValues(dataObject);
		if (duplicates.length > 0) {
			console.error(`${Tools.capitalizeFirstLetter(this.options.type)} Chart - You have duplicate keys`, duplicates);
		}
		const dataList = dataObject.map(data => ({
			label: data.category,
			value: data.value,
			color: data.color
		}));

		// Sort data by value
		let sortedData = dataList.sort((a, b) => b.value - a.value);

		// Keep a certain number of slices, and add an "Other" slice for the rest
		const { sliceLimit: stopAt } = Configuration.donut;
		const rest = sortedData.slice(stopAt);
		const restAccumulatedValue = rest.reduce((accum, item) => accum + item.value, 0);

		const otherLabelIndex = sortedData.findIndex(dataPoint => dataPoint.label === "Other");
		if (otherLabelIndex !== -1) {
			sortedData.push(sortedData.splice(otherLabelIndex, 1)[0]);
		} else if (rest.length > 0) {
			sortedData = sortedData.slice(0, stopAt)
				.concat([{
					label: Configuration.donut.label.other,
					value: restAccumulatedValue,
					items: rest
				}]);
		}

		// Sort labels based on the order made above
		dataObject.labels = sortedData.map((datum, i) => datum.label);
		dataObject.colors = sortedData.map((datum, i) => datum.color);
		dataObject.datasets = sortedData;

		return dataObject;
	}

	// If there isn't a chart already drawn in the container
	// This function is called and will do that
	initialDraw() {
		this.setSVG();

		// Draw slices & labels
		this.draw();

		// Add legend
		this.addOrUpdateLegend();

		// Add event listeners to slices
		this.addDataPointEventListener();
	}

	draw() {
		const dataList = this.displayData.datasets;

		const {diameter,radius} = this.computeDiameterAndRadius();

		select(this.holder).select("svg")
			.attr("width", `${diameter}px`)
			.attr("height", `${diameter}px`);

		this.innerWrap
			.style("transform", `translate(${radius}px,${radius}px)`)
			.attr("width", `${diameter}px`)
			.attr("height", `${diameter}px`)
			.attr("preserveAspectRatio", "xMinYMin");

		// Compute the correct inner & outer radius
		const { donut: donutConfigs } = Configuration;

		this.arc = arc()
			.innerRadius(radius * (2 / 3))
			.outerRadius(radius);

		this.pie = pie()
			.value((d: any) => d.value)
			.sort(null);

		// Draw the slices
		this.path = this.innerWrap.selectAll("path")
			.data(this.pie(dataList))
			.enter()
			.append("path")
			.attr("d", this.arc)
			.attr("fill", d => this.getFillScale()[d.data.label]()) // Support multiple datasets
			.attr("fill", d => (d.data.color))
			.attr("stroke", Configuration.donut.default.strokeColor)
			.attr("stroke-width", Configuration.donut.default.strokeWidth)
			.each(function (d) { this._current = d; });

		// Draw the slice labels
		const self = this;
		this.innerWrap
			.selectAll("text.chart-label")
			.data(this.pie(dataList), (d: any) => d.data.label)
			.enter()
			.append("text")
			.classed("chart-label", true)
			.attr("dy", Configuration.donut.label.dy)
			.style("text-anchor", "middle")
			.text(d => Tools.convertValueToPercentage(d.data.value, dataList))
			.attr("transform", function (d) { return self.deriveTransformString(this, d, radius); });

		// Total in the center of the donut
		this.innerWrap.append("text")
			.attr("class", "donut-figure")
			.attr("text-anchor", "middle")
			.text(0)
			.transition()
			.duration(Configuration.transitions.default.duration)
			.tween("text", function () {
				return self.donutCenterNumberTween(select(this), self.datasetStats().sum);
			});;

		// placeholder for label below the number in the center of the donut
		this.innerWrap.append("text")
			.attr("class", "donut-title")
			.attr("text-anchor", "middle")
			.attr("y", Configuration.donut.centerText.title.y)
			.text(this.options.config.chartConfig.donut.centerText.title.label);

		// Hide overlay
		this.updateOverlay().hide();
	}

	// Interpolated transitions for older data points to reflect the new data changes
	interpolateValues(newData: any) {
		const dataList = newData.datasets;

		// Apply the new data to the slices, and interpolate them
		const self = this;
		const path = this.innerWrap.selectAll("path").data(this.pie(dataList));

		// Update slices
		path
			.transition()
			.duration(0)
			.attr("stroke", Configuration.donut.default.strokeColor)
			.attr("stroke-width", Configuration.donut.default.strokeWidth)
			.transition()
			.duration(Configuration.transitions.default.duration)
			.attr("fill", d => this.getFillScale()[d.data.label]()) // Support multiple datasets
			.attr("fill", d => (d.data.color))
			.attrTween("d", function (a) {
				return arcTween.bind(this)(a, self.arc);
			});

		path.enter()
			.append("path")
			.attr("d", this.arc)
			.transition()
			.duration(0)
			.style("opacity", 0)
			.attr("stroke", Configuration.donut.default.strokeColor)
			.attr("stroke-width", Configuration.donut.default.strokeWidth)
			.transition()
			.duration(Configuration.transitions.default.duration)
			.attr("fill", d => this.getFillScale()[d.data.label]())
			.style("opacity", 1)
			.attrTween("d", function (a) {
				return arcTween.bind(this)(a, self.arc);
			});

		path
			.exit()
			.attr("d", this.arc)
			.transition()
			.duration(Configuration.transitions.default.duration)
			.style("opacity", 0)
			.remove();

		// Fade out all text labels
		this.innerWrap.selectAll("text.chart-label")
			.transition()
			.duration(Configuration.transitions.default.duration / 2)
			.style("opacity", 0)
			.on("end", function (d) {
				select(this)
					.transition()
					.duration(Configuration.transitions.default.duration / 2)
					.style("opacity", 1);
			});

		// Move text labels to their new location, and fade them in again
		const radius = this.computeDiameterAndRadius().radius;
		setTimeout(() => {
			const text = this.innerWrap.selectAll("text.chart-label")
				.data(this.pie(dataList), d => d.label);

			text
				.enter()
				.append("text")
				.classed("chart-label", true)
				.attr("dy", Configuration.donut.label.dy)
				.style("text-anchor", "middle")
				.text(d => Tools.convertValueToPercentage(d.data.value, dataList))
				.attr("transform", function (d) { return self.deriveTransformString(this, d, radius); })
				.style("opacity", 0)
				.transition()
				.duration(Configuration.transitions.default.duration / 2)
				.style("opacity", 1);

			text
				.style("text-anchor", "middle")
				.text(d => Tools.convertValueToPercentage(d.data.value, dataList))
				.attr("transform", function (d) { return self.deriveTransformString(this, d, radius); })
				.transition()
				.duration(Configuration.transitions.default.duration / 2)
				.style("opacity", 1);

			text
				.exit()
				.remove();
		}, Configuration.transitions.default.duration / 2);

		// Add slice hover actions, and clear any slice borders present
		this.addDataPointEventListener();
		this.reduceOpacity();

		// Hide the overlay
		this.updateOverlay().hide();
	}

	// TODO - Possible inherits from base-chart
	reduceOpacity(exception?: any) {
		if (exception) {
			this.innerWrap.selectAll("path").attr("fill-opacity", Configuration.charts.reduceOpacity.opacity);

			// Fade everything out except for this element
			select(exception).attr("fill-opacity", false)
				.attr("fill", (d: any) => this.getFillScale()[d.data.label]());
		}
	}
	generateTooltipHTML(label, val: string) {
		const iValue = parseInt(val.replace(/[, ]+/g, ""), 10);
		return "<ul class='list-unstyled mb-1'>" +
			"<li>" + "<div class='font-size-base my-1'>" + label + "</div>" + "</li>" +
			"<li>" + "Total: &nbsp;" + "<span class='font-weight-semibold float-right'>" + val + "</span>" + "</li>" +
			"<li>" + "Share: &nbsp;" + "<span class='font-weight-semibold float-right'>" + (100 / (this.datasetStats().sum / iValue)).toFixed(2) + "%" + "</span>" + "</li>" +
			"</ul>" +
			"<div class='d3-tip-arrow'></div>";
	}

	// TODO - Should inherit most logic from base-chart
	showTooltip(d) {
		this.resetOpacity();

		selectAll(".chart-tooltip").remove();

		const tooltip = select(this.holder).append("div")
			.attr("class", "d3-tip chart-tooltip")
			.style("top", mouse(this.holder as SVGSVGElement)[1] - Configuration.tooltip.magicTop2 + "px");

		const dVal = d.value.toLocaleString();
		const tooltipHTML = this.generateTooltipHTML(d.data.label, dVal);

		tooltip.html(tooltipHTML);
		if (mouse(this.holder as SVGSVGElement)[0] + (tooltip.node() as Element).clientWidth > this.holder.clientWidth) {
			tooltip.style(
				"left",
				mouse(this.holder as SVGSVGElement)[0] - (tooltip.node() as Element).clientWidth - Configuration.tooltip.magicLeft1 + "px"
			);
		} else {
			tooltip.style("left", mouse(this.holder as SVGSVGElement)[0] + Configuration.tooltip.magicLeft2 + "px");
		}

		tooltip.style("opacity", 0)
			.transition()
			.duration(Configuration.tooltip.fadeIn.duration)
			.style("opacity", 1);

		this.addTooltipEventListeners(tooltip);
	}

	// TODO - Refactor
	addDataPointEventListener() {
		const self = this;
		const { accessibility } = this.options;
		function transform(d) {
			d.midAngle = ((d.endAngle - d.startAngle) / 2) + d.startAngle;
			var x = Math.sin(d.midAngle) * 5;
			var y = -Math.cos(d.midAngle) * 5;
			return 'translate(' + x + ',' + y + ')';
		}
		this.innerWrap.selectAll("path")
			.on("click", function (d) {
				self.dispatchEvent("pie-slice-onClick", d);
			})
			.on("mouseover", function (d) {
				const sliceElement = select(this);
				Tools.moveToFront(sliceElement);

				sliceElement
					.transition()
					.duration(500)
					.ease(ease.easeElastic.period(0.4))
					.attr('transform', transform);
				self.showTooltip(d);
				self.reduceOpacity(this);
			})
			.on("mousemove", function (d) {
				const tooltipRef = select(self.holder).select("div.chart-tooltip");

				const relativeMousePosition = mouse(self.holder as HTMLElement);
				tooltipRef.style("left", relativeMousePosition[0] + Configuration.tooltip.magicLeft2 + "px")
					.style("top", relativeMousePosition[1] + "px");
			})
			.on("mouseout", function (d) {
				select(this)
					.transition()
					.duration(500)
					.ease(ease.easeElastic.period(0.4))
					.attr('transform', 'translate(0,0)');
				self.hideTooltip();
				self.resetOpacity();
			});
	}

	datasetStats() {
		function retVal(d) {
			return d.value;
		}
		const activeLegendItems = this.getActiveLegendItems();

		const dataset = this.displayData.datasets.filter(dataPoint => activeLegendItems.indexOf(dataPoint.label) !== -1);
		const sum = array.sum(dataset, retVal);
		const min = array.min(dataset, retVal);
		const max = array.max(dataset, retVal);
		const median = array.median(dataset, retVal);

		return { "sum": sum, "min": min, "max": max, "median": median };

	}

	update(newData?: any) {
		const oldData = Tools.clone(this.displayData);
		oldData.labels = Tools.clone(this.displayData.labels);
		oldData.datasets = Tools.clone(this.displayData.datasets);

		const activeLegendItems = this.getActiveLegendItems();

		const newDisplayData = Object.assign({}, oldData);
		newDisplayData.datasets = oldData.datasets.filter(dataPoint => activeLegendItems.indexOf(dataPoint.label) !== -1);

		newDisplayData.labels = newDisplayData.datasets.map(datum => datum.label);

		this.interpolateValues(newDisplayData);
		const self = this;
		this.innerWrap.select("text.donut-figure")
			.transition()
			.duration(Configuration.transitions.default.duration)
			.tween("text", function () {
				return self.donutCenterNumberTween(select(this), self.datasetStats().sum);
			});

		// Update center label
		this.innerWrap.select("text.donut-title")
			.text(this.options.config.chartConfig.donut.centerText.title.label);
	}

	resizeChart() {
		const { donut: donutConfigs } = Configuration;

		const {diameter,radius} = this.computeDiameterAndRadius();
		const scaleRatio = diameter / donutConfigs.maxWidth;

		// Resize the SVG
		select(this.holder).select("svg")
			.attr("width", `${diameter}px`)
			.attr("height", `${diameter}px`)
			.attr("style", "padding-left:30px");
		this.innerWrap
			.style("transform", `translate(${radius}px,${radius}px)`);

		// Resize the arc
		this.arc = arc()
			.innerRadius(this.options.type === "donut" ? (radius * (2 / 3)) : 0)
			.outerRadius(radius);

		this.innerWrap.selectAll("path")
			.attr("d", this.arc);

		const self = this;
		this.innerWrap
			.selectAll("text.chart-label")
			.attr("transform", function (d) { return self.deriveTransformString(this, d, radius); });

		// If the dimensions of the chart are smaller than a certain number (e.g. 175x175)
		// Resize the center text sizes
		if (diameter < Configuration.donut.centerText.breakpoint) {
			select(this.holder).select("svg").select("text.donut-figure")
				.style("font-size",
					Configuration.donut.centerText.numberFontSize * scaleRatio * Configuration.donut.centerText.magicScaleRatio + "px"
				);

			select(this.holder).select("svg").select("text.donut-title")
				.style("font-size", Configuration.donut.centerText.title.FontSize * scaleRatio * Configuration.donut.centerText.magicScaleRatio + "px")
				.attr("y", Configuration.donut.centerText.title.y * scaleRatio * Configuration.donut.centerText.magicScaleRatio);
		}

		// Reposition the legend
		this.positionLegend();
	}

	// Helper functions
	private computeDiameterAndRadius() {
		const chartSize: any = this.getChartSize(this.container);
		const radius: number = Math.min(chartSize.width - 30, chartSize.height - 30) / 2.5;
		const diameter: number = Math.min(chartSize.width - 30, chartSize.height - 30) ;
		return {diameter, radius};
	}

	donutCenterNumberTween(d3Ref, newNumber: number) {
		// Remove commas from the current value string, and convert to an int
		const currentValue = parseInt(d3Ref.text().replace(/[, ]+/g, ""), 10);
		const i = interpolateNumber(currentValue, newNumber);

		const formatInterpolatedValue = number => Math.floor(number).toLocaleString();
		return t => {
			d3Ref.text(formatInterpolatedValue(i(t)));
		};
	}
	/**
	 * Return the css transform string to be used for the slice
	 *
	 * @private
	 * @param {any} d - d3 data item for slice
	 * @param {any} radius - computed radius of the chart
	 * @returns final transform string to be applied to the <text> element
	 * @memberof DonutChart
	 */
	private deriveTransformString(element, d, radius) {
		const textLength = element.getComputedTextLength();
		const textOffsetX = textLength / 2;
		const textOffsetY = parseFloat(getComputedStyle(element).fontSize) / 2;

		const marginedRadius = radius + Configuration.donut.label.margin;

		const theta = ((d.endAngle - d.startAngle) / 2) + d.startAngle;
		const xPosition = (textOffsetX + marginedRadius) * Math.sin(theta);
		const yPosition = (textOffsetY + marginedRadius) * -Math.cos(theta);

		return `translate(${xPosition}, ${yPosition})`;
	}
}

// d3 Tween functions
function arcTween(a, arcFunc) {
	const i = interpolate(this._current, a);

	return t => {
		this._current = i(t);

		return arcFunc(this._current);
	};
}
