using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Menus;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.BottomNav;
using Frontend.Vanilla.Testing.AbstractTests;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.BottomNav;

public class BottomNavClientConfigProviderTests : ClientConfigProviderTestsBase
{
    private Mock<IBottomNavConfiguration> bottomNavConfiguration;
    private Mock<IMenuFactory> menuFactory;

    public BottomNavClientConfigProviderTests()
    {
        bottomNavConfiguration = new Mock<IBottomNavConfiguration>();
        menuFactory = new Mock<IMenuFactory>();
        Target = new BottomNavClientConfigProvider(bottomNavConfiguration.Object, menuFactory.Object, new TestLogger<BottomNavClientConfigProvider>());
    }

    [Fact]
    public async Task GetClientConfiguration_ShouldReturnFooterContent()
    {
        var itemsSection = new MenuSection
        {
            Items = new List<MenuItem>
            {
                new MenuItem(),
                new MenuItem(),
            },
        };

        menuFactory.Setup(c => c.GetSectionAsync("App-v1.0/BottomNav/Items", DslEvaluation.PartialForClient, Ct)).ReturnsAsync(itemsSection);

        var clientEvaluationResult = ClientEvaluationResult<bool>.FromClientExpression("exp");
        bottomNavConfiguration.Setup(c => c.IsEnabled.EvaluateForClientAsync(Ct)).ReturnsAsync(clientEvaluationResult);

        var config = await Target_GetConfigAsync();

        config["isEnabledCondition"].Should().BeSameAs(clientEvaluationResult);
        config["items"].Should().BeSameAs(itemsSection.Items);
    }
}
