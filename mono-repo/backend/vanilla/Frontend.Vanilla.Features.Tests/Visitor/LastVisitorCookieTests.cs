using System;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.Visitor;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Visitor;

public class LastVisitorCookieTests
{
    private ILastVisitorCookie target;
    private Mock<ICookieHandler> cookieHandler;
    private TestLogger<LastVisitorCookie> log;

    public LastVisitorCookieTests()
    {
        cookieHandler = new Mock<ICookieHandler>();
        log = new TestLogger<LastVisitorCookie>();
        target = new LastVisitorCookie(cookieHandler.Object, log);
    }

    [Theory]
    [InlineData(null, null, false)]
    [InlineData("Chuck Norris", "Chuck Norris", false)]
    [InlineData("  Batman ", "Batman", true)]
    [InlineData("  ", null, true)]
    [InlineData("", null, true)]
    public void GetValueTest(string cookieValue, string expected, bool expectedWarning)
    {
        cookieHandler.Setup(h => h.GetValue(LastVisitorCookie.Name)).Returns(cookieValue);

        // Act
        var result = target.GetValue();

        (result?.Value).Should().Be(expected);

        if (expectedWarning)
            log.Logged.Single().Verify(LogLevel.Warning, ("invalidValue", cookieValue), ("value", expected));
        else
            log.VerifyNothingLogged();
    }

    [Fact]
    public void SetValueTest()
    {
        // Act
        target.SetValue("Chuck Norris");

        cookieHandler.Verify(h => h.Set(LastVisitorCookie.Name, "Chuck Norris", new CookieSetOptions { MaxAge = new TimeSpan(3650, 0, 0, 0) }));
    }
}
