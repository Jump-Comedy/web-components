import { newSpecPage } from '@stencil/core/testing';
import { MailingListSignupForm } from '../mailing-list-signup-form';

describe('mailing-list-signup-form', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MailingListSignupForm],
      html: `<mailing-list-signup-form></mailing-list-signup-form>`,
    });
    expect(page.root).toEqualHtml(`
      <mailing-list-signup-form>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </mailing-list-signup-form>
    `);
  });
});
