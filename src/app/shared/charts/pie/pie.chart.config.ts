import * as baseConfig from "../base.chart.config";
export * from "../base.chart.config";
export const pie = {
	maxWidth: 516.6,
	radius: 400,
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
export const _config: any = Object.assign({}, pie, baseConfig.transitions,baseConfig.tooltip,baseConfig.legend,baseConfig.charts);

export class PieChartConfig { 
	config:  {width ?:number,height?:number, chartConfig?: typeof _config}
    data: Array<{ category: string, value: number, color : string }>
   }


