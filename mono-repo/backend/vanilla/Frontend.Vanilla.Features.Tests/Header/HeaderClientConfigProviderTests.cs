using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Menus;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.Header;
using Frontend.Vanilla.Testing.AbstractTests;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Header;

public class HeaderClientConfigProviderTests : ClientConfigProviderTestsBase
{
    private readonly Mock<IHeaderConfiguration> headerConfig;
    private readonly Mock<IMenuFactory> menuFactory;

    private readonly MenuSection authItems;
    private readonly MenuSection unauthItems;
    private readonly MenuSection products;
    private readonly MenuSection left;
    private readonly MenuSection topSlotItems;
    private readonly MenuSection pillItems;
    private readonly MenuSection productItems;
    private readonly ClientEvaluationResult<bool> isEnabled = ClientEvaluationResult<bool>.FromClientExpression("isEnabled");
    private readonly ClientEvaluationResult<bool> hasDisabledItems = ClientEvaluationResult<bool>.FromClientExpression("disabled");

    public HeaderClientConfigProviderTests()
    {
        headerConfig = new Mock<IHeaderConfiguration>();
        menuFactory = new Mock<IMenuFactory>();
        Target = new HeaderClientConfigProvider(headerConfig.Object, menuFactory.Object);

        headerConfig.Setup(c => c.Enabled.EvaluateForClientAsync(Ct)).ReturnsAsync(isEnabled);
        headerConfig.SetupGet(c => c.Version).Returns(1);

        authItems = new MenuSection { Items = new List<MenuItem> { new MenuItem() } };
        unauthItems = new MenuSection { Items = new List<MenuItem> { new MenuItem() } };
        products = new MenuSection { Items = new List<MenuItem> { new MenuItem() } };
        left = new MenuSection { Items = new List<MenuItem> { new MenuItem() } };
        topSlotItems = new MenuSection { Items = new List<MenuItem> { new MenuItem() } };
        pillItems = new MenuSection { Items = new List<MenuItem> { new MenuItem() } };
        productItems = new MenuSection { Items = new List<MenuItem> { new MenuItem() } };

        menuFactory.Setup(c => c.GetSectionAsync($"{AppPlugin.ContentRoot}/Header/Elements/AuthItems", DslEvaluation.PartialForClient, Ct))
            .ReturnsAsync(authItems);
        menuFactory.Setup(c => c.GetSectionAsync($"{AppPlugin.ContentRoot}/Header/Elements/UnauthItems", DslEvaluation.PartialForClient, Ct))
            .ReturnsAsync(unauthItems);
        menuFactory.Setup(c => c.GetSectionAsync($"{AppPlugin.ContentRoot}/Header/Elements/LeftItems", DslEvaluation.PartialForClient, Ct))
            .ReturnsAsync(left);
        menuFactory.Setup(c => c.GetSectionAsync($"{AppPlugin.ContentRoot}/Header/Elements/TopSlotItems", DslEvaluation.PartialForClient, Ct))
            .ReturnsAsync(topSlotItems);
        menuFactory.Setup(c => c.GetSectionAsync($"{AppPlugin.ContentRoot}/Header/Elements/PillItems", DslEvaluation.PartialForClient, Ct))
            .ReturnsAsync(pillItems);
        menuFactory.Setup(c => c.GetSectionAsync($"{AppPlugin.ContentRoot}/Header/Elements/ProductItems", DslEvaluation.PartialForClient, Ct))
            .ReturnsAsync(productItems);
        menuFactory.Setup(c => c.GetSectionAsync($"{AppPlugin.ContentRoot}/Header/Products", DslEvaluation.PartialForClient, Ct))
            .ReturnsAsync(products);
    }

    [Fact]
    public async Task GetClientConfiguration_ShouldReturnHeaderContent()
    {
        var expression1 = new Mock<IDslExpression<bool>>();
        var disabledItems = new DisabledItems(expression1.Object, new[] { "content_messages", "header_top_items" });
        headerConfig.Setup(c => c.DisabledItems).Returns(disabledItems);
        headerConfig.SetupGet(c => c.OnboardingEnabled).Returns(true);

        expression1.Setup(c => c.EvaluateForClientAsync(Ct)).ReturnsAsync(hasDisabledItems);

        dynamic config = await Target.GetClientConfigAsync(Ct);

        ((object)config.elements.leftItems).Should().BeSameAs(left.Items);
        ((object)config.elements.unauthItems).Should().BeEquivalentTo(authItems.Items);
        ((object)config.elements.authItems).Should().BeEquivalentTo(unauthItems.Items);
        ((object)config.elements.topSlotItems).Should().BeEquivalentTo(topSlotItems.Items);
        ((object)config.elements.pillItems).Should().BeEquivalentTo(pillItems.Items);
        ((object)config.elements.productItems).Should().BeNull();
        ((object)config.products).Should().BeEquivalentTo(products.Items);
        ((object)config.isEnabledCondition).Should().BeSameAs(isEnabled);
        ((object)config.disabledItems.disabled).Should().BeEquivalentTo(hasDisabledItems);
        ((object)config.disabledItems.sections).Should().BeEquivalentTo(new[] { "content_messages", "header_top_items" });
        ((object)config.Version).Should().Be(1);
        ((object)config.OnboardingEnabled).Should().Be(true);
    }

    [Fact]
    public async Task GetClientConfiguration_ShouldReturnProductItemsForVersion2()
    {
        var expression1 = new Mock<IDslExpression<bool>>();
        var disabledItems = new DisabledItems(expression1.Object, new[] { "content_messages", "header_top_items" });
        headerConfig.Setup(c => c.DisabledItems).Returns(disabledItems);
        headerConfig.SetupGet(c => c.Version).Returns(2);

        expression1.Setup(c => c.EvaluateForClientAsync(Ct)).ReturnsAsync(hasDisabledItems);

        dynamic config = await Target.GetClientConfigAsync(Ct);

        ((object)config.elements.productItems).Should().BeEquivalentTo(productItems.Items);
        ((object)config.Version).Should().Be(2);
    }
}
