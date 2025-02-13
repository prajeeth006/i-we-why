using System;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.DslProviders;
using Frontend.Vanilla.Features.Globalization;
using Frontend.Vanilla.Features.Theming;
using Frontend.Vanilla.Features.WebIntegration.Configuration.DynaCon;
using Frontend.Vanilla.ServiceClients.Services.Common;
using Frontend.Vanilla.ServiceClients.Services.Common.ClientInfo;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Xunit;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DslProviders;

public class AppDslProviderTests
{
    private readonly IAppDslProvider target;
    private readonly Mock<IEnvironmentProvider> environmentProvider;
    private readonly Mock<ICurrentProductResolver> currentProductResolver;
    private readonly Mock<ILanguageService> languageService;
    private readonly Mock<IThemeResolver> themeResolver;
    private readonly Mock<IPosApiCommonService> posApiCommoneService;
    private readonly HeaderDictionary headers;

    public AppDslProviderTests()
    {
        environmentProvider = new Mock<IEnvironmentProvider>();
        currentProductResolver = new Mock<ICurrentProductResolver>();
        languageService = new Mock<ILanguageService>();
        languageService.Setup(l => l.Default).Returns(TestLanguageInfo.Get("en-US", routeValue: "en"));
        themeResolver = new Mock<IThemeResolver>();
        posApiCommoneService = new Mock<IPosApiCommonService>();
        themeResolver.Setup(t => t.GetTheme()).Returns("black");
        headers = new HeaderDictionary();
        var httpContextAccessor = Mock.Of<IHttpContextAccessor>(r => r.HttpContext.Request.Headers == headers);

        target = new AppDslProvider(
            environmentProvider.Object,
            currentProductResolver.Object,
            languageService.Object,
            httpContextAccessor,
            themeResolver.Object,
            posApiCommoneService.Object);
    }

    [Theory, BooleanData]
    public void IsProduction_Test(bool value)
    {
        environmentProvider.SetupGet(c => c.IsProduction).Returns(value);
        target.IsProduction.Should().Be(value);
    }

    [Fact]
    public void GetEnvironment_Test()
    {
        environmentProvider.SetupGet(c => c.Environment).Returns("qa1");
        target.Environment.Should().Be("qa1");
    }

    [Fact]
    public void GetLabel_Test()
    {
        environmentProvider.SetupGet(x => x.CurrentLabel).Returns("testLabel");
        target.Label.Should().Be("testLabel");
    }

    [Fact]
    public void GetProduct_Test()
    {
        currentProductResolver.SetupGet(x => x.Product).Returns("testProduct");
        target.Product.Should().Be("testProduct");
    }

    [Fact]
    [Obsolete]
    public void GetDefaultCulture_Test()
        => target.DefaultCulture.Should().Be("en-US");

    [Fact]
    [Obsolete]
    public void GetDefaultCultureToken_Test()
        => target.DefaultCultureToken.Should().Be("en");

    [Theory]
    [InlineData(null, "default")]
    [InlineData("", "default")]
    [InlineData("iframe", "iframe")]
    public void Context_ShouldUseHeaderValue(string headerValue, string expected)
    {
        headers[HttpHeaders.XAppContext] = headerValue;
        target.Context().Should().Be(expected); // Act
    }

    [Fact]
    public void Theme_Test()
    {
        target.Theme.Should().Be("black");
    }

    [Fact]
    public async Task PlatformProductName_Test()
    {
        posApiCommoneService.Setup(x => x.GetClientInformationAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(new ClientInformation(productId: "testweb"));
        (await target.GetPlatformProductNameAsync(It.IsAny<ExecutionMode>())).Should().Be("testweb");
    }
}
