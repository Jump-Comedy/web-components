import { Component, h, Prop, Element } from "@stencil/core";
import { isMobile } from "is-mobile";
import getUniqueShowtimes from "../../utils/get-unique-showtimes";
import { formatDate } from "@jumpcomedy/utils";

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
        eventContent: function (event) {
          return {
            html: `

<div class="lg:hidden">
        <div
          class="flex gap-x-2 items-center border-b border-gray-200 py-2"
        >
          <img
            class="rounded object-cover"
            src={event.thumbnail}
            alt={event.title}
            width={50}
            height={50}
          />

          <div class="flex flex-col gap-x-1">
            <div class="text-md text-blue-800 font-bold hover:cursor-pointer">
              <a href={event.url} target={"_blank"}>
                {event.title}
              </a>
            </div>
            <div class="text-md text-gray-500">
              <a href={event.url} target={"_blank"}>
                {formatDate(event.start)}
              </a>
            </div>
          </div>
        </div>
      </div>



          <div class="hidden lg:block flex w-full justify-between" style="background: transparent !important;">
            <div class="flex flex-col">
              <div class="text-xs lg:text-sm font-bold">
                ${formatDate(event.start)}
              </div>

              <div class="text-xs whitespace-normal">
                ${event.title}
              </div>
            </div>
            <div class="flex flex-col ml-2 flex-none lg:block hidden">
              <img src="${event.thumbnail}" class="w-8 float-right">
            </div>
            <a href={event.url} target='_blank' class="absolute inset-0">
                <span class="sr-only">Click to view details</span>
              </a>
          </div>
        `,
          };
        },
        events: this.events.flatMap((event) =>
          getUniqueShowtimes(event.variants).map((variant) => {
            return {
              title: event.title,
              start: variant.startsAt,
              color: "#3788d8",
              url: event.external_order_url
                ? event.external_order_url
                : `${this.domain.startsWith("https://") ? "" : "https://"}${this.domain}/e/${event.handle}`,
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
