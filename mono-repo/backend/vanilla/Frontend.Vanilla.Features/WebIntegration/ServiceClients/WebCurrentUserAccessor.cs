using System.Security.Claims;
using Frontend.Vanilla.Core.Abstractions;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.ServiceClients.Security;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.WebIntegration.ServiceClients;

/// <summary>
/// Implementation of <see cref="ICurrentUserAccessor" /> for web apps.
/// </summary>
internal sealed class WebCurrentUserAccessor(IThread thread, IHttpContextAccessor httpContextAccessor) : ICurrentUserAccessor
{
    public ClaimsPrincipal User
    {
        get
        {
            var httpUser = httpContextAccessor.HttpContext?.User;

            // Fallback to thread before ASP.NET does authentication or when running on background thread
            return httpUser != null
                ? ClaimsUserCaster.Cast(httpUser, userSource: "HttpContext.Current.User")
                : ClaimsUserCaster.Cast(thread.CurrentPrincipal, userSource: "Thread.CurrentPrincipal");
        }
        set
        {
            Guard.NotNull(value, nameof(value));

            thread.CurrentPrincipal = value;

            if (httpContextAccessor.HttpContext != null)
                httpContextAccessor.HttpContext.User = value;
        }
    }
}
