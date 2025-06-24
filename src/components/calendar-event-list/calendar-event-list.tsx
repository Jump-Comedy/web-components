import { Component, h, Prop, Element } from "@stencil/core";
import { isMobile } from "is-mobile";
import getUniqueShowtimes from "../../utils/get-unique-showtimes";

@Component({
  tag: "calendar-event-list",
  styleUrl: "./calendar-event-list.css",
  shadow: true,
})
export class CalendarEventList {
  @Prop() events: any[];
  @Prop() config: any;
  @Prop() domain: string;

  @Element() el: HTMLElement;

  componentDidLoad() {
    const shadowRoot = this.el.shadowRoot;

    const loadScript = (src: string) => {
      return new Promise<void>((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve();
        this.el.shadowRoot.appendChild(script);
      });
    };

    Promise.all([
      loadScript(
        "https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/index.global.min.js",
      ),
      loadScript(
        "https://cdn.jsdelivr.net/npm/@fullcalendar/list@6.1.15/index.global.min.js",
      ),
    ]).then(() => {
      const calendarEl = shadowRoot.getElementById("calendar");
      // @ts-ignore
      const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: isMobile() ? "listYear" : "dayGridMonth",
        eventClick: function (info) {
          console.log("info is ", info);
          window.open(info.url);
          console.log("opened it");

          // change the border color just for fun
          info.el.style.borderColor = "red";
        },
        events: this.events.flatMap((event) =>
          getUniqueShowtimes(event.variants).map((variant) => {
            return {
              title: event.title,
              start: variant.startsAt,
              color: "#3788d8",
              url: `${this.domain.startsWith("https://") ? "" : "https://"}${this.domain}/e/${event.handle}`,
            };
          }),
        ),
      });
      calendar.render();
    });
  }

  render() {
    return <div id="calendar"></div>;
  }
}
