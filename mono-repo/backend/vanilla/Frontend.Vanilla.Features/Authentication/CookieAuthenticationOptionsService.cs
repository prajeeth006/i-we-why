using Frontend.Vanilla.Core.Time;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Threading.Tasks;
using Frontend.Vanilla.Features.Cookies;

namespace Frontend.Vanilla.Features.Authentication;

/// <summary>
/// Overrides cookie expiration and partitioned state during SignIn and partitioned state on SignOut.
/// Based on sample from https://github.com/dotnet/aspnetcore/blob/17c8c864248473efa4e88ef283abbfd35a31142d/src/Security/Authentication/test/CookieTests.cs#L980.
/// </summary>
internal interface ICookieAuthenticationOptionsService
{
    Task OverrideOnSigningIn(CookieSigningInContext context);
    Task OverrideOnSigningOut(CookieSigningOutContext context);
}

internal sealed class CookieAuthenticationOptionsService(
    IAuthenticationConfiguration authConfig,
    IClock clock, ICookiePartitionedStateProvider cookiePartitionedStateProvider) : ICookieAuthenticationOptionsService
{
    public Task OverrideOnSigningIn(CookieSigningInContext context)
    {
        var expirationTime = clock.UtcNow.Value.Add(authConfig.Timeout);
        context.Properties.ExpiresUtc = expirationTime;
        cookiePartitionedStateProvider.SetPartitionedState(context.CookieOptions);

        return Task.FromResult(0);
    }

    public Task OverrideOnSigningOut(CookieSigningOutContext context)
    {
        cookiePartitionedStateProvider.SetPartitionedState(context.CookieOptions);

        return Task.FromResult(0);
    }
}
