import * as baseConfig from "../base.chart.config";
export * from "../base.chart.config";
export const donut = {
	centerText: {
		title: {
			y: 22,
			FontSize: 15,
			label:""
		},
		breakpoint: 175,
		magicScaleRatio: 2.5,
		numberFontSize: 24,
	},
	maxWidth: 516.6,
	mouseover: {
		strokeWidth: 5,
		strokeOpacity: 0.5
	},
	mouseout: {
		strokeWidth: 0,
		strokeOpacity: 1
	},
	sliceLimit: 6,
	label: {
		dy: ".32em",
		margin: 8,
		other: "Other"
	},
	default: {
		strokeWidth: "3px",
		strokeColor: "#FFFFFF"
	}
};
export const _config: any = Object.assign({}, donut, baseConfig.transitions,baseConfig.tooltip,baseConfig.legend,baseConfig.charts);

export class DonutChartConfig { 
	config:  {width ?:number,height?:number, chartConfig?: typeof _config}
    data: Array<{ category: string, value: number, color : string }>
   }


