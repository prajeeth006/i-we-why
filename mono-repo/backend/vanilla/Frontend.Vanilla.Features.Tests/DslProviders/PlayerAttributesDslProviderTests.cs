using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.DslProviders;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Crm;
using Frontend.Vanilla.ServiceClients.Services.Crm.PlayerAttributes;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DslProviders;

public class PlayerAttributesDslProviderTests
{
    private readonly IPlayerAttributesDslProvider target;
    private readonly Mock<IPosApiCrmServiceInternal> posApiCrmServiceInternalMock;
    private readonly Mock<ICurrentUserAccessor> currentUserAccessorMock;

    private readonly ExecutionMode mode;

    public PlayerAttributesDslProviderTests()
    {
        posApiCrmServiceInternalMock = new Mock<IPosApiCrmServiceInternal>();
        currentUserAccessorMock = new Mock<ICurrentUserAccessor>();
        target = new PlayerAttributesDslProvider(posApiCrmServiceInternalMock.Object, currentUserAccessorMock.Object);

        mode = TestExecutionMode.Get();

        var playerAttributes = new PlayerAttributesDto(attributes: new Attributes(new Dictionary<string, Attribute>
        {
            ["oddsChangePreference"] = new (0, true),
            ["mobileNumberPopupCloseTimestamp"] = new (0, 1732612619000),
            ["vipCategoryChanged"] = new (0, "20241127"),
        }, new Dictionary<string, Attribute>
        {
            ["VIPHUB_GRACE_PERIOD_YN"] = new (0, true),
        }));

        currentUserAccessorMock.SetupGet(s => s.User.Identity.IsAuthenticated).Returns(true);
        posApiCrmServiceInternalMock.Setup(s => s.GetPlayerAttributesAsync(mode, true)).ReturnsAsync(playerAttributes);
    }

    public static readonly IEnumerable<object[]> PlayerAttributesTestCases =
    [
        ["oddsChangePreference", "True"],
        ["mobileNumberPopupCloseTimestamp", "1732612619000"],
        ["vipCategoryChanged", "20241127"],
    ];

    [Theory, MemberData(nameof(PlayerAttributesTestCases))]
    public async Task GetAcknowledgedAsync_ShouldReturnResult(string name, string expected)
    {
        // Act
        var result = await target.GetAcknowledgedAsync(mode, name);

        result.Should().Be(expected);
    }

    [Fact]
    public async Task GetAcknowledgedAsync_ShouldReturnEmptyString_IfAnonymous()
    {
        currentUserAccessorMock.SetupGet(a => a.User.Identity.IsAuthenticated).Returns(false);

        // Act
        var result = await target.GetAcknowledgedAsync(mode, "oddsChangePreference");

        result.Should().Be(string.Empty);
        posApiCrmServiceInternalMock.VerifyWithAnyArgs(s => s.GetPlayerAttributesAsync(It.IsAny<ExecutionMode>(), false), Times.Never);
    }

    [Fact]
    public async Task GetAcknowledgedAsync_ShouldReturnEmptyString_IfNotFound()
    {
        // Act
        var result = await target.GetAcknowledgedAsync(mode, "ACKNOWLEDGED");

        // Assert
        result.Should().Be(string.Empty);
        posApiCrmServiceInternalMock.VerifyWithAnyArgs(s => s.GetPlayerAttributesAsync(It.IsAny<ExecutionMode>(), false), Times.Once);
    }

    [Fact]
    public async Task GetVipAsync_ShouldReturnResult()
    {
        // Act
        var result = await target.GetVipAsync(mode, "VIPHUB_GRACE_PERIOD_YN");

        // Assert
        result.Should().Be("True");
        posApiCrmServiceInternalMock.VerifyWithAnyArgs(s => s.GetPlayerAttributesAsync(It.IsAny<ExecutionMode>(), false), Times.Once);
    }

    [Fact]
    public async Task GetVipAsync_ShouldReturnEmptyString_IfAnonymous()
    {
        // Setup
        currentUserAccessorMock.SetupGet(a => a.User.Identity.IsAuthenticated).Returns(false);

        // Act
        var result = await target.GetVipAsync(mode, "VIPHUB_GRACE_PERIOD_YN");

        // Assert
        result.Should().Be(string.Empty);
        posApiCrmServiceInternalMock.VerifyWithAnyArgs(s => s.GetPlayerAttributesAsync(It.IsAny<ExecutionMode>(), false), Times.Never);
    }

    [Fact]
    public async Task GetVipAsync_ShouldReturnEmptyString_IfNotFound()
    {
        // Act
        var result = await target.GetVipAsync(mode, "VIP");

        // Assert
        result.Should().Be(string.Empty);
        posApiCrmServiceInternalMock.VerifyWithAnyArgs(s => s.GetPlayerAttributesAsync(It.IsAny<ExecutionMode>(), false), Times.Once);
    }
}
