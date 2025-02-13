using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.Affordability;
using Frontend.Vanilla.Features.DslProviders;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.Affordability;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DslProviders;

public class AffordabilityDslProviderTests
{
    private readonly IAffordabilityDslProvider provider;
    private readonly Mock<IAffordabilityConfiguration> affordabilityConfigurationMock;
    private readonly Mock<IPosApiResponsibleGamingServiceInternal> posApiResponsibleGamingServiceMock;
    private readonly ExecutionMode mode;

    public AffordabilityDslProviderTests()
    {
        mode = TestExecutionMode.Get();
        affordabilityConfigurationMock = new Mock<IAffordabilityConfiguration>();
        posApiResponsibleGamingServiceMock = new Mock<IPosApiResponsibleGamingServiceInternal>();

        posApiResponsibleGamingServiceMock
            .Setup(x => x.GetAffordabilitySnapshotDetailsAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(new AffordabilitySnapshotDetailsResponse
            {
                AffordabilityStatus = "LEVEL2",
                EmploymentGroup = "Employed",
            });

        provider = new AffordabilityDslProvider(() => affordabilityConfigurationMock.Object, () => posApiResponsibleGamingServiceMock.Object);
    }

    [Fact]
    public async Task GetLevelAsync_ShouldReturnValue_IfEnabled()
    {
        IsFeatureEnabled(true);

        // Act
        var result = await provider.LevelAsync(mode);

        // Assert
        result.Should().Be("2");
    }

    [Fact]
    public async Task GetLevelAsync_ShouldReturnEmptyString_IfDisabled()
    {
        // Setup
        IsFeatureEnabled(false);

        // Act
        var result = await provider.LevelAsync(mode);

        // Assert
        result.Should().BeEmpty();
    }

    [Fact]
    public async Task GetEmploymentGroupAsync_ShouldReturnValue_IfEnabled()
    {
        IsFeatureEnabled(true);

        // Act
        var result = await provider.EmploymentGroupAsync(mode);

        // Assert
        result.Should().Be("Employed");
    }

    [Fact]
    public async Task GetEmploymentGroupAsync_ShouldReturnEmptyString_IfDisabled()
    {
        // Setup
        IsFeatureEnabled(false);

        // Act
        var result = await provider.EmploymentGroupAsync(mode);

        // Assert
        result.Should().BeEmpty();
    }

    private void IsFeatureEnabled(bool isEnabled)
        => affordabilityConfigurationMock.Setup(c => c.IsEnabledCondition.EvaluateAsync(It.IsAny<ExecutionMode>()))
            .ReturnsAsync(isEnabled);
}
