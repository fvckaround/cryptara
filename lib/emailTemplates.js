function emailWrapper(bodyHtml) {
  return `
  <div style="background-color:#1e0f1e;padding:40px 20px;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" style="max-width:480px;margin:0 auto;">
      <tr>
        <td style="padding-bottom:24px;">
          <span style="font-size:18px;color:#f0e6ec;font-weight:600;">Cryptara Holdings</span>
        </td>
      </tr>
      <tr>
        <td style="background-color:#2d1230;border:1px solid rgba(240,230,236,0.1);padding:32px;">
          ${bodyHtml}
        </td>
      </tr>
      <tr>
        <td style="padding-top:24px;">
          <p style="font-size:12px;color:#8a7a8c;margin:0;">
            Cryptara Holdings — digital asset holding and custody. This is an automated message, please do not reply directly to this email.
          </p>
        </td>
      </tr>
    </table>
  </div>
  `;
}

function money(amountUsd) {
  return `$${amountUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}

// ---- User-facing templates ----

export function welcomeEmailTemplate(fullName) {
  return emailWrapper(`
    <h1 style="font-size:20px;color:#f0e6ec;margin:0 0 16px;">Welcome, ${fullName}</h1>
    <p style="font-size:14px;color:#8a7a8c;line-height:1.6;margin:0 0 16px;">
      Your Cryptara Holdings account is open. You can now make a deposit, choose a holding plan, and track everything from your dashboard.
    </p>
    <p style="font-size:14px;color:#8a7a8c;line-height:1.6;margin:0;">
      If you didn't create this account, please contact support immediately.
    </p>
  `);
}

export function depositPendingTemplate(fullName, amountUsd, currency) {
  return emailWrapper(`
    <h1 style="font-size:20px;color:#f0e6ec;margin:0 0 16px;">Deposit received</h1>
    <p style="font-size:14px;color:#8a7a8c;line-height:1.6;margin:0 0 16px;">
      Hi ${fullName}, we've received your deposit request of <strong style="color:#f0e6ec;">${money(amountUsd)}</strong> in ${currency}. It's now pending review — you'll receive another email once it's confirmed.
    </p>
  `);
}

export function depositApprovedTemplate(fullName, amountUsd) {
  return emailWrapper(`
    <h1 style="font-size:20px;color:#f0e6ec;margin:0 0 16px;">Deposit confirmed</h1>
    <p style="font-size:14px;color:#8a7a8c;line-height:1.6;margin:0 0 16px;">
      Hi ${fullName}, your deposit of <strong style="color:#f0e6ec;">${money(amountUsd)}</strong> has been confirmed and credited to your account balance.
    </p>
  `);
}

export function depositRejectedTemplate(fullName, amountUsd) {
  return emailWrapper(`
    <h1 style="font-size:20px;color:#f0e6ec;margin:0 0 16px;">Deposit not approved</h1>
    <p style="font-size:14px;color:#8a7a8c;line-height:1.6;margin:0 0 16px;">
      Hi ${fullName}, your deposit of <strong style="color:#f0e6ec;">${money(amountUsd)}</strong> could not be approved. Please contact support for details.
    </p>
  `);
}

export function withdrawalPendingTemplate(fullName, amountUsd, currency) {
  return emailWrapper(`
    <h1 style="font-size:20px;color:#f0e6ec;margin:0 0 16px;">Withdrawal requested</h1>
    <p style="font-size:14px;color:#8a7a8c;line-height:1.6;margin:0 0 16px;">
      Hi ${fullName}, we've received your withdrawal request of <strong style="color:#f0e6ec;">${money(amountUsd)}</strong> in ${currency}. The amount has been reserved from your balance and is pending review.
    </p>
  `);
}

export function withdrawalApprovedTemplate(fullName, amountUsd) {
  return emailWrapper(`
    <h1 style="font-size:20px;color:#f0e6ec;margin:0 0 16px;">Withdrawal approved</h1>
    <p style="font-size:14px;color:#8a7a8c;line-height:1.6;margin:0 0 16px;">
      Hi ${fullName}, your withdrawal of <strong style="color:#f0e6ec;">${money(amountUsd)}</strong> has been approved and sent.
    </p>
  `);
}

export function withdrawalRejectedTemplate(fullName, amountUsd, reason) {
  return emailWrapper(`
    <h1 style="font-size:20px;color:#f0e6ec;margin:0 0 16px;">Withdrawal not approved</h1>
    <p style="font-size:14px;color:#8a7a8c;line-height:1.6;margin:0 0 16px;">
      Hi ${fullName}, your withdrawal of <strong style="color:#f0e6ec;">${money(amountUsd)}</strong> could not be approved. The amount has been returned to your account balance.
    </p>
    ${reason ? `<p style="font-size:14px;color:#8a7a8c;line-height:1.6;margin:0;">Reason: ${reason}</p>` : ""}
  `);
}

export function investmentStartedTemplate(fullName, planName, amountUsd, termDays) {
  return emailWrapper(`
    <h1 style="font-size:20px;color:#f0e6ec;margin:0 0 16px;">You're in the ${planName} plan</h1>
    <p style="font-size:14px;color:#8a7a8c;line-height:1.6;margin:0 0 16px;">
      Hi ${fullName}, <strong style="color:#f0e6ec;">${money(amountUsd)}</strong> has been committed to the ${planName} plan for a ${termDays}-day term. Principal and profit will be paid out to your balance automatically at maturity.
    </p>
  `);
}

// ---- Admin-facing templates ----

export function adminNewUserTemplate(fullName, email) {
  return emailWrapper(`
    <h1 style="font-size:18px;color:#f0e6ec;margin:0 0 16px;">New account registered</h1>
    <p style="font-size:14px;color:#8a7a8c;line-height:1.6;margin:0;">
      ${fullName} (${email}) just opened an account.
    </p>
  `);
}

export function adminNewDepositTemplate(fullName, email, amountUsd, currency) {
  return emailWrapper(`
    <h1 style="font-size:18px;color:#f0e6ec;margin:0 0 16px;">New deposit awaiting review</h1>
    <p style="font-size:14px;color:#8a7a8c;line-height:1.6;margin:0;">
      ${fullName} (${email}) submitted a deposit of <strong style="color:#f0e6ec;">${money(amountUsd)}</strong> in ${currency}. Review it in the admin panel.
    </p>
  `);
}

export function adminNewWithdrawalTemplate(fullName, email, amountUsd, currency, destinationAddress) {
  return emailWrapper(`
    <h1 style="font-size:18px;color:#f0e6ec;margin:0 0 16px;">New withdrawal awaiting review</h1>
    <p style="font-size:14px;color:#8a7a8c;line-height:1.6;margin:0 0 12px;">
      ${fullName} (${email}) requested a withdrawal of <strong style="color:#f0e6ec;">${money(amountUsd)}</strong> in ${currency}.
    </p>
    <p style="font-size:13px;color:#8a7a8c;line-height:1.6;margin:0;word-break:break-all;">
      To: ${destinationAddress}
    </p>
  `);
}

export function adminNewInvestmentTemplate(fullName, email, planName, amountUsd) {
  return emailWrapper(`
    <h1 style="font-size:18px;color:#f0e6ec;margin:0 0 16px;">New plan investment</h1>
    <p style="font-size:14px;color:#8a7a8c;line-height:1.6;margin:0;">
      ${fullName} (${email}) invested <strong style="color:#f0e6ec;">${money(amountUsd)}</strong> in the ${planName} plan.
    </p>
  `);
}