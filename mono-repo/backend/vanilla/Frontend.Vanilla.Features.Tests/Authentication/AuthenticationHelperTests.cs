using System;
using FluentAssertions;
using Frontend.Vanilla.Features.Authentication;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Authentication;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Authentication;

public class AuthenticationHelperTests
{
    private readonly IAuthenticationHelper target;
    private readonly TestClock clock;

    public AuthenticationHelperTests()
    {
        clock = new TestClock();
        target = new AuthenticationHelper(clock);
    }

    [Theory]
    [InlineData(10, 20, false)]
    [InlineData(20, 10, true)]
    public void ShouldWork(int issuedForSeconds, int expiresInSeconds, bool result)
    {
        var act = target.IsSecondHalfOfExpiration(new AuthenticationProperties()
        {
            IssuedUtc = clock.UtcNow.AddSeconds(-1 * issuedForSeconds).ValueWithOffset,
            ExpiresUtc = clock.UtcNow.AddSeconds(expiresInSeconds).ValueWithOffset,
        });

        act.Should().Be(result);
    }

    [Theory]
    [InlineData(null, 10)]
    [InlineData(10, null)]
    [InlineData(null, null)]
    public void ShouldThrow_IfMissingTokenTimes(int? issuedForSeconds, int? expiresInSeconds)
    {
        Action act = () => target.IsSecondHalfOfExpiration(new AuthenticationProperties()
        {
            IssuedUtc = issuedForSeconds != null
                ? clock.UtcNow.AddSeconds(-1 * issuedForSeconds.Value).ValueWithOffset
                : null,
            ExpiresUtc = expiresInSeconds != null
                ? clock.UtcNow.AddSeconds(expiresInSeconds.Value).ValueWithOffset
                : null,
        });

        act.Should().Throw<Exception>().WithMessage("Auth ticket is missing issued or expires time.");
    }
}
