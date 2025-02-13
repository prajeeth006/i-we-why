using System;
using FluentAssertions;
using Frontend.Vanilla.Features.Authentication;
using Frontend.Vanilla.Features.WebIntegration.ServiceClients;
using Frontend.Vanilla.ServiceClients.Security.Claims;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.WebIntegration.ServiceClients;

public class WebClaimsCacheTimeTests
{
    [Fact]
    public void ShouldReturnAuthenticationTimeoutDynamically()
    {
        var authenticationConfig = new Mock<IAuthenticationConfiguration>();
        IClaimsCacheTime target = new WebClaimsCacheTime(authenticationConfig.Object);

        authenticationConfig.VerifyGet(c => c.Timeout, Times.Never); // Should be called just-in-time
        authenticationConfig.SetupGet(c => c.Timeout).Returns(new TimeSpan(666));
        authenticationConfig.SetupGet(c => c.AnonymousClaimCacheTime).Returns(TimeSpan.FromHours(1));

        target.Value.Should().Be(new TimeSpan(666)); // Act
        target.AnonymousClaimCacheTime.Should().Be(TimeSpan.FromHours(1)); // Act
    }
}
