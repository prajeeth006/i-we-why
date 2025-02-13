using System;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.WebUtilities;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Authentication;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.Authentication;

/// <summary>
/// Initializes claims for authenticated user in the beginning of a request.
/// For anonymous user see <see cref="AnonymousClaimsMiddleware" />.
/// </summary>
internal interface IAuthenticatedClaimsInitializer
{
    Task SetupClaimsAsync(CookieValidatePrincipalContext context);
}

internal sealed class AuthenticatedClaimsInitializer(
    IWebAuthenticationService authenticationService,
    IPosApiAuthenticationServiceInternal posApiAuthenticationService,
    IEndpointMetadata endpointMetadata,
    IAuthenticationHelper authenticationHelper,
    ILogger<AuthenticatedClaimsInitializer> log)
    : IAuthenticatedClaimsInitializer
{
    public async Task SetupClaimsAsync(CookieValidatePrincipalContext context)
    {
        var cancellationToken = context.HttpContext.RequestAborted;
        var posApiTokens = UserIdentityKey.ExtractPosApiTokens(context.Principal?.Identity?.Name);

        try
        {
            var validateAuthOnPosApi = endpointMetadata.Contains<ServesHtmlDocumentAttribute>();
            var user = await posApiAuthenticationService.SetupUserAsync(posApiTokens, validateAuthOnPosApi, cancellationToken);

            context.ReplacePrincipal(user);

            // ASP.NET renews cookies based on this
            var renewMetadata = endpointMetadata.Get<IRenewAuthenticationMetadata>();
            var disableExpirationRenewal = endpointMetadata.Contains<DisableExpirationRenewalAttribute>();
            var disableAuthentication = endpointMetadata.Contains<DisableAuthenticationAttribute>();

            if (!disableExpirationRenewal && !disableAuthentication)
            {
                context.ShouldRenew = renewMetadata?.ShouldRenew ?? authenticationHelper.IsSecondHalfOfExpiration(context.Properties);
                if (context.ShouldRenew)
                    await authenticationService.RefreshTokenAsync(true, cancellationToken);
            }
            else
            {
                await authenticationService.SetAnonymousUserAsync(cancellationToken);
            }
        }
        catch (PosApiException paex) when (paex.PosApiCode.EqualsAny(UserIdentityKey.AuthExpiredPosApiCodes))
        {
            log.LogWarning(
                paex,
                "Treating request as anonymous because user with {userToken} and {sessionToken} was logged out on PosAPI in the meantime because of expiration, logout from external games etc",
                posApiTokens.UserToken,
                posApiTokens.SessionToken);

            context.RejectPrincipal();
            await context.HttpContext.SignOutAsync();
            await posApiAuthenticationService.SetupAnonymousUserAsync(cancellationToken);
        }
        catch (Exception ex)
        {
            throw new Exception($"Failed to set up claims for user {posApiTokens}.", ex);
        }
    }
}
