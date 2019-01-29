import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Location } from "@angular/common";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute } from "@angular/router";
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
import * as moment from "moment";
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView
} from "angular-calendar";

import { AppService } from "./../app.service";
import { log } from "util";

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
  selector: "admin-user-calender",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ["admin-user-calender.component.css"],
  templateUrl: "admin-user-calender.component.html"
})
export class AdminUserCalenderComponent implements OnInit {
  private userId: String;
  private meetingId: String;
  @ViewChild("modalContent")
  modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  public meetingForm: FormGroup;
  public meetingEditForm: FormGroup;

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  refresh: Subject<any> = new Subject();
  dayevents: CalendarEvent[];
  events: any[] = [];

  activeDayIsOpen: boolean = true;

  constructor(
    private modal: NgbModal,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private appService: AppService,
    private location: Location
  ) {}

  fetchAllMeetins: any = () => {
    this.appService
      .getAllMeetings({ userId: this.userId })
      .subscribe(apiResponse => {
        console.log(apiResponse);
        if (apiResponse.status === 200) {
          this.events = apiResponse.data.map(meeting => {
            return {
              ...meeting,
              start: moment.utc(meeting.start),
              end: moment.utc(meeting.end)
            };
          });
          this.dayevents = this.events;
          this.refresh.next();
          this.dayClicked({ date: new Date(), events: this.events });
        }
      });
  };
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get("userId");
    });

    this.fetchAllMeetins();

    //login form value initialized
    this.meetingForm = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [
        Validators.required,
        Validators.minLength(8)
      ]),
      primaryColor: new FormControl(null, [Validators.required]),
      secondaryColor: new FormControl(null, [Validators.required]),
      startAt: new FormControl(null, [Validators.required]),
      endAt: new FormControl(null, [Validators.required])
    });
    this.meetingForm.setValue({
      title: "",
      description: "",
      primaryColor: "",
      secondaryColor: "",
      startAt: "",
      endAt: ""
    });

    this.meetingEditForm = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [
        Validators.required,
        Validators.minLength(8)
      ]),
      primaryColor: new FormControl(null, [Validators.required]),
      secondaryColor: new FormControl(null, [Validators.required]),
      startAt: new FormControl(null, [Validators.required]),
      endAt: new FormControl(null, [Validators.required])
    });
    this.meetingEditForm.setValue({
      title: "",
      description: "",
      primaryColor: "",
      secondaryColor: "",
      startAt: "",
      endAt: ""
    });
  }

  dayClicked({ date, events }: { date: Date; events: any[] }): void {
    console.log(date, events);
    this.dayevents = events;

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

  openVerticallyCentered(content) {
    this.modal.open(content, { centered: true, size: "lg" });
  }

  //edit modal event
  openEditModal(event) {
    this.meetingId = event.meetingId;
    console.log(moment.utc(event.start).format());

    this.meetingEditForm.setValue({
      title: event.title,
      description: event.description ? event.description : "",
      primaryColor: event.color.primary,
      secondaryColor: event.color.secondary,
      startAt: event.start ? moment.utc(event.start).format() : "",
      endAt: event.end ? moment.utc(event.end).format() : ""
    });

    // this.modal.open(content, { centered: true, size: "lg" });
  }

  addEvent(): void {
    // this.events.push({
    //   title: "New event",
    //   start: startOfDay(moment.utc()),
    //   end: endOfDay(moment.utc()),
    //   color: colors.red,
    //   draggable: true,
    //   resizable: {
    //     beforeStart: true,
    //     afterEnd: true
    //   }
    // });
    this.refresh.next();
  }

  onSubmit() {
    if (this.meetingForm.valid) {
      if (
        moment.utc(this.meetingForm.value.startAt) >
        moment.utc(this.meetingForm.value.endAt)
      ) {
        this.toastr.warning(
          "starting time should be greater than the ending time"
        );
      } else {
        let meetingData = {
          ...this.meetingForm.value,
          startAt: moment.utc(this.meetingForm.value.startAt),
          endAt: moment.utc(this.meetingForm.value.endAt),
          assignedTo: this.userId
        };
        this.appService.addMeeting(meetingData).subscribe(apiResponse => {
          if (apiResponse.status === 200) {
            this.toastr.success(apiResponse.message);
            this.fetchAllMeetins();
          } else {
            this.toastr.error(apiResponse.message);
          }
        });
        this.meetingForm.reset();
      }
    } else {
      this.toastr.warning("please fill all the mandatory fields!");
    }
  }

  onEdit() {
    if (this.meetingEditForm.valid) {
      if (
        moment.utc(this.meetingEditForm.value.startAt) >
        moment.utc(this.meetingEditForm.value.endAt)
      ) {
        this.toastr.warning(
          "starting time should be greater than the ending time"
        );
      } else {
        this.appService
          .editMeeting({
            ...this.meetingEditForm.value,
            startAt: moment.utc(this.meetingEditForm.value.startAt),
            endAt: moment.utc(this.meetingEditForm.value.endAt),
            meetingId: this.meetingId
          })
          .subscribe(apiResponse => {
            if (apiResponse.status === 200) {
              this.toastr.success(apiResponse.message);
              this.fetchAllMeetins();
            } else {
              this.toastr.error(apiResponse.message);
            }
          });
      }
    } else {
      this.toastr.warning("please fill all the mandatory fields!");
    }
  }

  deleteMeetingInit(meetingId) {
    this.meetingId = meetingId;
    console.log(meetingId);
  }

  deleteMeeting() {
    this.appService
      .deleteMeeting({ meetingId: this.meetingId })
      .subscribe(apiResponse => {
        if (apiResponse.status === 200) {
          this.toastr.success("successfully unscheduled the meeting!");
          this.fetchAllMeetins();
        } else {
          this.toastr.warning("unable to unschedule the meeting!");
        }
      });
    this.meetingId = null;
  }
}
