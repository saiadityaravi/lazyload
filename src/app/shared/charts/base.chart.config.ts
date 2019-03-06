const baseOptions: any = {
	legendClickable: true,
	containerResizable: true,
	type: "basic",
	colors: [
		"#00a68f",
		"#3b1a40",
		"#473793",
		"#3c6df0",
		"#56D2BB"
	],
	tooltip: {
		formatter: null
	},
	loadingOverlay: {
		innerHTML: `
		<div class="loading-overlay-content">
		  <div data-loading class="bx--loading bx--loading--small">
			<svg class="bx--loading__svg" viewBox="-75 -75 150 150">
				<title>Loading</title>
				<circle cx="0" cy="0" r="37.5" />
			</svg>
		  </div>

		  <p>Loading</p>
		</div>
		`
	}
};

const axisOptions: any = Object.assign({}, baseOptions, {
	series: [],
	scales: {
		x: {
			domain: null,
			ticks: 5
		},
		y: {
			domain: null,
			ticks: 5
		},
		ySecondary: {
			domain: null,
			ticks: 10
		}
	},
	// Only used for line chart
	points: {
		radius: null
	}
});

export const options = {
	BASE: baseOptions,
	AXIS: axisOptions
};

export const charts = {
	width: 150,
	height:150,
	margin: {
		top: 20,
		bottom: 60,
		left: 60,
		right: 20,
		bar: {
			top: 0,
			right: -40,
			bottom: 50,
			left: 40
		},
		line: {
			top: 0,
			right: -40,
			bottom: 50,
			left: 40
		}
	},
	resetOpacity: {
		opacity: 1,
		circle: {
			fill: "white"
		},
		outline: "grey"
	},
	reduceOpacity: {
		opacity: 0.25,
		outline: "grey"
	},
	points: {
		radius: 4
	},
	patternFills: {
		width: 20,
		height: 20
	},
	minWidth: 150,
	widthBreak: 600,
	marginForLegendTop: 40,
	magicRatio: 0.7,
	magicMoreForY2Axis: 70,
	axisCharts: {
		minWidth: 100,
		minHeight: 200
	}
};

export const legend = {
	countBreak: 4,
	fontSize: 12,
	wrapperHeight: "40px",
	widthTolerance: 15,
	hoverShadowSize: "3px",
	hoverShadowTransparency: 0.2,
	margin: {
		top: 19
	},
	active: {
		borderColor: false,
		borderStyle: false,
		borderWidth: false
	},
	inactive: {
		backgroundColor: "white",
		borderStyle: "solid",
		borderWidth: "2px"
	},
	items: {
		status: {
			ACTIVE: 1,
			DISABLED: 0
		},
	},
	basedOn: {
		SERIES: "series",
		LABELS: "labels"
	}
};

export const tooltip = {
	width: 200,
	arrowWidth: 10,
	magicXPoint2: 20,
	magicTop1: 21,
	magicTop2: 22,
	magicLeft1: 11,
	magicLeft2: 12,
	fadeIn: {
		duration: 250
	},
	fadeOut: {
		duration: 250
	},
	size: {
		COMPACT: "compact"
	}
};

export const transitions = {
	default: {
		duration: 750
	}
};

export const selectors = {
	OUTERSVG: "svg.chart-svg",
	INNERWRAP: "g.inner-wrap",
	CHARTWRAPPER: "div.chart-wrapper",
	TOOLTIP: "div.chart-tooltip",
	LEGEND_BTN: "li.legend-btn",
	pie: {
		SLICE: "path"
	}
};
