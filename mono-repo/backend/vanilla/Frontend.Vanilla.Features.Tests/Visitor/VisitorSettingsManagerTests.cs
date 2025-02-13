using System;
using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Core.Caching;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.Visitor;
using Frontend.Vanilla.Testing.Moq;
using Frontend.Vanilla.Testing.Xunit;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Visitor;

public class VisitorSettingsManagerTests
{
    private IVisitorSettingsManager target;
    private Mock<IHttpContextAccessor> httpContextAccessor;
    private Mock<ICookieHandler> cookieHandler;

    public VisitorSettingsManagerTests()
    {
        httpContextAccessor = new Mock<IHttpContextAccessor>();
        cookieHandler = new Mock<ICookieHandler>();

        var serviceProviderMock = new Mock<IServiceProvider>();
        serviceProviderMock.Setup(_ => _.GetService(typeof(IRequestScopedValuesProvider))).Returns(new RequestScopedValuesProvider());
        httpContextAccessor.Setup(c => c.HttpContext.RequestServices).Returns(serviceProviderMock.Object);

        target = new VisitorSettingsManager(cookieHandler.Object, httpContextAccessor.Object);
    }

    [Theory, ValuesData(null, "", "  ")]
    public void Getter_ShouldCreateEmptySettings_IfNoCookie(string cookieValue)
    {
        cookieHandler.Setup(o => o.GetValue(VisitorSettingsManager.CookieName)).Returns(cookieValue);

        // Act
        var settings = target.Current;

        settings.Should().BeSameAs(target.Current, "should be cached")
            .And.BeEquivalentTo(new VisitorSettings());
        cookieHandler.VerifyWithAnyArgs(o => o.Set(null, null, null), Times.Never);
    }

    public static readonly IEnumerable<object[]> PropertyTestCases = new[]
    {
        new object[] { "cid=sw-KE", new VisitorSettings().With(cultureName: "sw-KE") },
        new object[] { "vc=66", new VisitorSettings().With(visitCount: 66) },
        new object[] { "sst=2001-12-31T09:45:32.6780000Z", new VisitorSettings().With(sessionStartTime: new UtcDateTime(2001, 12, 31, 9, 45, 32, 678)) },
        new object[] { "psst=2001-12-31T09:45:32.6780000Z", new VisitorSettings().With(previousSessionStartTime: new UtcDateTime(2001, 12, 31, 9, 45, 32, 678)) },
    };

    public static readonly IEnumerable<object[]> ReadCookieTestCases = PropertyTestCases.Append(
        new object[] { "", new VisitorSettings() },
        new object[] { "cid=&vc=&sst=&psst=", new VisitorSettings() },
        new object[] { "cid=sw-KE&vc=666", new VisitorSettings().With(cultureName: "sw-KE", visitCount: 666) });

    [Theory, MemberData(nameof(ReadCookieTestCases))]
    internal void Getter_ShouldReadFromCookie(string cookieValue, VisitorSettings expected)
    {
        cookieHandler.Setup(o => o.GetValue(VisitorSettingsManager.CookieName)).Returns(cookieValue);

        // Act
        var settings = target.Current;

        settings.Should().BeEquivalentTo(expected);
        settings.Should().BeSameAs(target.Current, "should be cached");
    }

    [Theory, MemberData(nameof(PropertyTestCases))]
    internal void Setter_ShouldSaveToCookie(string expectedCookie, VisitorSettings settings)
    {
        // Act
        target.Current = settings;

        cookieHandler.Verify(h =>
            h.Set(VisitorSettingsManager.CookieName, It.IsNotNull<string>(), new CookieSetOptions { HttpOnly = true, MaxAge = TimeSpan.FromDays(10 * 365) }));
        ((string)cookieHandler.Invocations.Single().Arguments[1]).Split('&').Should().HaveCount(4).And.Contain(expectedCookie);
        target.Current.Should().BeSameAs(settings, "should be cached");
    }

    [Theory, BooleanData]
    public void Received_ShouldBeIndepdendentFromCurrent(bool getCurrentFirst)
    {
        cookieHandler.Setup(o => o.GetValue(VisitorSettingsManager.CookieName)).Returns("cid=received");
        var settings = getCurrentFirst ? target.Current : target.Received;
        settings = getCurrentFirst ? target.Received : target.Current;
        target.Current = new VisitorSettings().With(cultureName: "currentSet");
        cookieHandler.Setup(o => o.GetValue(VisitorSettingsManager.CookieName)).Returns("cid=newCookie");

        // Act
        target.Received.CultureName.Should().Be("received");
    }
}
