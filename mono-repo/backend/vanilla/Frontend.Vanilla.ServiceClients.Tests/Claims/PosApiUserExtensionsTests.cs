using System;
using System.Runtime.InteropServices;
using System.Security.Claims;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.Testing.Xunit;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Claims;

public class PosApiUserExtensionsTests
{
    private ClaimsPrincipal user;

    public PosApiUserExtensionsTests()
        => user = new ClaimsPrincipal(
            new ClaimsIdentity(
                new[]
                {
                    new Claim(ClaimTypes.Name, "Mickey Mouse"),
                }));

    [Theory]
    [InlineData(false, null, false)]
    [InlineData(false, "false", false)]
    [InlineData(false, "true", false)]
    [InlineData(true, "false", false)]
    [InlineData(true, "true", true)]
    public void IsRealMoneyPlayer_ShouldGetFromClaim_IfAuthenticated(bool authenticated, string claim, bool expected)
    {
        SetAuthenticated(authenticated);
        AddClaim(PosApiClaimTypes.IsRealMoneyPlayer, claim);

        user.IsRealMoneyPlayer().Should().Be(expected); // Act
    }

    [Theory, ValuesData(null, "", "  ", "gibberish")]
    public void IsRealMoneyPlayer_ShouldThrow_IfInvalidClaimOrMissing(string claim)
    {
        SetAuthenticated();
        AddClaim(PosApiClaimTypes.IsRealMoneyPlayer, claim);

        RunThrowTest(user.IsRealMoneyPlayer); // Act
    }

    [Theory]
    [InlineData(null, 0)]
    [InlineData("666", 666)]
    public void GetWorkflowTypeId_ShouldGetFromClaim(string claim, int expected)
    {
        AddClaim(PosApiClaimTypes.WorkflowTypeId, claim);
        user.GetWorkflowTypeId().Should().Be(expected); // Act
    }

    [Fact]
    public void GetWorkflowTypeId_ShouldThrow_IfInvalidClaim()
    {
        AddClaim(PosApiClaimTypes.WorkflowTypeId, "bullshit");
        RunThrowTest(user.GetWorkflowTypeId); // Act
    }

    [Fact]
    public void GetTimeZone_ShouldGetBaseOnClaim()
    {
        AddClaim(PosApiClaimTypes.TimeZoneId, "Ekaterinburg Standard Time");

        // Act
        var timeZone = user.GetTimeZone();
        var isWindows = RuntimeInformation.IsOSPlatform(OSPlatform.Windows);
        if (isWindows)
            timeZone.StandardName.Should().Be("Russia TZ 4 Standard Time");
    }

    [Theory, ValuesData(null, "", "  ", "gibberish")]
    public void GetTimeZone_ShouldThrow_IfInvalidClaimOrMissing(string claim)
    {
        AddClaim(PosApiClaimTypes.TimeZoneId, claim);
        RunThrowTest(user.GetTimeZone); // Act
    }

    [Fact]
    public void ToUserLocalTime_ShouldConvertTime()
    {
        var dateTime = new UtcDateTime(2001, 2, 3, 14, 15, 16);
        AddClaim(PosApiClaimTypes.TimeZoneId, "Ekaterinburg Standard Time");

        // Act
        var localTime = dateTime.ToUserLocalTime(user);

        localTime.DateTime.Should().Be(new DateTime(2001, 2, 3, 19, 15, 16));
        localTime.Offset.Should().Be(TimeSpan.FromHours(5));
    }

    private void AddClaim(string type, string value)
    {
        if (value != null)
            ((ClaimsIdentity)user.Identity).AddClaim(new Claim(type, value));
    }

    private void SetAuthenticated(bool authenticated = true)
    {
        user = new ClaimsPrincipal(new ClaimsIdentity(user.Claims, authenticated ? "authType" : null));
    }

    private static void RunThrowTest<T>(Func<T> act)
        => new Action(() => act()).Should().Throw<InvalidClaimException>();
}
