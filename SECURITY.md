# Security Policy

## Supported versions

| Version | Supported |
| --- | --- |
| 1.x | Yes |

## Reporting a vulnerability

Please do not open a public issue for security problems.

Report privately through GitHub: open the repository's **Security** tab and choose **Report a vulnerability**. If that is unavailable, contact the maintainers through the Figsh github profile.

Please include:

- A description of the issue and its impact
- Steps or a minimal code sample to reproduce it
- The version of `string-range-tokens` and your runtime (Node version or browser)

## What to expect

- Acknowledgement within 5 business days
- A status update once the report is triaged
- A fix and a patch release for confirmed issues, with credit to the reporter unless you prefer to stay anonymous

## Scope

srTokens is a small, dependency-free string utility. In scope: crashes, unbounded resource use, incorrect output that could lead to unsafe behavior, and packaging or supply chain problems.

Out of scope: using srTokens to hide secrets in client code. It assembles strings and is not encryption, so anything shipped to a browser can be read by the user. Keep real keys and tokens server side.
