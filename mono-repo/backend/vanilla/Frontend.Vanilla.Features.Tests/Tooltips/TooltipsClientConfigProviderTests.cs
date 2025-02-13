using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Features.Tooltips;
using Frontend.Vanilla.Testing.AbstractTests;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Tooltips;

public class TooltipsClientConfigProviderTests : ClientConfigProviderTestsBase
{
    private readonly Mock<IVanillaClientContentService> clientContentService;
    private readonly Mock<ITooltipsConfiguration> tooltipsConfigMock;
    private readonly IReadOnlyList<ClientDocument> balanceTooltipItems;
    private readonly IReadOnlyList<ClientDocument> menuTooltipItems;

    public TooltipsClientConfigProviderTests()
    {
        clientContentService = new Mock<IVanillaClientContentService>();
        tooltipsConfigMock = new Mock<ITooltipsConfiguration>();

        balanceTooltipItems = new List<ClientDocument> { new ClientDocument { InternalId = "tutorials" } };
        menuTooltipItems = new List<ClientDocument> { new ClientDocument { InternalId = "onboardings" } };

        clientContentService.Setup(c => c.GetChildrenAsync($"{AppPlugin.ContentRoot}/Tooltips/Tutorial", Ct, It.IsAny<ContentLoadOptions>()))
            .ReturnsAsync(balanceTooltipItems);
        clientContentService.Setup(c => c.GetChildrenAsync($"{AppPlugin.ContentRoot}/Tooltips/Onboarding", Ct, It.IsAny<ContentLoadOptions>()))
            .ReturnsAsync(menuTooltipItems);

        Target = new TooltipsClientConfigProvider(clientContentService.Object, tooltipsConfigMock.Object);
    }

    [Fact]
    public async Task GetClientConfiguration_ShouldReturnTooltipsConfig()
    {
        tooltipsConfigMock.Setup(c => c.IsOnboardingTooltipsEnabled).Returns(true);
        tooltipsConfigMock.Setup(c => c.IsTutorialTooltipsEnabled).Returns(true);

        var config = await Target_GetConfigAsync();

        config["isOnboardingTooltipsEnabled"].Should().Be(true);
        config["isTutorialTooltipsEnabled"].Should().Be(true);
        config["tutorials"].Should().BeEquivalentTo(balanceTooltipItems.ToDictionary(menu => menu.InternalId?.ItemName ?? string.Empty));
        config["onboardings"].Should().BeEquivalentTo(menuTooltipItems.ToDictionary(menu => menu.InternalId?.ItemName ?? string.Empty));
    }
}
