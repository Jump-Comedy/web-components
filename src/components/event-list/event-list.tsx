import { Component, h, Prop, State, Env, Watch } from "@stencil/core";
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

  @State()
  colors: any[];

  @Prop() widgetId;

  @Prop() draftMode = false;

  @Prop() domain = "https://www.jumpcomedy.com";

  @Prop() reRender = 1;

  getColor(name) {
    console.log(name, this.colors);
    const color = this.colors.find((c) => c.property === name);
    return color ? color.value : "#000000";
  }

  connectedCallback() {
    this.fetchData();
  }

  @Watch("reRender")
  watchPropHandler() {
    this.fetchData();
  }

  fetchData() {
    fetch(
      `${Env.AMPLIFY_BASE_URL}/store/widgets/${this.widgetId}?` +
        new URLSearchParams({
          draft_mode: this.draftMode + "",
        }),
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    ).then((r) => {
      r.json().then((json) => {
        this.events = json.data.events;
        this.colors = json.data.config.colors;
      });
    });
  }

  render() {
    if (!this.events || !this.colors) return <div></div>;
    return (
      <div
        class="m-auto max-w-4xl flex flex-col gap-y-6"
        style={{ backgroundColor: this.getColor("widget-bg-color") }}
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
              style={{ backgroundColor: this.getColor("main-bg-color") }}
            >
              <div class="flex gap-4 flex-col text-center">
                <div
                  class="text-3xl font-bold"
                  style={{ color: this.getColor("event-title-color") }}
                >
                  {event.title}
                </div>
                <div class="flex gap-4 justify-center flex-wrap shows-container">
                  <div class="rounded text-white text-lg p-1 border-none bg-secondary">
                    {event.variants.map((v) => (
                      <div
                        class={"p-1 rounded"}
                        style={{
                          color: this.getColor("showtime-text-color"),
                          backgroundColor: this.getColor("showtime-bg-color"),
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
                      color: this.getColor("venue-name-text-color"),
                    }}
                  >
                    {event.venueArrangement.venue.name}
                  </div>
                  <div
                    style={{ color: this.getColor("venue-address-text-color") }}
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
                      backgroundColor: this.getColor("buy-link-bg-color"),
                      color: this.getColor("buy-link-text-color"),
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
