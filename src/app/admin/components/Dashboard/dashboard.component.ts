import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort} from '@angular/material';
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
import { UserStats } from '../../../shared/models/userStats.model';
import { AdminService } from '../services/admin.data.service';
import { PieChartConfig } from '../../../shared/charts/pie/pie.chart.config'
import { DonutChartConfig } from '../../../shared/charts/donut/donut.chart.config'
import { Options } from 'fullcalendar';
import { CalendarComponent } from 'ng-fullcalendar';
import { MediaQueriesModule } from '@angular/flex-layout';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [AdminService],
  encapsulation: ViewEncapsulation.None
})


// Admin - Dashboard Component
export class AdminDashboardComponent implements OnInit {
  theme = 'profilepagetheme';
  urlConstants: any;
  membersByStateByStatusList: any[] = [];
  membersByStateByRiskStatusList: any[] = [];
  userStatsList: Array<UserStats> = [];
  memberData: any[] = [];
  phonepals: number;
  connectors: number;
  casemanagers: number;
  con_active: number;
  con_inactive: number;
  con_pending: number;
  pp_active: number;
  pp_inactive: number;
  pp_pending: number;
  eligible: number;
  noteligible: number;
  pending: number;
  members: number;
  pins: Object;
  message: any;
  memberStats: memberStatsHeader[];
  dataSource: MatTableDataSource<memberStatsHeader> = new MatTableDataSource<memberStatsHeader>(this.memberStats);
  displayedColumns: string[] = ['State', 'Eligible', 'NotEligible', 'Pending', 'Total'];

  public pieChartConfig: PieChartConfig;
  public donutChartConfig: DonutChartConfig;
  calendarOptions: Options;

  @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private toastr: ToastrService, private svcAdmin: AdminService, private urlConstantService: UrlconstantsService, private fb: FormBuilder, public messageService: SharedService) {
    this.urlConstants = this.urlConstantService.getUrls();
    this.getDashboardData('All');
  }

  // Initialize component as well as calendar
  ngOnInit() {
    this.calendarOptions = {
      editable: true,
      eventLimit: false,
      height: 300,
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaDay,listMonth'
      },
      events: [{ title: 'Long Event', start: '2019-02-07', end: '2019-02-07' }]
    };
  }

  // Lifecycle hook that is called after Angular has fully initialized a component's view
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
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
          if (self.membersByStateByRiskStatusList[code]) {
            self.pieChartConfig = new PieChartConfig();
            self.pieChartConfig = {
              "config": { width: 200, height: 200 },
              "data": self.membersByStateByRiskStatusList[code].map(data => {
                var _color;
                var _status;
                switch (data.status) {
                  case "H": _color = "#EF5350"; _status = "High"; break;
                  case "M": _color = "#66BB6A"; _status = "Medium"; break;
                  case "L": _color = "#29B6F6"; _status = "Low"; break;
                  case "": _color = "#ee538b"; _status = "-"; break;
                }
                return {
                  category: _status, value: data.count, color: _color
                };
              })
            }
          } else {
            self.pieChartConfig = new PieChartConfig();
            self.pieChartConfig = {
              "config": {},
              "data": null
            }
          }
          if (self.membersByStateByStatusList[code]) {
            const state = code.toUpperCase();
            self.donutChartConfig = new DonutChartConfig();

            self.donutChartConfig = {
              "config": { width: 200, height: 200, chartConfig: { donut: { centerText: { title: { label: `members in ${state}` } } } } },
              "data": self.membersByStateByStatusList[code].map(data => {
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
            self.donutChartConfig = new DonutChartConfig();
            self.donutChartConfig = {
              "config": {},
              "data": null
            }
          }
        }
      },
      onRegionOver: function (element, code, region) {
        if (self.membersByStateByStatusList[code]) {
          document.getElementById("jqvmap1_" + code).setAttribute("cursor", "pointer;");
        } else {
          document.getElementById("jqvmap1_" + code).setAttribute("cursor", "not-allowed;");
        }
      },
      onResize: function (element, width, height) {
        jQuery('#vmap').vectorMap('removePins');
        jQuery('#vmap').vectorMap('placePins', self.pins, 'content');
      }
    });
  }

  /**
    * Function to display statistics data
    * 
    * @param widget - Parameter Values (All / MemberByStateByStatus) - to retrieve user statistics data
    */
  getDashboardData(widget: string) {
    let url = "";
    switch (widget) {
      case 'All':
        this.svcAdmin.getSystemUserStatistics(this.urlConstants.getApplicationUserStats).subscribe(data => {
          if (data) {
            this.phonepals = data.filter(usr => usr.roleDesc === "phonepal")[0].count;
            this.connectors = data.filter(usr => usr.roleDesc === "connector")[0].count;
            this.casemanagers = data.filter(usr => usr.roleDesc === "casemanager")[0].count;
            var list = document.getElementsByClassName('loading');
            while (list.length > 0) {
              list[0].classList.add('loading-complete');
              list[0].classList.remove('loading');
            }
          }
        }, (error) => {
          this.toastr.warning('Oops!! Something went wrong with highlevel statistics data, please refersh the card page reload')
        });

        this.svcAdmin.getPhonepalByStatus(this.urlConstants.getPhonepalStatsbyStatus).subscribe(data => {
          if (data) {
            this.pp_active = data.filter(ms => ms.status === "Approved")[0] ? data.filter(ms => ms.status === "Approved")[0].count : 0;
            this.pp_pending = data.filter(ms => ms.status === "Pending")[0] ? data.filter(ms => ms.status === "Pending")[0].count : 0;
            this.pp_inactive = data.filter(ms => ms.status != "Approved" && ms.status != "Pending")[0] ? data.filter(ms => ms.status != "Approved" && ms.status != "Pending")[0].count : 0;
            var list = document.getElementsByClassName('loading-14');
            while (list.length > 0) {
              list[0].classList.add('loading-complete');
              list[0].classList.remove('loading-14');
            }
          }
        }, (error) => {
          this.toastr.warning('Oops!! Something went in fetching phonepal statistics, please refersh the card to reload')
        });

        this.svcAdmin.getConnectorByStatus(this.urlConstants.getConnectorStatsbyStatus).subscribe(data => {
          if (data) {
            this.con_active = data.filter(ms => ms.status === "Approved")[0] ? data.filter(ms => ms.status === "Approved")[0].count : 0;
            this.con_pending = data.filter(ms => ms.status === "Pending")[0] ? data.filter(ms => ms.status === "Pending")[0].count : 0;
            this.con_inactive = data.filter(ms => ms.status != "Approved" && ms.status != "Pending")[0] ? data.filter(ms => ms.status != "Approved" && ms.status != "Pending")[0].count : 0;
            var list = document.getElementsByClassName('loading-14');
            while (list.length > 0) {
              list[0].classList.add('loading-complete');
              list[0].classList.remove('loading-14');
            }
          }
        }, (error) => {
          this.toastr.warning('Oops!! Something went in fetching connector statistics, please refersh the card to reload')
        });

        this.svcAdmin.getMemberByStatus(this.urlConstants.getMemberStatsByStatus).subscribe(data => {
          if (data) {
            this.eligible = data.filter(ms => ms.status === "Eligible")[0].count;
            this.pending = data.filter(ms => ms.status === "Pending")[0].count;
            this.noteligible = data.filter(ms => ms.status === "Not Eligible")[0].count;
            var list = document.getElementsByClassName('loading-14');
            while (list.length > 0) {
              list[0].classList.add('loading-complete');
              list[0].classList.remove('loading-14');
            }
          }
        }, (error) => {
          this.toastr.warning('Oops!! Something went wrong in fetching member statistics, please refersh the card to reload')
        });

        this.svcAdmin.getMemberByStateByStatusStatistics(this.urlConstants.getAllMemberStatsByStateByStatus).subscribe(data => {
          if (data) {
            this.membersByStateByStatusList = data.filter(ms => ms != null).reduce(function (grouped, item) {
              var key = item["state"].toLowerCase();
              grouped[key] = grouped[key] || [];
              grouped[key].push(item);
              return grouped;
            }, {});

            let pins = new Object();
            for (var st in this.membersByStateByStatusList) {
              var pin = document.createElement('span');
              pin.className = "badge bg-c-pink pulse";
              pins[st] = pin.outerHTML;
              this.memberData.push({
                state: st,
                eligible: data.filter(d => d.state === st.toUpperCase() && d.status === "Eligible")[0] ? data.filter(d => d.state === st.toUpperCase() && d.status === "Eligible")[0].count : 0,
                notEligible: data.filter(d => d.state === st.toUpperCase() && d.status === "Not Eligible")[0] ? data.filter(d => d.state === st.toUpperCase() && d.status === "Not Eligible")[0].count : 0,
                pending: data.filter(d => d.state === st.toUpperCase() && d.status === "Pending")[0] ? data.filter(d => d.state === st.toUpperCase() && d.status === "Pending")[0].count : 0,
                total: data.filter(d => d.state === st.toUpperCase()).reduce((a, b) => a + b.count, 0)
              })
            }
            this.pins = pins;
            this.dataSource.data = this.memberData;
            jQuery('#vmap').vectorMap('placePins', this.pins, 'content');
          }
        }, (error) => {
          this.toastr.warning('Oops!! Something went wrong with map  data, please refersh the card to reload')
        });

        this.svcAdmin.getMemberByStateByRiskStatus(this.urlConstants.getMemberStatsByStateByRisk).subscribe(data => {
          if (data) {
            this.membersByStateByRiskStatusList = data.filter(ms => ms != null).reduce(function (grouped, item) {
              var key = item["state"].toLowerCase();
              grouped[key] = grouped[key] || [];
              grouped[key].push(item);
              return grouped;
            }, {});
          }
        }, (error) => {
          this.toastr.warning('Oops!! Something went wrong with map  data, please refersh the card to reload')
        });

        this.svcAdmin.getConnectorMemberCountStats(this.urlConstants.getConnectorMemberCountStats).subscribe(data => {
          if (data) {
            this.membersByStateByRiskStatusList = data.filter(ms => ms != null).reduce(function (grouped, item) {
              var key = item["user"].toLowerCase();
              grouped[key] = grouped[key] || [];
              grouped[key].push(item);
              return grouped;
            }, {});
          }
        }, (error) => {
          this.toastr.warning('Oops!! Something went wrong with map  data, please refersh the card to reload')
        });

        /*this.svcAdmin.getPhonePalGrowthStatistics(this.urlConstants.getPhonepalGrowthStats).subscribe(phonpalStats => {
          if (phonpalStats) {
          }
        }, (error) => {
          this.toastr.warning('Oops!! Something went wrong with phonepal statistics data, please refersh the card to reload')
        });*/
        break;
      case 'MemberByStateByStatus':
        this.svcAdmin.getMemberByStateByStatusStatistics(this.urlConstants.getAllMemberStatsByStateByStatus).subscribe(data => {

        }, (error) => {
          this.toastr.warning('Oops!! Something went wrong with phonepal statistics data, please refersh the card to reload')
        })
        break;
    }
  }

  /**
    * Function to check whether an object is empty or not
    * 
    * @param obj - Object to be checked
    */
  isEmptyObject(obj) {
    return (obj && (Object.keys(obj).length === 0));
  }
}
export interface memberStatsHeader {
  state: string,
  eligible: number,
  notEligible: number,
  pending: number,
  total: number
}
