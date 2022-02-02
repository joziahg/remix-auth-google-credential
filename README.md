# Remix Auth Google Credential

## Supported runtimes

| Runtime    | Has Support |
| ---------- | ----------- |
| Node.js    | ✅          |
| Cloudflare | ?          |

Not sure if google-auth-library supports workers
## How to use

This strategy accepts Google credential responses via FormData. This strategy supports Google one-tap html and javascript api. When using html api, set login_uri attribute to the strategy endpoint. When using javascript api, send credentials to straregy endpoint via fetcher.

### Create the strategy instance
For each social you want to use, you must initialise it in your `auth.server.ts` file.

```ts
// app/server/auth.server.ts
import { GoogleCredentialStrategy } from "remix-auth-google-credential";

// Create an instance of the authenticator, pass a generic <User> type which the
// strategies will return (this will be stored in the session)
export let authenticator = new Authenticator<User>(sessionStorage, { sessionErrorKey });

authenticator.use(new GoogleStrategy(
  {
    clientID: "YOUR_CLIENT_ID",
    credentialId: "credential", // name of form field that stores credential. Default: credential
  },
  async (profile) => {
    return findOrCreateUser(profile);
  }
));
```