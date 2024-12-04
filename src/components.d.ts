/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
export namespace Components {
    interface MailingListSignupForm {
        "buttonBgColor": string;
        "buttonBorderColor": string;
        "buttonHoverBgColor": string;
        "buttonHoverBorderColor": string;
        "buttonHoverTextColor": string;
        "buttonTextColor": string;
        "correctedEmailHighlightColor": string;
        "emailExistsInMailingListMessage": string;
        "inputBgColor": string;
        "inputBorderColor": string;
        "inputFocusBorderColor": string;
        "inputFocusRingColor": string;
        "inputPlaceholderColor": string;
        "inputTextColor": string;
        "mailingListId": string;
        "mailingListNotFoundMessage": string;
        "modalBackgroundColor": string;
        "modalTextColor": string;
        "signUpButtonLabel": string;
        "successMessage": string;
    }
    interface MyComponent {
        /**
          * The first name
         */
        "first": string;
        /**
          * The last name
         */
        "last": string;
        /**
          * The middle name
         */
        "middle": string;
    }
}
declare global {
    interface HTMLMailingListSignupFormElement extends Components.MailingListSignupForm, HTMLStencilElement {
    }
    var HTMLMailingListSignupFormElement: {
        prototype: HTMLMailingListSignupFormElement;
        new (): HTMLMailingListSignupFormElement;
    };
    interface HTMLMyComponentElement extends Components.MyComponent, HTMLStencilElement {
    }
    var HTMLMyComponentElement: {
        prototype: HTMLMyComponentElement;
        new (): HTMLMyComponentElement;
    };
    interface HTMLElementTagNameMap {
        "mailing-list-signup-form": HTMLMailingListSignupFormElement;
        "my-component": HTMLMyComponentElement;
    }
}
declare namespace LocalJSX {
    interface MailingListSignupForm {
        "buttonBgColor"?: string;
        "buttonBorderColor"?: string;
        "buttonHoverBgColor"?: string;
        "buttonHoverBorderColor"?: string;
        "buttonHoverTextColor"?: string;
        "buttonTextColor"?: string;
        "correctedEmailHighlightColor"?: string;
        "emailExistsInMailingListMessage"?: string;
        "inputBgColor"?: string;
        "inputBorderColor"?: string;
        "inputFocusBorderColor"?: string;
        "inputFocusRingColor"?: string;
        "inputPlaceholderColor"?: string;
        "inputTextColor"?: string;
        "mailingListId"?: string;
        "mailingListNotFoundMessage"?: string;
        "modalBackgroundColor"?: string;
        "modalTextColor"?: string;
        "signUpButtonLabel"?: string;
        "successMessage"?: string;
    }
    interface MyComponent {
        /**
          * The first name
         */
        "first"?: string;
        /**
          * The last name
         */
        "last"?: string;
        /**
          * The middle name
         */
        "middle"?: string;
    }
    interface IntrinsicElements {
        "mailing-list-signup-form": MailingListSignupForm;
        "my-component": MyComponent;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "mailing-list-signup-form": LocalJSX.MailingListSignupForm & JSXBase.HTMLAttributes<HTMLMailingListSignupFormElement>;
            "my-component": LocalJSX.MyComponent & JSXBase.HTMLAttributes<HTMLMyComponentElement>;
        }
    }
}
