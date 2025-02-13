using System.Threading.Tasks;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Authentication;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.Authentication;

/// <summary>
/// Initializes claims for anonymous user in the beginning of a request.
/// For authenticated user see <see cref="IAuthenticatedClaimsInitializer" />.
/// </summary>
internal sealed class AnonymousClaimsMiddleware(RequestDelegate next, IPosApiAuthenticationServiceInternal posApiAuthenticationService)
    : WebAbstractions.Middleware(next)
{
    public override Task InvokeAsync(HttpContext context)
        => context.User.GetPosApiAuthTokens() == null
            ? InvokeNextWithAnonymousClaimsAsync(context)
            : Next(context);

    private async Task InvokeNextWithAnonymousClaimsAsync(HttpContext context)
    {
        context.User = await posApiAuthenticationService.SetupAnonymousUserAsync(context.RequestAborted);
        await Next(context);
    }
}
