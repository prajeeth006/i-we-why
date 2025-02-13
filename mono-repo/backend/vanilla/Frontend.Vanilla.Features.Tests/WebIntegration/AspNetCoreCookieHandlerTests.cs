#nullable enable
using System;
using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.EntryWeb.TopLevelDomainCookies;
using Frontend.Vanilla.Features.WebIntegration;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Moq;
using Frontend.Vanilla.Testing.Xunit;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.WebIntegration;

public class AspNetCoreCookieHandlerTests
{
    private readonly ICookieHandler target;
    private readonly Mock<ICookieConfiguration> config;
    private readonly Mock<IHttpContextAccessor> httpContextAccessor;
    private readonly Mock<ITopLevelDomainCookiesConfiguration> topLevelDomainCookiesConfiguration;
    private readonly Mock<ICookiePartitionedStateProvider> cookiePartitionedStateProvider;

    public AspNetCoreCookieHandlerTests()
    {
        config = new Mock<ICookieConfiguration>();
        httpContextAccessor = new Mock<IHttpContextAccessor> { DefaultValue = DefaultValue.Mock };
        topLevelDomainCookiesConfiguration = new Mock<ITopLevelDomainCookiesConfiguration>();
        cookiePartitionedStateProvider = new Mock<ICookiePartitionedStateProvider>();
        target = new AspNetCoreCookieHandler(config.Object, httpContextAccessor.Object, () => topLevelDomainCookiesConfiguration.Object, () => cookiePartitionedStateProvider.Object);

        config.SetupGet(c => c.CurrentLabelDomain).Returns(".bwin.com");
        config.SetupGet(s => s.DefaultSameSiteMode).Returns(SameSiteFlag.None);
        topLevelDomainCookiesConfiguration.SetupGet(c => c.SetCookieDomain).Returns(new CookieDomainConfiguration()
        {
            Cookies = new string[] { },
            Domain = string.Empty,
        });
    }

    private Mock<IResponseCookies> ResponseCookies => Mock.Get(httpContextAccessor.Object.HttpContext!.Response.Cookies);

    [Theory, ValuesData("", "bwin", "suberror=503")]
    public void GetValue_ShouldReturnRequestCookie(string value)
    {
        httpContextAccessor.SetupGet(a => a.HttpContext!.Request.Cookies["test"]).Returns(value);

        // Act
        target.GetValue("test").Should().Be(value);
    }

    [Theory, ValuesData("", "bwin")]
    public void GetValue_ShouldReturnResponseCookieIfNotYetAvailableInRequest(string value)
    {
        var headers = new HeaderDictionary(new Dictionary<string, StringValues>
        {
            {
                "Set-Cookie",
                $"NativeApp={value}"
            },
        }) as IHeaderDictionary;

        httpContextAccessor.SetupGet(a => a.HttpContext!.Response.Headers).Returns(headers);
        // Act
        target.GetValue("NativeApp").Should().Be(value);
    }

    [Fact]
    public void GetValue_ShouldReturnNull_IfNoCookie()
        => target.GetValue("test").Should().BeNull();

    public static IEnumerable<object?[]> SetWithDefaultsTestCases
        => TestValues.Booleans.ToTestCases()
            .CombineWith(null, "", "bwin")
            .CombineWith(TestValues.Booleans);

    [Theory, MemberData(nameof(SetWithDefaultsTestCases))]
    public void Set_ShouldSetCookie_WithDefaults(bool nullOptions, string value, bool secure)
    {
        config.SetupGet(c => c.Secure).Returns(secure);

        // Act
        target.Set("test", value, nullOptions ? null : new CookieSetOptions());

        VerifyResponseCookieSet(value: value, secure: secure);
        cookiePartitionedStateProvider.Verify(c => c.SetPartitionedState(It.IsAny<CookieOptions>()));
    }

    public static IEnumerable<object?[]> TestDomains => new[]
    {
        new object?[] { CookieDomain.Label, ".bwin.com" },
        new object?[] { CookieDomain.Full, null },
        new object?[] { CookieDomain.Special, ".frodo.com" },
    };

    [Theory, MemberData(nameof(TestDomains))]
    public void Set_ShouldSetCookie_WithOptions_Location(CookieDomain inputDomain, string? expectedDomain)
    {
        var options = new CookieSetOptions { Domain = inputDomain, Path = "/en/page", SpecialDomainValue = expectedDomain };

        // Act
        target.Set("test", "val", options);

        VerifyResponseCookieSet(domain: expectedDomain, path: "/en/page");
    }

    public static IEnumerable<object?[]> SetWithOptionsTestCases
        => TestValues.Booleans.ToTestCases()
            .CombineWith(Enum<SameSiteFlag>.Values)
            .CombineWith(null, 22)
            .CombineWith(null, 33);

    [Theory, MemberData(nameof(SetWithOptionsTestCases))]
    public void Set_ShouldSetCookie_WithOptions_Flags(bool httpOnly, SameSiteFlag sameSite, int? maxAgeSeconds, int? expiresTicks)
    {
        var options = new CookieSetOptions
        {
            HttpOnly = httpOnly,
            SameSite = sameSite,
            MaxAge = maxAgeSeconds.IfNotNull(s => TimeSpan.FromSeconds(s)),
            Expires = expiresTicks.IfNotNull(t => new UtcDateTime(new DateTime(t, DateTimeKind.Utc))),
        };

        // Act
        target.Set("test", "val", options);

        VerifyResponseCookieSet(httpOnly: httpOnly, maxAge: options.MaxAge, expires: expiresTicks.IfNotNull(t => new DateTimeOffset(t, TimeSpan.Zero)), sameSiteFlag: sameSite);
    }

    [Fact]
    public void Set_ShouldSetCookie_WithDomainFromConfig()
    {
        var options = new CookieSetOptions { Domain = CookieDomain.Label, SpecialDomainValue = "betmgm.com" };
        topLevelDomainCookiesConfiguration.SetupGet(c => c.SetCookieDomain).Returns(new CookieDomainConfiguration
        {
            Cookies = new[] { "test", "topdomain" },
            Domain = ".testdomain.com",
        });

        // Act
        target.Set("test", "val", options);

        VerifyResponseCookieSet(domain: ".testdomain.com");
    }

    private void VerifyResponseCookieSet(
        string value = "val",
        DateTimeOffset? expires = null,
        TimeSpan? maxAge = null,
        string? domain = ".bwin.com",
        string path = "/",
        bool httpOnly = false,
        bool secure = false,
        SameSiteFlag sameSiteFlag = SameSiteFlag.None)
    {
        ResponseCookies.Verify(c => c.Append("test", value, It.IsNotNull<CookieOptions>()));
        ResponseCookies.Invocations.Single().Arguments[2].Should().BeEquivalentTo(new CookieOptions
        {
            Domain = domain,
            Path = path,
            Expires = expires,
            MaxAge = maxAge,
            HttpOnly = httpOnly,
            Secure = secure,
            SameSite = (SameSiteMode)sameSiteFlag,
        });
    }

    [Theory, BooleanData]
    public void Delete_ShouldExpireCookie_WithDefaults(bool nullOptions)
    {
        // Act
        target.Delete("test", nullOptions ? null : new CookieLocationOptions());

        VerifyResponseCookieDeleted(domain: ".bwin.com", path: "/");
        cookiePartitionedStateProvider.Verify(c => c.SetPartitionedState(It.IsAny<CookieOptions>()));
    }

    [Theory, MemberData(nameof(TestDomains))]
    public void Delete_ShouldExpireCookie_WithOptions(CookieDomain inputDomain, string expectedDomain)
    {
        var options = new CookieLocationOptions { Domain = inputDomain, Path = "/en/page", SpecialDomainValue = expectedDomain };

        // Act
        target.Delete("test", options);

        VerifyResponseCookieDeleted(expectedDomain, path: "/en/page");
    }

    private void VerifyResponseCookieDeleted(string domain, string path)
    {
        ResponseCookies.Verify(c => c.Delete("test", It.IsNotNull<CookieOptions>()));
        ResponseCookies.Invocations.Single().Arguments[1].Should().BeEquivalentTo(new CookieOptions
        {
            Domain = domain,
            Path = path,
        });
    }
}
