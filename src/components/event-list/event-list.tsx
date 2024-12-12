import { Component, h, Prop, State, Env } from "@stencil/core";
import { formatDate } from "@jumpcomedy/utils/dist";
@Component({
  tag: "event-list",
  styleUrl: "./event-list.css",
  shadow: true,
  formAssociated: true,
})
export class EventWidget {
  @State()
  events: any[];

  @Prop() brandId;

  @Prop() widgetBgColor = "#10C391";
  @Prop() mainBgColor = "#C31042";
  @Prop() showtimeBgColor = "#1042C3";
  @Prop() showtimeTextColor = "#ffffff";
  @Prop() eventTitleColor = "#ffffff";
  @Prop() venueNameTextColor = "#eeeeee";
  @Prop() venueAddressTextColor = "#eeeeee";
  @Prop() buyLinkBgColor = "#000000";
  @Prop() buyLinkTextColor = "#ffffff";

  @Prop() domain = "https://www.jumpcomedy.com";

  connectedCallback() {
    fetch(
      `${Env.AMPLIFY_BASE_URL}/store/events?` +
        new URLSearchParams({
          brand_id: this.brandId,
        }),
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    ).then((r) => {
      r.json().then((j) => (this.events = j.data));
    });
  }

  render() {
    if (!this.events) return <div></div>;
    return (
      <div
        class="m-auto max-w-4xl flex flex-col gap-y-6"
        style={{ backgroundColor: this.widgetBgColor }}
      >
        {this.events.map((event) => (
          <div class="border bg-primary border-white grid grid-cols-1 sm:grid-cols-2">
            <div class="flex flex-grow place-content-center">
              <img
                style={{ maxWidth: "500px", height: "auto", width: "100%" }}
                src={`https://www.jumpcomedy.com/_next/image?w=1080&q=75&url=${event.thumbnail}`}
                class="w-2/3 pt-4 sm:pt-0 sm:w-full hover:scale-105 hover:transform hover:transition hover:duration-1000 blur:scale-100 blur:transform blur:transition duration-1000"
              />
            </div>
            <div
              class="grid grid-cols-1 place-content-center p-6"
              style={{ backgroundColor: this.mainBgColor }}
            >
              <div class="flex gap-4 flex-col text-center">
                <div
                  class="text-3xl font-bold"
                  style={{ color: this.eventTitleColor }}
                >
                  {event.title}
                </div>
                <div class="flex gap-4 justify-center flex-wrap shows-container">
                  <div class="rounded text-white text-lg p-1 border-none bg-secondary">
                    {event.variants.map((v) => (
                      <div
                        class={"p-1 rounded"}
                        style={{
                          color: this.showtimeTextColor,
                          backgroundColor: this.showtimeBgColor,
                        }}
                      >
                        {formatDate(v.startsAt)}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div
                    class="uppercase font-bold text-lg"
                    style={{
                      color: this.venueNameTextColor,
                    }}
                  >
                    {event.venueArrangement.venue.name}
                  </div>
                  <div
                    style={{ color: this.venueAddressTextColor }}
                    class={"flex flex-col"}
                  >
                    <div>{event.venueArrangement.venue.address}</div>
                    <div>
                      {event.venueArrangement.venue.city.name}{" "}
                      {event.venueArrangement.venue.province}{" "}
                      {event.venueArrangement.venue.postalCode}
                    </div>
                  </div>
                </div>
                <div>
                  <a
                    target="_top"
                    style={{
                      backgroundColor: this.buyLinkBgColor,
                      color: this.buyLinkTextColor,
                    }}
                    href={`${this.domain}/e/${event.handle}`}
                    class="p-3 whitespace-nowrap font-bold text-lg border-none rounded-2xl hover:bg-accent hover:opacity-80"
                  >
                    Get Tickets
                  </a>
                </div>
                <div class="w-40 m-auto">
                  <div class="grid grid-cols-3 gap-4 text-center"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}
