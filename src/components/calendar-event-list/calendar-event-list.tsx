import { Component, h, Prop, Element } from "@stencil/core";

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

    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/index.global.min.js";
    script.onload = () => {
      // Initialize calendar
      const calendarEl = shadowRoot.getElementById("calendar");
      // @ts-ignore
      const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "dayGridMonth",
        eventClick: function (info) {
          window.location = info.url;

          // change the border color just for fun
          info.el.style.borderColor = "red";
        },
        events: this.events.flatMap((event) =>
          event.variants.map((variant) => {
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
    };
    this.el.shadowRoot.appendChild(script);
  }

  render() {
    return <div id="calendar"></div>;
  }
}
