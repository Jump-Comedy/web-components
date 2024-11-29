import { Component, h, Prop, Element, State } from "@stencil/core";

@Component({
  tag: "mailing-list-signup-form",
  styleUrl: "./mailing-list-signup-form.css",
  shadow: true,
  formAssociated: true,
})
export class MailingListSignupForm {
  @Prop() mailing_list_id: string;
  @Element() el: HTMLElement;

  // form data
  @State() ignore_incorrect_email_warning = false;
  @State() message;
  @State() email: string;
  @State() corrected_email: string;

  // modal control
  @State() show_corrected_email_modal = false;

  async handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:4000/store/mailing-list-signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: this.email,
            mailing_list_id: this.mailing_list_id,
            ignore_incorrect_email_warning: this.ignore_incorrect_email_warning,
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

  render() {
    return (
      <form
        id={"mailing-list-form"}
        onSubmit={(e) => this.handleSubmit(e)}
        method={"post"}
        action={"http://localhost:4000/store/mailing-list-signup"}
      >
        <div class="flex flex-col w-full items-center p-2">
          <div class="flex w-full flex-col md:flex-row gap-2 justify-center items-center">
            <div class="w-full md:w-3/4">
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
              <div class={"flex flex-col gap-y-4 justify-center"}>
                <div id="text-bold">
                  We noticed you may have made a typo? Did you mean to enter{" "}
                  <strong>{this.email}</strong> or did you mean{" "}
                  <strong>{this.corrected_email}</strong>?
                </div>
                <div class={"flex gap-x-3"}>
                  <button
                    style={{ background: "red", color: "white" }}
                    class={"btn btn-sm"}
                    onClick={() => {
                      this.show_corrected_email_modal = false;
                    }}
                  >
                    Use {this.corrected_email}
                  </button>
                  <button
                    type={"button"}
                    class={"btn btn-sm btn-primary"}
                    onClick={(e) => {
                      this.email = this.corrected_email;
                      this.ignore_incorrect_email_warning = true;
                      this.show_corrected_email_modal = false;
                      this.handleSubmit(e);
                      return false;
                    }}
                  >
                    Use {this.email}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }
}
