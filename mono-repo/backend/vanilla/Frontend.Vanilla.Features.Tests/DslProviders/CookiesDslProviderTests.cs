using System;
using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.DslProviders;
using Frontend.Vanilla.Features.DslProviders.Time;
using Frontend.Vanilla.Features.SuspiciousRequest;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Xunit;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DslProviders;

public class CookiesDslProviderTests
{
    private readonly ICookiesDslProvider target;
    private readonly Mock<ICookieHandler> cookieHandler;
    private readonly Mock<ICookieConfiguration> config;
    private readonly Mock<IHttpContextAccessor> httpContextAccessor;
    private readonly Mock<IDslTimeConverter> dslTimeConverter;
    private Mock<ISuspiciousRequestConfiguration> suspiciousRequestConfigurationMock;
    private Mock<IDynaConCookieConfiguration> dynacConCookieConfiguration;

    public CookiesDslProviderTests()
    {
        dynacConCookieConfiguration = new Mock<IDynaConCookieConfiguration>();
        config = new Mock<ICookieConfiguration>();
        httpContextAccessor = new Mock<IHttpContextAccessor>();
        cookieHandler = new Mock<ICookieHandler>();
        dslTimeConverter = new Mock<IDslTimeConverter>();
        suspiciousRequestConfigurationMock = new Mock<ISuspiciousRequestConfiguration>();
        target = new CookiesDslProvider(
            cookieHandler.Object,
            config.Object,
            httpContextAccessor.Object,
            dslTimeConverter.Object,
            suspiciousRequestConfigurationMock.Object,
            dynacConCookieConfiguration.Object);

        config.SetupGet(c => c.CurrentLabelDomain).Returns(".bwin.com");
        httpContextAccessor.SetupGet(a => a.HttpContext.Request.Host)
            .Returns(new HostString("qa2.sports.bwin.com", 66));
        suspiciousRequestConfigurationMock.SetupGet(m => m.CookieStringRules)
            .Returns(new Dictionary<string, StringRule>
            {
                ("Rule1", new StringRule("'(?![0-9][0-9a-fA-F]+)", "Cookie string contains unallowed character")),
            });
        dynacConCookieConfiguration.SetupGet(c => c.EncodeValueInCookieDsl).Returns(Array.Empty<string>());
    }

    [Fact]
    public void LabelDomain_ShouldGetFromConfig()
        => target.LabelDomain.Should().Be(".bwin.com");

    [Fact]
    public void FullDomain_ShouldGetFromConfig()
        => target.FullDomain.Should().Be("qa2.sports.bwin.com");

    [Theory, ValuesData("value", "  ", "", null)]
    public void Get_ShouldGetUnderlyingCookieValue(string value)
    {
        cookieHandler.Setup(h => h.GetValue("test")).Returns(value);

        // Act
        var result = target.Get("test");

        result.Should().Be(value);
    }

    [Fact]
    public void SetSession_ShouldSetCookie()
    {
        // Act
        target.SetSession("test", "bwin");

        cookieHandler.Verify(h => h.Set("test", "bwin", null));
    }

    [Fact]
    public void SetPersistent_ShouldSetCookie_WithRelativeExpiration()
    {
        var (expiration, magAge) = SetupRelativeExpiration();

        // Act
        target.SetPersistent("test", "bwin", expiration);

        cookieHandler.Verify(h => h.Set("test", "bwin", new CookieSetOptions { MaxAge = magAge }));
    }

    private (decimal, TimeSpan) SetupRelativeExpiration()
    {
        var expiration = CookiesDslProvider.AbsoluteExpirationBoundary - 666;
        dslTimeConverter.Setup(c => c.FromDslToTimeSpan(expiration)).Returns(new TimeSpan(777));

        return (expiration, new TimeSpan(777));
    }

    [Fact]
    public void SetPersistent_ShouldSetCookie_WithAbsoluteExpiration()
    {
        var (expiration, time) = SetupAbsoluteExpiration();

        // Act
        target.SetPersistent("test", "bwin", expiration);

        cookieHandler.Verify(h => h.Set("test", "bwin", new CookieSetOptions { Expires = time }));
    }

    private (decimal, UtcDateTime) SetupAbsoluteExpiration()
    {
        var expiration = CookiesDslProvider.AbsoluteExpirationBoundary + 666;
        var time = TestTime.GetRandomUtc();
        dslTimeConverter.Setup(c => c.FromDslToTime(expiration)).Returns(time.ValueWithOffset);

        return (expiration, time);
    }

    [Theory, ValuesData(0, -1)]
    public void SetPersistent_ShouldThrow_IfExpirationLessOrEqualToZero(int expiration)
        => new Action(() => target.SetPersistent("text", "bwin", expiration))
            .Should().Throw()
            .Which.Message.Should().ContainAll("positive number", expiration);

    [Fact]
    public void Delete_ShouldDeleteCookie()
    {
        // Act
        target.Delete("test");

        cookieHandler.Verify(h => h.Delete("test", null));
    }

    [Fact]
    public void AbsoluteExpirationBoundary_ShouldBeYear2000()
        => CookiesDslProvider.AbsoluteExpirationBoundary.Should()
            .Be(new DateTimeOffset(2000, 1, 1, 0, 0, 0, TimeSpan.Zero).ToUnixTimeSeconds());

    [Theory]
    [InlineData(false, -1)]
    [InlineData(false, -123)]
    [InlineData(true, -1)]
    [InlineData(true, -123)]
    public void Set_ShouldDeleteCookie_IfNegativeExpiration(bool httpOnly, int expiration)
    {
        // Act
        target.Set("test", "whatever", expiration, httpOnly, ".bwin.com", "/page");

        cookieHandler.Verify(h => h.Delete("test", It.Is<CookieLocationOptions>(
            o => o.Domain == CookieDomain.Label && o.Path == "/page")));
    }

    public static readonly IEnumerable<object[]> SetTestCases =
        from domain in new[]
        {
            new object[] { ".bwin.com", CookieDomain.Label, },
            new object[] { "qa2.sports.bwin.com", CookieDomain.Full },
        }
        from httpOnly in new[] { true, false }
        select domain.Append(httpOnly).ToArray();

    [Theory, MemberData(nameof(SetTestCases))]
    public void Set_ShouldSetSessionCookie_IfZeroExpiration(string inputDomain, CookieDomain expectedDomain, bool httpOnly)
    {
        // Act
        target.Set("test", "bwin", 0, httpOnly, inputDomain, "/page");

        cookieHandler.Verify(h => h.Set("test", "bwin", new CookieSetOptions
        {
            Domain = expectedDomain,
            Path = "/page",
            HttpOnly = httpOnly,
        }));
    }

    [Theory, MemberData(nameof(SetTestCases))]
    public void Set_ShouldSetPersistentCookie_WithRelativeExpiration(string inputDomain, CookieDomain expectedDomain, bool httpOnly)
    {
        var (expiration, magAge) = SetupRelativeExpiration();

        // Act
        target.Set("test", "bwin", expiration, httpOnly, inputDomain, "/page");

        cookieHandler.Verify(h => h.Set("test", "bwin", new CookieSetOptions
        {
            Domain = expectedDomain,
            Path = "/page",
            HttpOnly = httpOnly,
            MaxAge = magAge,
        }));
    }

    [Theory, MemberData(nameof(SetTestCases))]
    public void Set_ShouldSetPersistentCookie_WithAbsoluteExpiration(string inputDomain, CookieDomain expectedDomain, bool httpOnly)
    {
        var (expiration, time) = SetupAbsoluteExpiration();

        // Act
        target.Set("test", "bwin", expiration, httpOnly, inputDomain, "/page");

        cookieHandler.Verify(h => h.Set("test", "bwin", new CookieSetOptions
        {
            Domain = expectedDomain,
            Path = "/page",
            HttpOnly = httpOnly,
            Expires = time,
        }));
    }

    [Fact]
    public void Set_ShouldThrow_IfUnsupportedDomain()
        => new Action(() => target.Set("test", "bwin", 0, false, "party.com", "/page"))
            .Should().Throw()
            .Which.Message.Should().ContainAll("label domain '.bwin.com'", "full domain 'qa2.sports.bwin.com'", "'party.com'");

    [Theory, MemberData(nameof(SetTestCases))]
    public void Set_ShouldThrow_IfUnallowedCharacterIsPresent(string inputDomain, CookieDomain expectedDomain, bool httpOnly)
        => new Action(() => target.Set("test", "'*alert(1)*'z", 0, httpOnly, inputDomain, $"/{expectedDomain.ToString()}"))
            .Should().Throw()
            .Which.Message.Should().Be(suspiciousRequestConfigurationMock.Object.CookieStringRules.Values.First().Description);
}
