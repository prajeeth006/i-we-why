using System;
using Frontend.Vanilla.Core.Time;
using Microsoft.AspNetCore.Authentication;

namespace Frontend.Vanilla.Features.Authentication;

internal interface IAuthenticationHelper
{
    bool IsSecondHalfOfExpiration(AuthenticationProperties properties);
}

internal sealed class AuthenticationHelper(IClock clock) : IAuthenticationHelper
{
    public bool IsSecondHalfOfExpiration(AuthenticationProperties properties)
    {
        if (properties.IssuedUtc == null || properties.ExpiresUtc == null)
            throw new Exception("Auth ticket is missing issued or expires time.");

        var currentTime = clock.UtcNow.Value;
        var timeElapsed = currentTime - properties.IssuedUtc.Value;
        var timeRemaining = properties.ExpiresUtc.Value - currentTime;

        return timeRemaining < timeElapsed;
    }
}
