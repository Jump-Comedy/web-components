import { Component, h, Prop, State, Env, Watch } from "@stencil/core";
@Component({
  tag: "event-list",
  shadow: true,
})
export class EventWidget {
  @State()
  events: any[];

  @State()
  config: any;

  @Prop() widgetId;

  @Prop() draftMode = false;

  domain = "www.jumpcomedy.com";

  @Prop() reRender = 1;

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
        this.config = json.data.config;
        if (json.data.config.domain) {
          this.domain = json.data.config.domain;
        }
      });
    });
  }

  render() {
    if (!this.events || !this.config) return <div></div>;
    return (
      <div>
        <big-event-list
          events={this.events}
          config={this.config}
          domain={this.domain}
        ></big-event-list>
      </div>
    );
  }
}
