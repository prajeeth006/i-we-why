#nullable enable

using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using Frontend.Vanilla.RestMocks.Models;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Login;

namespace Frontend.Vanilla.RestMocks;

internal partial class RestMocker
{
    public IEnumerable<RestMock> GetLoginMocks()
    {
        return new List<IEnumerable<RestMock>>
        {
            LoginErrorMock(_ => true, new PosApiError(600, "")),
            SimpleLoginMock("DefaultUser",
                r =>
                {
                    r.SetClaim(PosApiClaimTypes.GeoIP.CountryId, "GB");
                    r.SetClaim(PosApiClaimTypes.JurisdictionId, "GBR");
                }),
            SimpleLoginMock("DanishUser",
                r =>
                {
                    r.SetClaim(PosApiClaimTypes.Address.CountryId, "DK");
                    r.SetClaim(PosApiClaimTypes.GeoIP.CountryId, "DK");
                    r.SetClaim(PosApiClaimTypes.CultureName, "da-DK");
                }),
            SimpleLoginMock("FrenchUser",
                r =>
                {
                    r.SetClaim(PosApiClaimTypes.Address.CountryId, "FR");
                    r.SetClaim(PosApiClaimTypes.GeoIP.CountryId, "FR");
                    r.SetClaim(PosApiClaimTypes.CultureName, "fr-FR");
                    r.SetClaim(PosApiClaimTypes.WorkflowTypeId, "-1");
                }),
            SimpleLoginMock("CoralUser",
                r =>
                {
                    r.SetClaim(PosApiClaimTypes.VipLevel, "BRONZE");
                    r.SetClaim(PosApiClaimTypes.TierCode, "1");
                    r.SetClaim(PosApiClaimTypes.AccBusinessPhase, "in-shop");
                }),
            SimpleLoginMock("WorkflowUser", r => r.SetClaim(PosApiClaimTypes.WorkflowTypeId, "1")),
            SimpleLoginMock("MaltaUser", r => r.SetClaim(PosApiClaimTypes.JurisdictionId, "MGA")),
            SimpleLoginMock("TerminalUser", r =>
            {
                r.SetClaim(PosApiClaimTypes.JurisdictionId, "ANO");
                r.SetClaim(PosApiClaimTypes.AccBusinessPhase, "anonymous");
            }),
            SimpleLoginMock("LowBalanceUser", r => r.Balance.AccountBalance = 3),
            SimpleLoginMock("GermanMigiratedUser", r => r.PostLoginValues = new Dictionary<string, string>() { { "DE_MIG_FIRST_LOGIN", "true" }, }),
            SimpleLoginMock("MultipleActiveSessionsUser", r => r.PostLoginValues = new Dictionary<string, string>() { { "ACTIVE_LOGIN_SESSIONS_TERMINATED", "true" }, }),
            SimpleLoginMock("SingleAccountUser",
                r => r.PostLoginValues = new Dictionary<string, string>() { { "OLDER_STATE_SESSION_TERMINATED", "true" }, { "US_LOGOUT_DC", "PENNSYLVANIA" }, }),
            SimpleLoginMock("SessionLimitsUser", r => r.PostLoginValues = new Dictionary<string, string>()
            {
                {
                    "LOGIN_SESSION_LIMITS_ELAPSED",
                    "{\"accountName\":\"nb_Vfiftyseven\",\"frontend\":\"nb\",\"useCase\":\"LOGIN_SESSION_LIMIT\",\"sessionLimits\":[{\"sessionLimitType\":\"DAILY_LIMIT\",\"percentageElapsed\":100,\"sessionLimitElaspedMins\":60,\"sessionLimitConfiguredMins\":60}],\"endOfLimits\":{\"DAILY_LIMIT\":1687838399999},\"timezone\":\"EST5EDT\"}"
                },
            }),
            SimpleLoginMock("+1-4434445556", null),
            LoginErrorMock(r => string.IsNullOrWhiteSpace(r.Username) || string.IsNullOrWhiteSpace(r.Password),
                new PosApiError(1706, "The credentials entered are incorrect.")),
            LoginErrorMock(
                r => r.LoginType?.Equals(LoginType.ConnectCard, StringComparison.OrdinalIgnoreCase) == true && (r.ConnectCardNumber.Length < 12 || r.Pin.Length < 4),
                new PosApiError(1706, "The credentials entered are incorrect.")),
            LoginErrorMock(r => r.LoginType?.Equals(LoginType.ConnectCard, StringComparison.OrdinalIgnoreCase) == true && r.Pin == "4321",
                new PosApiError(600, "Authentication Failed.", new Dictionary<string, string> { { "REM_INVALID_PSWD_LOGIN_ATTEMPTS_TO_PSWD_BLOCK", "3" } })),
            LoginErrorMock(r => r.BankSessionId == "bankid_error_1701", new PosApiError(1701, "BANK ID UNKNOWN")),
            LoginErrorMock(r => r.Username == "+1-3334445556", new PosApiError(1001, "Mobile duplicate.")),
            LoginErrorMock(r => r.Username == "abc@gmail.com", new PosApiError(1717, "Invalid user or card")),
            DynamicLoginErrorMock(),
            LoginMock("BankIdUser", r => r.LoginType?.Equals(LoginType.BankId, StringComparison.OrdinalIgnoreCase) == true && r.BankSessionId == "session123", null),
            LoginMock("ConnectCardUser",
                r => r.LoginType?.Equals(LoginType.ConnectCard, StringComparison.OrdinalIgnoreCase) == true && r.ConnectCardNumber == "1234654312349876" &&
                     r.Pin == "8520", null),
            LoginMock("GridCardUser",
                r => r.LoginType?.Equals(LoginType.ConnectCard, StringComparison.OrdinalIgnoreCase) == true && r.ConnectCardNumber == "123456789012" && r.Pin == "1234",
                null),
        }.SelectMany(m => m);

        IEnumerable<RestMock> DynamicLoginErrorMock()
        {
            yield return new RestMock(
                IncomingLoginRequest(r => r.Username?.StartsWith("Error_") == true),
                OutgoingRequestsToPosApi("Authentication.svc/Login", HttpMethod.Post),
                DynamicResponse(c =>
                {
                    var payload = GetJsonPayload<LoginParameters>(c.RestRequest);
                    var errorCode = int.Parse(payload.Username.Substring(6));

                    return JsonSerialize(new PosApiError(errorCode, $"Dynamic response with error code {errorCode}"));
                }, HttpStatusCode.BadRequest));
        }

        IEnumerable<RestMock> LoginErrorMock(Func<LoginRequest, bool> requestMatcher, PosApiError error)
        {
            yield return new RestMock(
                IncomingLoginRequest(requestMatcher),
                OutgoingRequestsToPosApi("Authentication.svc/Login", HttpMethod.Post),
                StaticResponse(JsonSerialize(error), HttpStatusCode.BadRequest));

            yield return new RestMock(
                IncomingLoginRequest(requestMatcher),
                OutgoingRequestsToPosApi("Registration.svc/MobileAvailability"),
                StaticResponse(JsonSerialize(error), HttpStatusCode.BadRequest));
        }

        IEnumerable<RestMock> SimpleLoginMock(string username, Action<LoginResponse>? responseSetup)
            => LoginMock(username, r => r.Username == username, responseSetup);

        IEnumerable<RestMock> LoginMock(string username, Func<LoginRequest, bool> requestMatcher, Action<LoginResponse>? responseSetup)
        {
            var sessionToken = $"SessionToken_{username}";
            var ssoToken = $"SSO_{username}";
            var loginResponse = LoginResponse(r =>
            {
                r.SetClaim(PosApiClaimTypes.Name, username);
                r.SetClaim(PosApiClaimTypes.SsoToken, ssoToken);
                r.SessionToken = sessionToken;
                r.SsoToken = ssoToken;
                responseSetup?.Invoke(r);
            });

            yield return new RestMock(
                IncomingLoginRequest(requestMatcher),
                OutgoingRequestsToPosApi("Authentication.svc/Login", HttpMethod.Post),
                loginResponse);

            yield return new RestMock(
                IncomingRequestsToThisApp(query: $"_sso={ssoToken}"),
                OutgoingRequestsToPosApi("Authentication.svc/AutoLogin", HttpMethod.Post),
                loginResponse);

            yield return new RestMock(
                IncomingRequestsToThisApp(query: $"sessionKey={ssoToken}"),
                OutgoingRequestsToPosApi("Authentication.svc/AutoLogin", HttpMethod.Post),
                loginResponse);

            yield return new RestMock(
                IncomingRequestsToThisApp(query: $"username={username}&password=pass"),
                OutgoingRequestsToPosApi("Authentication.svc/Login", HttpMethod.Post),
                loginResponse);

            yield return new RestMock(
                c => c?.BrowserRequest?.Path.Value?.Contains("/api/auth/rememberme") == true && !string.IsNullOrWhiteSpace(c.GetCookie("rm-t")),
                OutgoingRequestsToPosApi("Authentication.svc/Login/RememberMe", HttpMethod.Post),
                LoginResponse(
                    r =>
                    {
                        r.SetClaim(PosApiClaimTypes.Name, username);
                        r.SetClaim(PosApiClaimTypes.SsoToken, ssoToken);
                        r.SessionToken = sessionToken;
                        r.SsoToken = ssoToken;
                        responseSetup?.Invoke(r);
                    },
                    setRemembermeToken: true));

            yield return new RestMock(
                AllIncomingRequestsToThisApp(),
                OutgoingRequestsToPosApi("Authentication.svc/ClaimsUnauthorized", sessionToken: sessionToken),
                loginResponse);
        }
    }

    private MatchIncomingRequestToThisAppHandler IncomingLoginRequest(Func<LoginRequest, bool> matcher)
    {
        return c =>
        {
            if (c?.BrowserRequest?.Path.Value?.Contains("/api/login") == true)
            {
                var request = GetJsonPayload<LoginRequest>(c.BrowserRequest);

                return matcher(request);
            }

            return false;
        };
    }

    private GetMockedResponseHandler LoginResponse(Action<LoginResponse> setup, bool setRemembermeToken = false)
    {
        return DynamicResponse((c) =>
        {
            var responseData = ReadAssemblyFile(GetType().Assembly, "Authentication.svc_Login.json");
            var loginResponse = JsonDeserialize<LoginResponse>(responseData);
            setup?.Invoke(loginResponse);

            try
            {
                var payload = GetJsonPayload<LoginParameters>(c.RestRequest);
                if (payload?.RememberMe == true)
                    loginResponse.RememberMeToken = $"RememberMe_{loginResponse.ClaimValues[PosApiClaimTypes.Name]}{Guid.NewGuid()}";
            }
            catch
            {
                // probably not instance of LoginParameters
            }

            if (setRemembermeToken)
                loginResponse.RememberMeToken = $"RememberMe_{loginResponse.ClaimValues[PosApiClaimTypes.Name]}{Guid.NewGuid()}";

            return JsonSerialize(loginResponse);
        });
    }
}

internal static class LoginResponseExtensions
{
    public static void SetClaim(this LoginResponse loginResponse, string name, string value)
    {
        loginResponse.ClaimValues[name] = value;
    }
}
