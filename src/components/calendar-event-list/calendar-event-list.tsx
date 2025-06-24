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
        height: "auto",
        initialView: isMobile() ? "listYear" : "dayGridMonth",
        eventClick: function (info) {
          info.jsEvent.preventDefault();
          window.open(info.event.url, "_blank");
        },
        eventContent: function(arg) {
          return {
            html: `
            <div class="${isMobile() ? "" : "hidden"}">


        <div
          class="flex gap-x-2 items-center border-b border-gray-200 py-2"
        >
          <img
            class="rounded object-cover w-12"
            src="${arg.event.extendedProps.thumbnail}"
            alt="${arg.event.extendedProps.title}"
          />

          <div class="flex flex-col gap-x-1">
            <div class="text-md text-blue-800 font-bold hover:cursor-pointer">
              <a href="${arg.event.url}" target="_blank">
                ${arg.event.extendedProps.title}
              </a>
            </div>
            <div class="text-md text-gray-500">
              <a href="${arg.event.url}" target="_blank">
                ${arg.event.extendedProps.starts_at_time}
              </a>
            </div>
          </div>
        </div>




            </div>
              <div class="${isMobile() ? "hidden" : ""} flex w-full justify-between" style="background: transparent !important;">
                <div class="flex flex-col">
                  <div class="font-bold">
                    ${arg.event.extendedProps.starts_at_time}
                  </div>
    
                  <div class="text-xs whitespace-normal">
                    ${arg.event.extendedProps.title}
                  </div>
                </div>
                <div class="flex flex-col ml-2 flex-none">
                  <img src="${arg.event.extendedProps.thumbnail}" class="w-12 float-right">
                </div>
              </div>
            `
          };
        },
      
              events: this.events.flatMap((event) =>
          getUniqueShowtimes(event.variants).map((variant) => {
            return {
              extendedProps: {
                start_time: variant.startsAt,
                title: event.title,
                thumbnail: event.thumbnail,
                handle: event.handle,
                starts_at_time: variant.starts_at_time,
              },
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
