using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Menus;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.ProductMenu;
using Frontend.Vanilla.Testing.AbstractTests;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.ProductMenu;

public class ProductMenuClientConfigProviderTests : ClientConfigProviderTestsBase
{
    private readonly Mock<IProductMenuConfiguration> productMenuConfiguration;
    private readonly Mock<IMenuFactory> menuFactory;
    private readonly Mock<IEpcotDslProvider> epcotDslProvider;

    public ProductMenuClientConfigProviderTests()
    {
        productMenuConfiguration = new Mock<IProductMenuConfiguration>();
        menuFactory = new Mock<IMenuFactory>();
        epcotDslProvider = new Mock<IEpcotDslProvider>();

        Target = new ProductMenuClientConfigProvider(
            productMenuConfiguration.Object,
            menuFactory.Object,
            epcotDslProvider.Object);

        productMenuConfiguration.SetupGet(c => c.NumberOfApps).Returns(5);
        productMenuConfiguration.SetupGet(c => c.CloseButtonTextCssClass).Returns("dark");
        productMenuConfiguration.SetupGet(c => c.ShowCloseButtonAsText).Returns(true);
        productMenuConfiguration.Setup(c => c.RouterMode).Returns(true);
    }

    [Fact]
    public async Task GetClientConfiguration_ShouldReturnProductMenuContent()
    {
        var tabsItem = new MenuItem();
        var appsItem = new MenuItem();
        var headerItem = new MenuItem();

        menuFactory.Setup(c => c.GetItemAsync("App-v1.0/ProductMenu/Tabs", DslEvaluation.PartialForClient, Ct)).ReturnsAsync(tabsItem);
        menuFactory.Setup(c => c.GetItemAsync("App-v1.0/ProductMenu/Apps", DslEvaluation.PartialForClient, Ct)).ReturnsAsync(appsItem);
        menuFactory.Setup(c => c.GetItemAsync("App-v1.0/ProductMenu/Header", DslEvaluation.PartialForClient, Ct)).ReturnsAsync(headerItem);
        epcotDslProvider.Setup(c => c.IsEnabled(It.IsAny<string>())).Returns(true);

        var config = await Target_GetConfigAsync();

        config["tabs"].Should().BeSameAs(tabsItem);
        config["apps"].Should().BeSameAs(appsItem);
        config["header"].Should().BeSameAs(headerItem);
        config["numberOfApps"].Should().Be(5);
        config["routerMode"].Should().Be(true);
        config["closeButtonTextCssClass"].Should().Be("dark");
        config["showCloseButtonAsText"].Should().Be(true);
    }

    [Fact]
    public async Task GetClientConfiguration_ShouldReturnProductMenuContent_v2()
    {
        productMenuConfiguration.SetupGet(c => c.UseV2).Returns(true);

        var menuItem = new MenuItem();

        menuFactory.Setup(c => c.GetItemAsync("App-v1.0/ProductMenu2/Menu", DslEvaluation.PartialForClient, Ct)).ReturnsAsync(menuItem);

        var config = await Target_GetConfigAsync();

        config["menu"].Should().BeSameAs(menuItem);
        config["v2"].Should().Be(true);
        config["numberOfApps"].Should().Be(5);
        config["routerMode"].Should().Be(true);
    }
}
