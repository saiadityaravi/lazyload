import { Component, OnInit, ViewEncapsulation } from '@angular/core';
//jquery declaration
declare var jQuery: any;
import 'rxjs/add/operator/map';
import '../../../../assets/js/jquery.min.js';
import '../../../../assets/js/jquery.vmap.min.js';
import '../../../../assets/js/jquery.vmap.usa.js';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SharedService } from '../../../shared/services/shared.service';
import { UrlconstantsService } from '../../../shared/services/urlconstants.service';
import { ToastrService } from 'ngx-toastr';
import { MembersByStateByStatus } from '../../../shared/models/memberBySatetByStatus.model';
import { UserStats } from '../../../shared/models/userStats.model';
import { ConnectorService } from '../../services/connector.data.service';
import { PieChartConfig } from '../../../shared/charts/pie/pie.chart.config'
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [ConnectorService],
  encapsulation: ViewEncapsulation.None
})
export class ConnectorDashboardComponent implements OnInit {
  theme = 'profilepagetheme';
  higLevelStatsForm: FormGroup;
  statsMemberByStateByStatusForm: FormGroup;
  urlConstants: any;
  membersByStatusList: Array<MembersByStateByStatus> = [];
  userStatsList: Array<UserStats> = [];

  assigned: number;
  eligible: number;
  noteligible: number;
  pending: number;
  memberStatsByState: any[] = [];
  pins: any[] = [];
  message: any;

  public pieChartConfig: PieChartConfig;

  constructor(private toastr: ToastrService, private svcConnector: ConnectorService, private urlConstantService: UrlconstantsService, private fb: FormBuilder, public messageService: SharedService) {
    this.urlConstants = this.urlConstantService.getUrls();
    this.createDashboard('All');
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    var self = this;
    // Interactive map using JQuery Vector Map (JQV Map)
    jQuery('#vmap').vectorMap({
      map: 'usa_en',
      backgroundColor: '#ffffff',
      color: '#526069',
      hoverOpacity: 0.7,
      selectedColor: '#666666',
      enableZoom: true,
      showTooltip: true,
      normalizeFunction: 'polynomial',
      onRegionClick: function (element, code, region) {
        if (!('ontouchstart' in window || 'onmsgesturechange' in window || navigator.msMaxTouchPoints > 0)) {
          if (self.memberStatsByState[code]) {
            self.pieChartConfig = new PieChartConfig();
            self.pieChartConfig = {
              "config": { width: 400, height: 400 },
              "data": self.memberStatsByState[code].map(data => {
                var _color;
                switch (data.status) {
                  case "Pending": _color = "#EF5350"; break;
                  case "Eligible": _color = "#66BB6A"; break;
                  case "Not Eligible": _color = "#29B6F6"; break;
                }
                return {
                  category: data.status, value: data.count, color: _color
                };
              })
            };
          } else {
            self.pieChartConfig = new PieChartConfig();
            self.pieChartConfig = {
              "config": {},
              "data": null
            }
          }
        }
      },
      onRegionOver: function (element, code, region) {
        if (('ontouchstart' in window || 'onmsgesturechange' in window || navigator.msMaxTouchPoints > 0)) {

        }
      }
    });
  }
  getMembershipStats() {
    const alias = sessionStorage.getItem('alias')
    const url = this.urlConstants.getMemberStatsByUser.replace("{alias}", alias)
    this.svcConnector.getMembershipStats(url).subscribe(memberStats => {
      if (memberStats) {
        this.membersByStatusList = memberStats;
        this.eligible = memberStats.filter(mbr => mbr.status === "Eligible")[0].count;
        this.pending = memberStats.filter(mbr => mbr.status === "Pending")[0].count;
        this.noteligible = memberStats.filter(mbr => mbr.status === "Not Eligible")[0].count;
        this.assigned = this.eligible + this.pending + this.noteligible;
        var list = document.getElementsByClassName('loading');
            while (list.length > 0) {
              list[0].classList.add('loading-complete');
              list[0].classList.remove('loading');
            }
      }
    }, (error) => {
      this.toastr.warning('Oops!! Something went wrong with map  data, please refersh the card to reload')
    });
  }

  getMembershipStatsByState() {
    const alias = sessionStorage.getItem('alias')
    const url = this.urlConstants.getMemberStatsByUserByStateByStatus.replace("{alias}", alias)
    this.svcConnector.getMembershipStatsByState(url).subscribe(memberStats => {
      if (memberStats) {
        this.membersByStatusList = memberStats;
        this.memberStatsByState = memberStats.reduce(function (grouped, item) {
          var key = item["state"].toLowerCase();
          grouped[key] = grouped[key] || [];
          grouped[key].push(item);
          return grouped;
        }, {});

        let pins = new Object();
        for (var state in this.memberStatsByState) {
          var pin = document.createElement('span');
          pin.className = "badge bg-c-pink pulse";
          pins[state] = pin.outerHTML;
        }
        jQuery('#vmap').vectorMap('placePins', pins, 'content');
      }
    }, (error) => {
      this.toastr.warning('Oops!! Something went wrong with map  data, please refersh the card to reload')
    });
  }
  createDashboard(widget: string) {

    switch (widget) {
      case 'All':
        this.getMembershipStats();
        this.getMembershipStatsByState();
        break;
      case 'MemberByStateByStatus':
        this.getMembershipStatsByState();
        break;
    }
  }
  escapeXml(string): string {
    return string.replace(/[<>]/g, function (c) {
      switch (c) {
        case '<': return '\u003c';
        case '>': return '\u003e';
      }
    });
  }
}
