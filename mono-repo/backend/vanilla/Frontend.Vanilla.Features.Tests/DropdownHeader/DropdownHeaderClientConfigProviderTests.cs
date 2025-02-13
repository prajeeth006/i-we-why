using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Menus;
using Frontend.Vanilla.Features.DropdownHeader;
using Frontend.Vanilla.Testing.AbstractTests;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DropdownHeader;

public class DropdownHeaderClientConfigProviderTests : ClientConfigProviderTestsBase
{
    private Mock<IMenuFactory> menuFactory;
    private Mock<IVanillaClientContentService> clientContentService;

    private MenuSection links;
    private MenuSection leftItems;

    public DropdownHeaderClientConfigProviderTests()
    {
        menuFactory = new Mock<IMenuFactory>();
        clientContentService = new Mock<IVanillaClientContentService>();

        Target = new DropdownHeaderClientConfigProvider(menuFactory.Object, clientContentService.Object);

        leftItems = new MenuSection { Items = new List<MenuItem> { new MenuItem() } };
        links = new MenuSection { Items = new List<MenuItem> { new MenuItem() } };

        menuFactory.Setup(c => c.GetSectionAsync($"{AppPlugin.ContentRoot}/DropdownHeader/Elements/Links", DslEvaluation.PartialForClient, Ct)).ReturnsAsync(links);
        menuFactory.Setup(c => c.GetSectionAsync($"{AppPlugin.ContentRoot}/DropdownHeader/Elements/LeftItems", DslEvaluation.PartialForClient, Ct)).ReturnsAsync(links);
    }

    [Fact]
    public async Task GetClientConfiguration_ShouldReturnHeaderContentForResponsiveMode()
    {
        var resources = Mock.Of<ClientDocument>();
        clientContentService.Setup(s => s.GetAsync($"{AppPlugin.ContentRoot}/DropdownHeader/Resources", Ct, It.IsAny<ContentLoadOptions>())).ReturnsAsync(resources);

        var moreGames = Mock.Of<ClientDocument>();
        clientContentService.Setup(s => s.GetAsync($"{AppPlugin.ContentRoot}/DropdownHeader/MoreGames", Ct, It.IsAny<ContentLoadOptions>())).ReturnsAsync(moreGames);

        var config = await Target_GetConfigAsync();

        config["elements"].Should().BeEquivalentTo(new { leftItems = leftItems.Items, links = links.Items });
        config["moreGames"].Should().BeEquivalentTo(moreGames);
        config["resources"].Should().BeSameAs(resources);
    }
}
