using System.IO.Compression;
using FluentAssertions;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.App;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Cookies;

public class CookieConfigurationTests
{
    private ICookieConfiguration target;
    private Mock<IEnvironmentProvider> environmentProvider;
    private Mock<ICookieSameSiteProvider> sameSiteProvider;
    private AppConfiguration appConfig;

    public CookieConfigurationTests()
    {
        environmentProvider = new Mock<IEnvironmentProvider>();
        sameSiteProvider = new Mock<ICookieSameSiteProvider>();
        appConfig = new AppConfiguration(false, new CompressionLevelOptions(CompressionLevel.Fastest, CompressionLevel.Fastest), false, []);
        target = new CookieConfiguration(environmentProvider.Object, () => sameSiteProvider.Object, () => appConfig);
    }

    [Theory, BooleanData]
    public void Secure_ShouldDelegate(bool value)
    {
        appConfig.UsesHttps = value;

        // Act
        target.Secure.Should().Be(value);
    }

    [Fact]
    public void CurrentLabelDomain_ShouldPrependDot()
    {
        environmentProvider.SetupGet(p => p.CurrentDomain).Returns("bwin.com");

        // Act
        target.CurrentLabelDomain.Should().Be(".bwin.com");
    }
}
