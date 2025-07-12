function getOTPEmailTemplate({ name, otp, email }) {
    return (
        `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <title></title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
                    color: #333;
                    background-color: #fff;
                }

                .container {
                    margin: 0 auto;
                    width: 100%;
                    max-width: 600px;
                    padding: 0 0px;
                    padding-bottom: 10px;
                    border-radius: 5px;
                    line-height: 1.8;
                }

                .header {
                    border-bottom: 1px solid #eee;
                }

                .header a {
                    font-size: 1.4em;
                    color: #000;
                    text-decoration: none;
                    font-weight: 600;
                }

                .content {
                    min-width: 700px;
                    overflow: auto;
                    line-height: 2;
                }

                .otp {
                    background: linear-gradient(to right, #007bff 0, #0088ff 50%, #00a0ff 100%);
                    margin: 0 auto;
                    width: max-content;
                    padding: 0 10px;
                    color: #fff;
                    border-radius: 4px;
                }

                .footer {
                    color: #aaa;
                    font-size: 0.8em;
                    line-height: 1;
                    font-weight: 300;
                }

                .email-info {
                    color: #666666;
                    font-weight: 400;
                    font-size: 13px;
                    line-height: 18px;
                    padding-bottom: 6px;
                }

                .email-info a {
                    text-decoration: none;
                    color: #007bff
                }
            </style>
        </head>

        <body>
        <!--Subject: Account Verification Required for your Account-->
            <div class="container">
                <div class="header">
                    <a>Prove Your Identity</a>
                </div>
                <br />
                <strong>Dear ${name},</strong>
                <p>
                    We have received a request for your account. For
                    security purposes, please verify your identity by providing the
                    following One-Time Password (OTP).
                    <br />
                    <b>Your One-Time Password (OTP) verification code is:</b>
                </p>
                <h2 class="otp">${otp}</h2>
                <p style="font-size: 0.9em">
                    <strong>One-Time Password (OTP) is valid for 5 minutes.</strong>
                    <br />
                    <br />
                    If you did not initiate this request, please disregard this
                    message. Please ensure the confidentiality of your OTP and do not share
                    it with anyone.<br />
                    <strong>Do not forward or give this code to anyone.</strong>
                    <br />
                    <br />
                    <strong>Thank you for using our website.</strong>
                    <br />
                    <br />
                    Best regards,
                    <br />
                    <strong>@mohit</strong>
                </p>

                <hr style="border: none; border-top: 0.5px solid #131111" />
                <div class="footer" style="text-align: center">
                    <p>This email can't receive replies.</p>
                    <p>
                    For more information about us and your account, visit
                    <strong>@mohit</strong>
                    </p>
                </div>
            </div>
            <div style="text-align: center">
                <div class="email-info">
                    <span>
                        This email was sent to
                        <a href="mailto:${email}">${email}</a>
                    </span>
                </div>
                <div class="email-info">
                    <a href="vizibble.in">vizibble.in</a> | Panjab University
                    | Chandigarh - 160014, India
                </div>
                <div class="email-info">
                    &copy; 2025 @mohit All rights
                    reserved.
                </div>
            </div>
        </body>
    </html>
    `
    )
}

module.exports = { getOTPEmailTemplate }