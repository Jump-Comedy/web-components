import { formatDate } from "@jumpcomedy/utils/dist";
import { Component, h, Prop } from "@stencil/core";
import getColor from "../../utils/get-color";
import getUniqueShowtimes from "../../utils/get-unique-showtimes";
import getEventThumbnail from "../../utils/get-event-thumbnail";
import getCdnUrl from "../../utils/get-cdn-url";

@Component({
  tag: "compact-event-list",
  styleUrl: "./compact-event-list.css",
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
          <div class="border border-white flex flex-col">
            <div class="flex">
              <div class={"flex flex-col items-center justify-center"}>
                <img
                  style={{ maxWidth: "150px", height: "auto", width: "200px" }}
                  src={getCdnUrl(getEventThumbnail(event))}
                />
              </div>
              <div class={"flex flex-col md:flex-row w-full"}>
                <div
                  class="flex flex-col w-full p-1 items-center justify-center"
                  style={{
                    backgroundColor: getColor(
                      this.config.colors,
                      "main-bg-color",
                    ),
                  }}
                >
                  <div class="flex gap-1 flex-col text-center">
                    <div
                      class="font-bold"
                      style={{
                        color: getColor(
                          this.config.colors,
                          "event-title-color",
                        ),
                      }}
                    >
                      {event.title}
                    </div>
                    <div class="flex gap-2 justify-center flex-wrap shows-container">
                      <div class="rounded text-white text-sm p-1 border-none">
                        {getUniqueShowtimes(event.variants).map((v) => (
                          <div
                            class={"p-1 rounded"}
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
                        class="uppercase text-xs"
                        style={{
                          color: getColor(
                            this.config.colors,
                            "venue-name-text-color",
                          ),
                        }}
                      >
                        {event.venueArrangement.venue.name}
                      </div>
                    </div>
                  </div>
                </div>
                <div class={"flex flex-col items-center justify-center"}>
                  {event.is_out_of_stock ? (
                    <div class={"flex p-2"}>
                      <span
                        class="p-1 whitespace-nowrap font-bold text-sm border-none rounded"
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
                    </div>
                  ) : (
                    <div class={"flex p-2"}>
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
                        class="p-1 whitespace-nowrap font-bold text-sm border-none rounded hover:opacity-80"
                      >
                        Get Tickets
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}
