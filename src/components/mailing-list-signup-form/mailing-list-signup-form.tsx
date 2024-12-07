import { Component, h, Prop, State, Env } from "@stencil/core";
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
  @Prop() modalBackgroundColor: string = "#222";
  @Prop() modalTextColor: string = "#fff";
  @Prop() buttonBorderColor: string = "#67e8f9"; // cyan-300
  @Prop() buttonBgColor: string = "#67e8f9"; // cyan-300
  @Prop() buttonTextColor: string = "#000000"; // black
  @Prop() correctedEmailHighlightColor: string = "#FF46A2"; // red

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
    this.message = "";
    this.show_corrected_email_modal = false;
    try {
      const response = await fetch(
        `${Env.AMPLIFY_BASE_URL}/store/mailing-list-signup`,
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
            <dialog class={`modal modal-open custom-modal`}>
              <div
                class="modal-box"
                style={{
                  backgroundColor: this.modalBackgroundColor,
                  color: this.modalTextColor,
                }}
              >
                <div class={"flex justify-end"}>
                  <button
                    type={"button"}
                    onClick={() => {
                      this.show_corrected_email_modal = false;
                      this.corrected_email = "";
                    }}
                  >
                    <svg
                      class="svg-icon"
                      style={{
                        width: "2em",
                        height: "2em",
                        verticalAlign: "middle",
                        fill: "currentColor",
                        overflow: "hidden",
                      }}
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M511.805572 67.64668c122.374118 0 233.840816 49.084928 314.474274 130.036635l0 0c80.276325 80.314187 130.073474 191.781908 130.073474 313.766147 0 123.047454-49.79715 234.196926-130.073474 314.829362l-3.171226 2.426259c-79.56308 78.917374-189.642175 127.647215-311.303049 127.647215-122.340349 0-233.809093-49.79715-314.439482-130.073474l0 0 0 0C116.764354 745.646388 67.64668 634.496915 67.64668 511.449461c0-121.984239 49.117674-233.452983 129.71941-313.766147l2.813069-2.422166C280.100396 116.019387 390.857942 67.64668 511.805572 67.64668L511.805572 67.64668zM628.548436 324.94679 628.548436 324.94679 511.805572 442.077487 395.064754 324.94679c-19.609617-19.252483-50.476625-19.252483-70.117964 0-18.896372 19.636223-18.896372 50.831712 0 70.111824l116.742864 116.39187L324.94679 628.548436c-18.896372 19.640316-18.896372 50.831712 0 70.116941 19.642362 19.284205 50.508347 19.284205 70.117964 0l116.740818-117.066229 116.742864 117.066229c19.640316 19.284205 50.831712 19.284205 70.116941 0 18.960841-19.284205 18.960841-50.476625 0-70.116941l-117.066229-117.098975 117.066229-116.39187c18.960841-19.280112 18.960841-51.183729 0-70.111824C679.380148 305.694307 648.188752 305.694307 628.548436 324.94679L628.548436 324.94679zM756.163929 267.124873 756.163929 267.124873c-62.384839-62.383816-148.647505-100.984972-244.358357-100.984972-94.610798 0-179.805132 38.245046-242.221694 98.882078l-2.459005 2.459005c-62.060451 62.383816-101.308337 148.969846-101.308337 243.968477 0 96.066963 39.248909 182.329629 101.308337 244.708328 62.739926 62.420655 149.325957 101.669564 244.680698 101.669564 94.319156 0 179.870624-38.213323 242.253416-99.561553l2.104941-2.108011c63.125713-62.378699 101.662401-148.641365 101.662401-244.708328 0-94.998631-38.536688-181.585685-101.662401-243.968477L756.163929 267.124873 756.163929 267.124873z" />
                    </svg>
                  </button>
                </div>
                <div
                  class={"flex flex-col gap-y-4 justify-center items-center"}
                >
                  <div class={"flex gap-x-4"}>
                    <div class="text-sm mb-2">
                      <p style={{ marginBottom: "6px", textAlign: "center" }}>
                        Whoops! There might be a typo.
                      </p>
                      <p style={{ marginBottom: "6px" }}>
                        You entered:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <strong>{this.email}</strong>
                      </p>
                      <p style={{ marginBottom: "6px" }}>
                        Did you mean:&nbsp;
                        <strong>
                          <span
                            innerHTML={highlightEmailDifferences(
                              this.email,
                              this.corrected_email,
                              this.correctedEmailHighlightColor,
                            )}
                          ></span>
                        </strong>
                        &nbsp;?
                      </p>
                    </div>
                  </div>
                  <div class={"flex flex-col gap-2 w-full md:w-fit"}>
                    <button
                      type={"button"}
                      style={{
                        borderColor: this.buttonBorderColor,
                        backgroundColor: this.buttonBgColor,
                        color: this.buttonTextColor,
                      }}
                      class={"btn btn-xs text-center"}
                      onClick={() => {
                        this.submitForm({
                          ignore_incorrect_email_warning: true,
                          email: this.corrected_email,
                        });
                      }}
                    >
                      Join as
                      <span
                        class={"ml-1"}
                        innerHTML={highlightEmailDifferences(
                          this.email,
                          this.corrected_email,
                          this.correctedEmailHighlightColor,
                        )}
                      ></span>
                    </button>
                    <button
                      style={{
                        borderColor: this.buttonBorderColor,
                        backgroundColor: this.buttonBgColor,
                        color: this.buttonTextColor,
                      }}
                      type={"button"}
                      class={"btn btn-xs text-center"}
                      onClick={() => {
                        this.submitForm({
                          ignore_incorrect_email_warning: true,
                          email: this.email,
                        });
                      }}
                    >
                      Keep as
                      <span class={"ml-1"}>
                        <strong>{this.email}</strong>
                      </span>
                    </button>
                    <button
                      style={{
                        borderColor: this.buttonBorderColor,
                        backgroundColor: this.buttonBgColor,
                        color: this.buttonTextColor,
                      }}
                      type={"button"}
                      class={"btn btn-xs text-center"}
                      onClick={() => {
                        this.show_corrected_email_modal = false;
                        this.corrected_email = "";
                      }}
                    >
                      Enter different email
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

function highlightEmailDifferences(original, corrected, highlight_color) {
  try {
    // Helper to wrap text in a span for underlining
    const wrapWithSpan = (text) =>
      `<span style="color: ${highlight_color}">${text}</span>`;

    let result = "";
    let i = 0,
      j = 0;

    while (i < original.length || j < corrected.length) {
      if (original[i] === corrected[j]) {
        // Characters match, add to result without highlighting
        result += corrected[j] || "";
        i++;
        j++;
      } else {
        // Highlight differing characters
        if (corrected[j]) result += wrapWithSpan(corrected[j]);
        j++;
        if (original[i]) i++;
      }
    }

    return result;
  } catch (e) {
    return corrected;
  }
}
