import { formatDate } from "@jumpcomedy/utils/dist";
import { Component, h, Prop } from "@stencil/core";
import getColor from "../../utils/get-color";
import getUniqueShowtimes from "../../utils/get-unique-showtimes";
import getEventThumbnail from "../../utils/get-event-thumbnail";

@Component({
  tag: "big-event-list",
  styleUrl: "./big-event-list.css",
  shadow: true,
})
export class BigEventList {
  @Prop() events: any[];
  @Prop() config: any;
  @Prop() domain: string;

  render() {
    return (
      <div
        class="m-auto max-w-4xl flex flex-col gap-y-6"
        style={{
          backgroundColor: getColor(this.config.colors, "widget-bg-color"),
        }}
      >
        {this.events.map((event) => (
          <div class="border bg-primary border-white grid grid-cols-1 sm:grid-cols-2">
            <div class="flex flex-grow place-content-center">
              <img
                style={{ maxWidth: "500px", height: "auto", width: "100%" }}
                src={`https://www.jumpcomedy.com/_next/image?w=1080&q=75&url=${getEventThumbnail(event)}`}
                class="w-2/3 pt-4 sm:pt-0 sm:w-full hover:scale-105 hover:transform hover:transition hover:duration-1000 blur:scale-100 blur:transform blur:transition duration-1000"
              />
            </div>
            <div
              class="grid grid-cols-1 place-content-center p-6"
              style={{
                backgroundColor: getColor(this.config.colors, "main-bg-color"),
              }}
            >
              <div class="flex gap-4 flex-col text-center">
                <div
                  class="text-3xl font-bold"
                  style={{
                    color: getColor(this.config.colors, "event-title-color"),
                  }}
                >
                  {event.title}
                </div>
                <div class="flex gap-4 justify-center flex-wrap shows-container">
                  <div class="rounded text-white text-lg p-1 border-none bg-secondary">
                    {getUniqueShowtimes(event.variants).map((v) => (
                      <div
                        class={"p-1 rounded m-1"}
                        style={{
                          color: getColor(
                            this.config.colors,
                            "showtime-text-color",
                          ),
                          backgroundColor: getColor(
                            this.config.colors,
                            "showtime-bg-color",
                          ),
                        }}
                      >
                        {formatDate(v.startsAt)}
                        {v.low_stock_message && !v.is_out_of_stock && (
                          <div class={"text-xs"}>{v.low_stock_message}</div>
                        )}
                        {v.is_out_of_stock && (
                          <div class={"text-xs"}>SOLD OUT</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div
                    class="uppercase font-bold text-lg"
                    style={{
                      color: getColor(
                        this.config.colors,
                        "venue-name-text-color",
                      ),
                    }}
                  >
                    {event.venueArrangement.venue.name}
                  </div>
                  <div
                    style={{
                      color: getColor(
                        this.config.colors,
                        "venue-address-text-color",
                      ),
                    }}
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
                  {event.is_out_of_stock ? (
                    <span
                      class="p-3 whitespace-nowrap font-bold text-lg border-none rounded-2xl"
                      style={{
                        backgroundColor: getColor(
                          this.config.colors,
                          "buy-link-bg-color",
                        ),
                        color: getColor(
                          this.config.colors,
                          "buy-link-text-color",
                        ),
                      }}
                    >
                      SOLD OUT!
                    </span>
                  ) : (
                    <a
                      target="_top"
                      style={{
                        backgroundColor: getColor(
                          this.config.colors,
                          "buy-link-bg-color",
                        ),
                        color: getColor(
                          this.config.colors,
                          "buy-link-text-color",
                        ),
                      }}
                      href={`${this.domain.startsWith("https://") ? "" : "https://"}${this.domain}/e/${event.handle}${this.config.show_single_showtime_on_event_page && this.config.unpack_showtimes ? `?variant_id=${event.variants[0].id}` : ""}`}
                      class="p-3 whitespace-nowrap font-bold text-lg border-none rounded-2xl hover:bg-accent hover:opacity-80"
                    >
                      Get Tickets
                    </a>
                  )}
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
