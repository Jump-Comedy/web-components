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

  @State() listType = "big-event-list";

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
        if (json.data.config.list_type) {
          this.listType = json.data.config.list_type;
        }
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
        {this.listType === "big-event-list" && (
          <big-event-list
            events={this.events}
            config={this.config}
            domain={this.domain}
          ></big-event-list>
        )}
        {this.listType === "compact-event-list" && (
          <compact-event-list
            events={this.events}
            config={this.config}
            domain={this.domain}
          ></compact-event-list>
        )}
      </div>
    );
  }
}
