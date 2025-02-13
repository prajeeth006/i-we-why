using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Diagnostics.Health;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.Globalization.Configuration;
using Frontend.Vanilla.Features.Globalization.Diagnostics;
using Frontend.Vanilla.ServiceClients.Services.Common.Languages;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Globalization.Diagnostics;

public class PosApiSupportedLanguagesHealthCheckTests
{
    private IHealthCheck target;
    private Mock<ILanguagesServiceClient> languagesServiceClient;
    private Mock<IGlobalizationConfiguration> globalizationConfiguration;
    private CancellationToken ct;

    public PosApiSupportedLanguagesHealthCheckTests()
    {
        languagesServiceClient = new Mock<ILanguagesServiceClient>();
        globalizationConfiguration = new Mock<IGlobalizationConfiguration>();
        ct = new CancellationTokenSource().Token;
        target = new PosApiSupportedLanguagesHealthCheck(languagesServiceClient.Object, globalizationConfiguration.Object);

        languagesServiceClient.Setup(x => x.GetCachedAsync(ExecutionMode.Async(ct))).ReturnsAsync(new[] { new Language("it-IT") });
    }

    [Fact]
    public void ShouldExposeCorrectMetadata()
        => target.Metadata.Should().NotBeNull().And.BeSameAs(target.Metadata, "should be singleton");

    [Fact]
    public async Task ShouldPass_IfNotContainsUnsopportedLanguages()
    {
        globalizationConfiguration.SetupGet(c => c.AllowedLanguages).Returns(new[]
        {
            TestLanguageInfo.Get("it-IT"),
        });

        // Act
        var result = await target.ExecuteAsync(ct);

        result.Should().BeSameAs(HealthCheckResult.Success);
    }

    [Fact]
    public async Task ShouldFail_IfContainsUnsupportedLanguages()
    {
        globalizationConfiguration.SetupGet(c => c.AllowedLanguages).Returns(new[]
        {
            TestLanguageInfo.Get("ar-MA"),
            TestLanguageInfo.Get("it-IT"),
            TestLanguageInfo.Get("mn-MN"),
        });

        // Act
        var result = await target.ExecuteAsync(ct);

        result.Error.Should().Be("These languages are configured in Vanilla but not supported by PosAPI: ar-MA, mn-MN.");
        result.Details.Should().BeNull();
    }
}
