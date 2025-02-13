using System;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Diagnostics.Health;
using Frontend.Vanilla.ServiceClients.Infrastructure.Diagnostics;
using Frontend.Vanilla.ServiceClients.Services.Common;
using Frontend.Vanilla.ServiceClients.Services.Common.Languages;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Infrastructure.Diagnostics;

public sealed class PosApiHealthCheckTests
{
    private IHealthCheck target;
    private Mock<IPosApiCommonServiceInternal> posApiCommonService;
    private Mock<ITrafficHealthState> healthState;
    private CancellationToken ct;

    public PosApiHealthCheckTests()
    {
        posApiCommonService = new Mock<IPosApiCommonServiceInternal>();
        healthState = new Mock<ITrafficHealthState>();
        ct = TestCancellationToken.Get();
        target = new PosApiHealthCheck(healthState.Object, posApiCommonService.Object);
    }

    [Fact]
    public void ShouldExposeCorrectMetadata()
        => target.Metadata.Should().NotBeNull().And.BeSameAs(target.Metadata, "should be singleton");

    private const string ExpectedFreshResultDetails = "Based on FRESH request to GET languages executed by health check itself.";
    private const string ExpectedCachedResultDetails = "Based on CACHED result of recent request to GET languages executed by health check itself.";

    [Theory]
    [InlineData(66, null)]
    [InlineData(0, "No languages received from the endpoint.")]
    public async Task ShouldPass_IfServiceReturnsData(int dataCount, string expectedError)
    {
        posApiCommonService.Setup(s => s.GetFreshLanguagesAsync(ct)).ReturnsAsync(new Language[dataCount]);

        var result = await target.ExecuteAsync(ct); // Act

        result.Error.Should().Be(expectedError);
        result.Details.Should().Be(ExpectedFreshResultDetails);
        VerifyHealthStateSet(expectedError);
    }

    [Fact]
    public async Task ShouldFail_IfServiceFails()
    {
        var ex = new Exception("PosAPI Error");
        posApiCommonService.Setup(s => s.GetFreshLanguagesAsync(ct)).ThrowsAsync(ex);

        var result = await target.ExecuteAsync(ct); // Act

        result.Error.Should().BeSameAs(ex);
        VerifyHealthStateSet(ex);
    }

    [Fact]
    public async Task ShouldMakeFreshHealthRequest_IfTrafficStateContainsNegativeResult()
    {
        healthState.Setup(s => s.Get()).Returns(HealthCheckResult.CreateFailed("Oops :("));
        posApiCommonService.Setup(s => s.GetFreshLanguagesAsync(ct)).ReturnsAsync(new Language[66]);

        var result = await target.ExecuteAsync(ct); // Act

        result.Error.Should().BeNull();
        result.Details.Should().Be(ExpectedFreshResultDetails);
        posApiCommonService.Verify(s => s.GetFreshLanguagesAsync(ct));
        VerifyHealthStateSet(error: null);
    }

    private void VerifyHealthStateSet(object error)
        => healthState.Verify(s => s.Set(It.Is<HealthCheckResult>(r => Equals(r.Error, error) && r.Details.Equals(ExpectedCachedResultDetails))));

    [Fact]
    public async Task ShouldReturnResultFromTraffic_IfItContainsSuccessResult()
    {
        var trafficState = HealthCheckResult.CreateSuccess("Test");
        healthState.Setup(s => s.Get()).Returns(trafficState);

        var result = await target.ExecuteAsync(ct); // Act

        result.Should().BeSameAs(trafficState);
        posApiCommonService.VerifyWithAnyArgs(s => s.GetFreshLanguagesAsync(TestContext.Current.CancellationToken), Times.Never);
        healthState.VerifyWithAnyArgs(s => s.Set(null), Times.Never);
    }
}
