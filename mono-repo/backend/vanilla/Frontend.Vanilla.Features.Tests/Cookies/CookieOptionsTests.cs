#nullable enable

using System;
using System.Collections;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Xunit;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Cookies;

public sealed class CookieLocationOptionsTests
{
    private readonly CookieLocationOptions target = new ();

    [Fact]
    public void Constructor_ShouldSetReasonableDefaults()
    {
        target.Domain.Should().Be(CookieDomain.Label);
        target.Path.Should().Be("/");
    }

    [Theory, ValuesData(CookieDomain.Label, CookieDomain.Full)]
    public void Domain_ShouldSupportValues(CookieDomain domain)
    {
        target.Domain = domain;
        target.Domain.Should().Be(domain); // Act
    }

    [Fact]
    public void Domain_ShouldThrow_IfInvalid()
        => new Action(() => target.Domain = (CookieDomain)66)
            .Should().Throw<ArgumentException>();

    [Theory, ValuesData("/", "/auth/login")]
    public void Path_ShouldSupportValues(string path)
    {
        target.Path = path;
        target.Path.Should().Be(path); // Act
    }

    [Theory, ValuesData(null, "", "  ", "no-slash")]
    public void Path_ShouldThrow_IfInvalid(string path)
        => new Action(() => target.Path = path)
            .Should().Throw<ArgumentException>();

    [Theory]
    [InlineData(CookieDomain.Full)]
    [InlineData(CookieDomain.Label)]
    [InlineData(CookieDomain.Special)]
    public void ToString_ShouldOutputProperties(CookieDomain domain)
    {
        target.Domain = domain;
        target.Path = "/page";

        if (domain == CookieDomain.Special)
        {
            target.SpecialDomainValue = "special";
            target.ToString().Should().Be($"Domain={domain}, Path=/page, SpecialDomainValue=special");

            return;
        }

        target.ToString().Should().Be($"Domain={domain}, Path=/page");
    }
}

public sealed class CookieOptionsTests
{
    private readonly CookieSetOptions target = new ();

    [Fact]
    public void Constructor_ShouldSetReasonableDefaults()
    {
        target.Domain.Should().Be(CookieDomain.Label);
        target.Path.Should().Be("/");
        target.Expires.Should().BeNull();
        target.MaxAge.Should().BeNull();
        target.HttpOnly.Should().BeFalse();
        target.SameSite.Should().Be(SameSiteFlag.None);
    }

    public static readonly IEnumerable ExpiresValues = new object?[] { null, TestTime.GetRandomUtc() };

    [Theory, MemberValuesData(nameof(ExpiresValues))]
    public void Expires_ShouldSupportValues(UtcDateTime? expires)
    {
        target.Expires = expires;
        target.Expires.Should().Be(expires); // Act
    }

    public static readonly IEnumerable MaxAgeValues = new object?[] { null, TimeSpan.FromSeconds(66) };

    [Theory, MemberValuesData(nameof(MaxAgeValues))]
    public void MaxAge_ShouldSupportValues(TimeSpan? maxAge)
    {
        target.MaxAge = maxAge;
        target.MaxAge.Should().Be(maxAge); // Act
    }

    [Theory, ValuesData(0, -66)]
    public void MaxAge_ShouldThrow_IfInvalid(int maxAge)
        => new Action(() => target.MaxAge = TimeSpan.FromSeconds(maxAge))
            .Should().Throw<ArgumentException>();

    [Theory, BooleanData]
    public void HttpOnly_ShouldSupportValues(bool httpOnly)
    {
        target.HttpOnly = httpOnly;
        target.HttpOnly.Should().Be(httpOnly); // Act
    }

    [Theory, ValuesData(SameSiteFlag.Lax, SameSiteFlag.None, SameSiteFlag.Strict, SameSiteFlag.Unspecified)]
    public void SameSite_ShouldSupportValues(SameSiteFlag domain)
    {
        target.SameSite = domain;
        target.SameSite.Should().Be(domain); // Act
    }

    [Fact]
    public void SameSite_ShouldThrow_IfInvalid()
        => new Action(() => target.SameSite = (SameSiteFlag)66)
            .Should().Throw<ArgumentException>();

    [Theory, ValuesData(CookieDomain.Full, CookieDomain.Label)]
    public void ToString_ShouldOutputProperties(CookieDomain domain)
    {
        target.Domain = domain;
        target.Path = "/page";
        target.MaxAge = TimeSpan.FromSeconds(12);
        target.Expires = new UtcDateTime(2001, 2, 3, 4, 5, 6);

        // Act
        target.ToString().Should().Be($"Domain={domain}, Path=/page, Expires=2001-02-03T04:05:06.0000000Z, MaxAge=00:00:12, HttpOnly=False");
    }
}

public class CookieFlagsTests
{
    [Fact]
    public void CookieDomain_Default_ShouldBeLabel()
        => default(CookieDomain).Should().Be(CookieDomain.Label);

    [Fact]
    public void SameSite_Default_ShouldBeNone()
        => default(SameSiteFlag).Should().Be(SameSiteFlag.None);
}
