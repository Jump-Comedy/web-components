import { Component, h, Prop, State } from "@stencil/core";
type SubmitOptions = { ignore_incorrect_email_warning: boolean; email: string };
@Component({
  tag: "mailing-list-signup-form",
  styleUrl: "./mailing-list-signup-form.css",
  shadow: true,
  formAssociated: true,
})
export class MailingListSignupForm {
  // Labels
  @Prop() signUpButtonLabel = "Sign Up";
  @Prop() emailExistsInMailingListMessage =
    "This email already exists in the mailing list.";

  @Prop() successMessage = "Thank you for subscribing!";
  @Prop() mailingListNotFoundMessage = "Mailing List not found";

  // Styles
  @Prop() buttonBorderColor: string = "#67e8f9"; // cyan-300
  @Prop() buttonBgColor: string = "#67e8f9"; // cyan-300
  @Prop() buttonTextColor: string = "#000000"; // black

  @Prop() buttonHoverBorderColor: string = "#facc15"; // yellow-300
  @Prop() buttonHoverBgColor: string = "#000000"; // black
  @Prop() buttonHoverTextColor: string = "#facc15"; // yellow-300

  @Prop() inputBgColor: string = "#000000"; // black
  @Prop() inputPlaceholderColor: string = "#ffffff"; // white
  @Prop() inputTextColor: string = "#ffffff"; // white
  @Prop() inputBorderColor: string = "#ffffff"; // white
  @Prop() inputFocusBorderColor: string = "transparent"; // transparent
  @Prop() inputFocusRingColor: string = "transparent"; // transparent

  @Prop() mailingListId: string;

  // messages
  @State() message;

  // form data
  @State() email: string;

  // modal control
  @State() show_corrected_email_modal = false;

  corrected_email: string;

  async handleSubmit(event) {
    event.preventDefault();
    this.submitForm({
      ignore_incorrect_email_warning: false,
      email: this.email,
    });
  }

  async submitForm(opts: SubmitOptions) {
    this.show_corrected_email_modal = false;
    try {
      const response = await fetch(
        "https://amplify.jumpcomedy.com/store/mailing-list-signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: opts.email,
            mailing_list_id: this.mailingListId,
            ignore_incorrect_email_warning: opts.ignore_incorrect_email_warning,
          }),
        },
      );
      const result = await response.json();
      if (result.status === "ok") {
        this.email = "";
        this.message = this.successMessage;
      } else if (result.status === "error") {
        if (result.error_type === "email_correction_available") {
          this.corrected_email = result.data.corrected_email;
          this.show_corrected_email_modal = true;
        } else if (result.error_type === "email_exists_in_mailing_list") {
          this.message = this.emailExistsInMailingListMessage;
        } else if (result.error_type === "mailing_list_not_found") {
          this.message = this.mailingListNotFoundMessage;
        } else {
          this.message = result.message;
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
                class="outline-none w-full text-sm p-2 border-b-2"
                style={{
                  backgroundColor: this.inputBgColor,
                  color: this.inputTextColor,
                  borderColor: this.inputBorderColor,
                }}
                onFocus={(event: FocusEvent) => {
                  const target = event.target as HTMLElement;
                  target.style.borderColor = this.inputFocusBorderColor;
                  target.style.outlineColor = this.inputFocusRingColor;
                }}
                onBlur={(event: FocusEvent) => {
                  const target = event.target as HTMLElement;
                  target.style.borderColor = this.inputBorderColor;
                  target.style.outlineColor = "transparent";
                }}
                required={true}
                maxLength={250}
                autoComplete="off"
                placeholder="Enter your email here*"
              />
            </div>

            <div class="w-full md:w-1/4">
              <button
                id={"submit-button"}
                type="submit"
                class="font-bold w-full border-2 text-sm p-2"
                style={{
                  borderColor: this.buttonBorderColor,
                  backgroundColor: this.buttonBgColor,
                  color: this.buttonTextColor,
                }}
                onMouseOver={(e: MouseEvent) => {
                  const target = e.currentTarget as HTMLElement;
                  target.style.backgroundColor = this.buttonHoverBgColor;
                  target.style.color = this.buttonHoverTextColor;
                  target.style.borderColor = this.buttonHoverBorderColor;
                }}
                onMouseOut={(e: MouseEvent) => {
                  const target = e.currentTarget as HTMLElement;
                  target.style.backgroundColor = this.buttonBgColor;
                  target.style.color = this.buttonTextColor;
                  target.style.borderColor = this.buttonBorderColor;
                }}
              >
                {this.signUpButtonLabel}
              </button>
            </div>
          </div>

          {this.message && (
            <div id="messages" class="text-white text-lg p-2">
              {this.message}
            </div>
          )}
          {this.show_corrected_email_modal && (
            <dialog class={`modal modal-open text-black bg-white text-lg p-2`}>
              <div class="modal-box">
                <div
                  class={"flex flex-col gap-y-4 justify-center items-center"}
                >
                  <div id="text-bold">
                    We noticed you may have made a typo? Did you mean to enter{" "}
                    <strong>{this.email}</strong> or did you mean{" "}
                    <strong>{this.corrected_email}</strong>?
                  </div>
                  <div class={"flex gap-x-3"}>
                    <button
                      type={"button"}
                      style={{
                        borderColor: this.buttonBorderColor,
                        backgroundColor: this.buttonBgColor,
                        color: this.buttonTextColor,
                      }}
                      class={"btn btn-sm"}
                      onClick={() => {
                        this.submitForm({
                          ignore_incorrect_email_warning: true,
                          email: this.corrected_email,
                        });
                      }}
                    >
                      Change to {this.corrected_email}
                    </button>
                    <button
                      style={{
                        borderColor: this.buttonBorderColor,
                        backgroundColor: this.buttonBgColor,
                        color: this.buttonTextColor,
                      }}
                      type={"button"}
                      class={"btn btn-sm"}
                      onClick={() => {
                        this.submitForm({
                          ignore_incorrect_email_warning: true,
                          email: this.email,
                        });
                      }}
                    >
                      Keep {this.email}
                    </button>
                  </div>
                </div>
              </div>
            </dialog>
          )}
        </div>
      </form>
    );
  }
}
