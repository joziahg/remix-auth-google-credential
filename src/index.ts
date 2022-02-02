import { SessionStorage } from "@remix-run/server-runtime";
import {
  AuthenticateOptions,
  Strategy,
  StrategyVerifyCallback,
} from "remix-auth";
import { OAuth2Profile } from "remix-auth-oauth2";
import { OAuth2Client, TokenPayload } from "google-auth-library";

export type GoogleStrategyOptions = {
  credentialId: string;
  clientId: string;
};

export type GoogleProfile = {
  id: string;
  displayName: string;
  name: {
    familyName: string;
    givenName: string;
  };
  emails: [{ value: string }];
  photos: [{ value: string }];
  _json: TokenPayload;
} & OAuth2Profile;

export class GoogleCredentialStrategy<User> extends Strategy<
  User,
  GoogleProfile
> {
  name = "google-credential";

  private readonly credentialId: string;
  private readonly clientId: string;
  private googleAuthClient: OAuth2Client;

  constructor(
    { credentialId, clientId }: GoogleStrategyOptions,
    verify: StrategyVerifyCallback<User, GoogleProfile>
  ) {
    super(verify);
    this.clientId = clientId;
    this.credentialId = credentialId ?? "credential";
    this.googleAuthClient = new OAuth2Client(clientId);
  }
  async authenticate(
    request: Request,
    sessionStorage: SessionStorage,
    options: AuthenticateOptions
  ): Promise<User> {
    const requestData = Object.fromEntries(await request.formData());
    const credential = requestData[this.credentialId] as string;
    if (!credential) {
      return await this.failure(
        "No credential found in request body",
        request,
        sessionStorage,
        options
      );
    }
    const ticket = await this.googleAuthClient.verifyIdToken({
      // The token received from the interface
      idToken: credential,
      // This is the google ID of your application
      audience: this.clientId,
    });
    if (!ticket) {
      return await this.failure(
        "Credential not valid",
        request,
        sessionStorage,
        options
      );
    }
    const payload = ticket.getPayload();
    if (!payload) {
      return await this.failure(
        "Credential not valid",
        request,
        sessionStorage,
        options
      );
    }
    const profile: GoogleProfile = {
      provider: this.name,
      id: payload.sub!,
      displayName: payload.name!,
      name: {
        familyName: payload.family_name!,
        givenName: payload.given_name!,
      },
      emails: [{ value: payload.email! }],
      photos: [{ value: payload.picture! }],
      _json: payload!,
    };
    let user: User;
    try {
      user = await this.verify(profile);
    } catch (error) {
      let message = (error as Error).message;
      return await this.failure(message, request, sessionStorage, options);
    }
    return await this.success(user, request, sessionStorage, options);
  }
}
