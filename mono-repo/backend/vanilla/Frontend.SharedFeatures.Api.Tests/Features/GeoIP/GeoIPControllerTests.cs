using FluentAssertions;
using Frontend.SharedFeatures.Api.Features.GeoIP;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.SharedFeatures.Api.Tests.Features.GeoIP;

public class GeoIPControllerTests
{
    private readonly GeoIpController target;
    private readonly Mock<IGeoIPDslProvider> geoIPDslProviderMock;
    private readonly TestLogger<GeoIpController> log;
    private readonly CancellationToken ct;
    private readonly ExecutionMode mode;

    public GeoIPControllerTests()
    {
        geoIPDslProviderMock = new Mock<IGeoIPDslProvider>();
        log = new TestLogger<GeoIpController>();
        target = new GeoIpController(geoIPDslProviderMock.Object, log);

        ct = new CancellationTokenSource().Token;
        mode = TestExecutionMode.Get();
    }

    [Fact]
    public void Get_ShouldReturnBonusAwardResponse()
    {
        // Setup
        geoIPDslProviderMock.Setup(x => x.GetCountryName()).Returns("US");

        // Act
        var result = (OkObjectResult)target.Get();

        // Assert
        result.Value.Should().BeEquivalentTo(new
        {
            countryName = "US",
        });
    }

    [Fact]
    public void Get_ShouldLogError_OnGeneralException()
    {
        // Setup
        var exception = new Exception(message: "error");
        geoIPDslProviderMock.Setup(x => x.GetCountryName()).Throws(exception);

        // Act
        var result = target.Get();

        // Assert
        result.Should().BeOfType<BadRequestObjectResult>();
        log.Logged.Single().Verify(LogLevel.Error, exception);
    }
}
