using System;
using System.Security.Claims;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Security;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Claims;

public class ClaimsUserTimeTransformerTests
{
    [Fact]
    public void ShouldConvertBasedOnUserClaims()
    {
        const string timeZoneId = "Ekaterinburg Standard Time";
        var user = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim(PosApiClaimTypes.TimeZoneId, timeZoneId) }));
        var time = new UtcDateTime(2001, 2, 3, 14, 15, 16);
        var userDateTimeOffset = new DateTimeOffset(2001, 2, 3, 19, 15, 16, TimeSpan.FromHours(5));
        var target = new ClaimsUserTimeTransformer(Mock.Of<ICurrentUserAccessor>(a => a.User == user));

        // Act
        var localTime = target.ToUserDateTimeOffset(time);

        localTime.Should().Be(userDateTimeOffset);
    }
}
