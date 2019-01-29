import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit
} from "@angular/core";
import { Router } from "@angular/router";
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from "date-fns";
import { Subject } from "rxjs";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView
} from "angular-calendar";

import { AppService } from "./../app.service";

const colors: any = {
  red: {
    primary: "#ad2121",
    secondary: "#FAE3E3"
  },
  blue: {
    primary: "#1e90ff",
    secondary: "#D1E8FF"
  },
  yellow: {
    primary: "#e3bc08",
    secondary: "#FDF1BA"
  }
};

@Component({
  selector: "app-user-dashboard",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./user-dashboard.component.html",
  styleUrls: ["./user-dashboard.component.css"]
})
export class UserDashboardComponent implements OnInit {
  @ViewChild("modalContent")
  modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent("Edited", event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent("Deleted", event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [];

  activeDayIsOpen: boolean = true;

  constructor(
    private modal: NgbModal,
    private router: Router,
    private appService: AppService
  ) {}

  ngOnInit() {
    this.appService
      .getAllMeetings({ userId: localStorage.getItem("userId") })
      .subscribe(apiResponse => {
        console.log(apiResponse);
        if (apiResponse.status === 200) {
          let meetings = apiResponse.data.map(meeting => {
            return {
              ...meeting,
              start: new Date(meeting.start),
              end: new Date(meeting.end)
            };
          });
          this.events = [...this.events, ...meetings];
          this.refresh.next();
          this.dayClicked({ date: new Date(), events: this.events });
        }
      });
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    console.log(date, events);

    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent("Dropped or resized", event);
    this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: "lg" });
  }

  addEvent(): void {
    this.events.push({
      title: "New event",
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      color: colors.red,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    });
    this.refresh.next();
  }
}
