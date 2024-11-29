import {
  Component,
  h,
  Prop,
  Element,
  AttachInternals,
  State,
} from "@stencil/core";

@Component({
  tag: "mailing-list-signup-form",
  shadow: true,
  formAssociated: true,
})
export class MailingListSignupForm {
  constructor() {
    this.ignore_incorrect_email_warning = false;
    this.show_corrected_email_modal = false;
  }

  @Prop() mailing_list_id: string;
  @Element() el: HTMLElement;
  @AttachInternals() internals: ElementInternals;

  @State() ignore_incorrect_email_warning;
  @State() message;

  @State() email: string;

  @State() corrected_email: string;
  @State() show_corrected_email_modal: boolean;

  async handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch(
        "https://amplify.jumpcomedy.com/store/mailing-list-signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: this.email,
            mailing_list_id: this.mailing_list_id,
          }),
        },
      );
      const result = await response.json();

      if (result.status === "ok") {
        this.email = "";
        this.message = result.message;
      } else if (result.status === "error") {
        this.message = result.message;
      } else if (result.status === "warning") {
        if (result.type === "email_correction_available") {
          this.corrected_email = result.data.corrected_email;
          this.show_corrected_email_modal = true;
        }
      }
    } catch (error) {
      this.message = "An error occurred. Please try again.";
    }
  }

  handleEmailChange(event) {
    this.email = event.target.value;
  }

  componentWillLoad() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://embed.jumpcomedy.com/styles/comedy-inn.css"; // URL of the remote CSS
    this.el.shadowRoot.appendChild(link);
    return new Promise<void>((resolve, reject) => {
      link.onload = () => resolve(); // Resolve the promise on successful load
      link.onerror = () => reject(new Error("Failed to load stylesheet")); // Reject if loading fails
      this.el.shadowRoot.appendChild(link);
    });
  }

  render() {
    return (
      <form
        id={"mailing-list-form"}
        onSubmit={(e) => this.handleSubmit(e)}
        method={"post"}
        action={"https://localhost:4000/store/mailing-list-signup"}
      >
        <div class="flex flex-col w-full items-center p-2">
          <div class="flex w-full flex-col md:flex-row gap-2 justify-center items-center">
            <div class="w-full md:w-3/4">
              <input
                type="hidden"
                name="mailing_list_id"
                value={this.mailing_list_id}
              />

              <input
                id="email"
                type="email"
                name="email"
                value={this.email}
                onInput={(event) => this.handleEmailChange(event)}
                class="outline-none border-transparent focus:border-transparent focus:ring-0 bg-black w-full placeholder-white text-white text-sm p-2 border-b-2 border-b-white"
                required={true}
                maxLength={250}
                autoComplete="off"
                placeholder="Enter your email here*"
              />
            </div>

            <div class="w-full md:w-1/4">
              <button
                type="submit"
                class="font-bold w-full border-2 border-cyan-300 bg-cyan-300 text-sm hover:bg-black text-black hover:text-yellow-300 p-2 hover:border-2 hover:border-yellow-300"
              >
                Inn-Vite Me
              </button>
            </div>
          </div>

          <div id="messages" class="text-white text-lg p-2">
            {this.message}
          </div>
          <div
            id="warning-modal"
            class={`modal ${this.show_corrected_email_modal ? "modal-open" : ""} text-black bg-white text-lg p-2`}
          >
            <div class="modal-box">
              <div id="warning-modal-content text-bold mb-4">
                We noticed you may have made a typo? Did you mean to enter{" "}
                <strong>{this.email}</strong> or did you mean{" "}
                <strong>{this.corrected_email}</strong>?
              </div>
              <div class={"flex gap-x-3"}>
                <button class={"btn btn-sm"} type={"button"}>
                  Use {this.email}
                </button>
                <button
                  type={"button"}
                  class={"btn btn-sm"}
                  onClick={() => {
                    this.ignore_incorrect_email_warning = true;
                    this.email = this.ignore_incorrect_email_warning;
                    const form = this.el.shadowRoot.querySelector(
                      "mailing-list-form",
                    ) as HTMLFormElement;
                    form.submit();
                    this.show_corrected_email_modal = false;
                  }}
                >
                  Use {this.corrected_email}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }
}
