using System;
using Frontend.Vanilla.Features.Authentication;
using Frontend.Vanilla.ServiceClients.Security.Claims;

namespace Frontend.Vanilla.Features.WebIntegration.ServiceClients;

/// <summary>
/// Implementation of <see cref="IClaimsCacheTime" /> for web apps according to web authentication.
/// </summary>
internal sealed class WebClaimsCacheTime(IAuthenticationConfiguration authenticationConfig) : IClaimsCacheTime
{
    public TimeSpan Value => authenticationConfig.Timeout;
    public TimeSpan AnonymousClaimCacheTime => authenticationConfig.AnonymousClaimCacheTime;
}
