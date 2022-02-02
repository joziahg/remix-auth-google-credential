# Remix Auth Google Credential
```bash
$ npm i remix-auth-google-credential google-auth-library
```

remix-auth-google-credential depends on google-auth-library for verifying the provided credential

## Supported runtimes

| Runtime    | Has Support |
| ---------- | ----------- |
| Node.js    | ✅          |
| Cloudflare | ?          |

Not sure if google-auth-library supports workers
## How to use

This strategy accepts Google credential responses via FormData. This strategy supports Google one-tap html and javascript api. When using html api, set login_uri attribute to the strategy endpoint. When using javascript api, send credentials to straregy endpoint via fetcher.

### Create the strategy instance
You must initialize the google-credential strategy in your `auth.server.ts` file.

```ts
// app/server/auth.server.ts
import { GoogleCredentialStrategy } from "remix-auth-google-credential";

// Create an instance of the authenticator, pass a generic <User> type which the
// strategies will return (this will be stored in the session)
export let authenticator = new Authenticator<User>(sessionStorage, { sessionErrorKey });

authenticator.use(new GoogleStrategy(
  {
    clientId: "YOUR_CLIENT_ID",
    credentialId: "credential", // name of form field that stores credential. Default: credential
  },
  async (profile) => {
    return findOrCreateUser(profile);
  }
));
```
