using FluentAssertions;
using Frontend.SharedFeatures.Api.Features.Affordability;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.Affordability;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.Affordability;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Frontend.SharedFeatures.Api.Tests.Features.Affordability;

public class AffordabilityControllerTests
{
    private readonly AffordabilityController target;
    private readonly Mock<IAffordabilityConfiguration> affordabilityConfigurationMock;
    private readonly Mock<IPosApiResponsibleGamingServiceInternal> posApiResponsibleGamingServiceMock;
    private readonly TestLogger<AffordabilityController> log;
    private readonly CancellationToken cancellationToken;

    public AffordabilityControllerTests()
    {
        posApiResponsibleGamingServiceMock = new Mock<IPosApiResponsibleGamingServiceInternal>();
        affordabilityConfigurationMock = new Mock<IAffordabilityConfiguration>();
        log = new TestLogger<AffordabilityController>();
        cancellationToken = new CancellationTokenSource().Token;

        target = new AffordabilityController(affordabilityConfigurationMock.Object, posApiResponsibleGamingServiceMock.Object, log);
    }

    [Fact]
    public async Task Post_ShouldReturnAffordabilitySnapshotDetailsResponse_IfEnabled()
    {
        // Setup
        var snapshotDetails = new AffordabilitySnapshotDetailsResponse
        {
            AffordabilityStatus = "AffordabilityStatus",
            EmploymentGroup = "EmploymentGroup",
        };

        posApiResponsibleGamingServiceMock.Setup(s => s.GetAffordabilitySnapshotDetailsAsync(cancellationToken))
            .ReturnsAsync(snapshotDetails);

        IsFeatureEnabled(true);

        // Act
        var result = (OkObjectResult)await target.SnapshotDetails(cancellationToken);

        // Assert
        result.Value.Should().BeEquivalentTo(new
        {
            snapshotDetails.EmploymentGroup,
            snapshotDetails.AffordabilityStatus,
        });
    }

    [Fact]
    public async Task Post_ShouldReturnEnablementStatus_IfDisabled()
    {
        // Setup
        IsFeatureEnabled(false);

        // Act
        var result = (OkObjectResult)await target.SnapshotDetails(cancellationToken);

        // Assert
        result.Value.Should().BeEquivalentTo(new
        {
            isEnabled = false,
        });
    }

    private void IsFeatureEnabled(bool isEnabled)
        => affordabilityConfigurationMock.Setup(c => c.IsEnabledCondition.EvaluateAsync(It.IsAny<ExecutionMode>()))
            .ReturnsAsync(isEnabled);
}
