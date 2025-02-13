using FluentAssertions;
using Frontend.SharedFeatures.Api.Features.LicenseInfo;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.LicenseInfo;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.SharedFeatures.Api.Tests.Features.LicenseInfo;

public class LicenseInfoControllerTests
{
    private readonly LicenseInfoController target;
    private readonly Mock<ILicenseInfoServiceInternal> licenseInfoServiceInternalMock;
    private readonly TestLogger<LicenseInfoController> log;
    private readonly CancellationToken ct;
    private readonly ExecutionMode mode;

    public LicenseInfoControllerTests()
    {
        licenseInfoServiceInternalMock = new Mock<ILicenseInfoServiceInternal>();
        log = new TestLogger<LicenseInfoController>();
        target = new LicenseInfoController(licenseInfoServiceInternalMock.Object, log);

        ct = new CancellationTokenSource().Token;
        mode = TestExecutionMode.Get();
    }

    [Fact]
    public async Task Get_ShouldReturnLicenseInfoResponse()
    {
        // Setup
        var license = new LicenseInfoModel()
        {
            AcceptanceNeeded = true,
        };
        licenseInfoServiceInternalMock.Setup(x => x.GetLicenceComplianceAsync(It.IsAny<ExecutionMode>())).ReturnsAsync(license);

        // Act
        var result = (OkObjectResult)await target.Get(ct);

        // Assert
        result.Value.Should().BeEquivalentTo(new
        {
            acceptanceNeeded = true,
        });
    }

    [Fact]
    public async Task Get_ShouldLogError_And_ReturnOk_OnPosApiException()
    {
        // Setup
        var exception = new PosApiException(message: "error", posApiCode: 102, posApiMessage: "pos api error");
        licenseInfoServiceInternalMock.Setup(x => x.GetLicenceComplianceAsync(It.IsAny<ExecutionMode>())).ThrowsAsync(exception);

        // Act
        var result = await target.Get(ct);

        // Assert
        result.Should().BeOfType<BadRequestObjectResult>();
        log.Logged.Single().Verify(LogLevel.Error, exception);
    }

    [Fact]
    public async Task Get_ShouldLogError_OnGeneralException()
    {
        // Setup
        var exception = new Exception(message: "error");
        licenseInfoServiceInternalMock.Setup(x => x.GetLicenceComplianceAsync(It.IsAny<ExecutionMode>())).ThrowsAsync(exception);

        // Act
        var result = await target.Get(ct);

        // Assert
        result.Should().BeOfType<BadRequestObjectResult>();
        log.Logged.Single().Verify(LogLevel.Error, exception);
    }
}
