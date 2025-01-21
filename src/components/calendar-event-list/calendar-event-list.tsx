import { Component, h, Prop } from "@stencil/core";

@Component({
  tag: "calendar-event-list",
  styleUrl: "./calendar-event-list.css",
  shadow: true,
})
export class BigEventList {
  @Prop() events: any[];
  @Prop() config: any;
  @Prop() domain: string;

  render() {
    return <div>{JSON.stringify(this.events)}</div>;
  }
}
