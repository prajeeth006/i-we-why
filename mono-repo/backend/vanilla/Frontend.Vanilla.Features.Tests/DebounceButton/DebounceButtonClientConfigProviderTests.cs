using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Menus;
using Frontend.Vanilla.Features.DebounceButtons;
using Frontend.Vanilla.Testing.AbstractTests;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DebounceButton;

public class DebounceButtonClientConfigProviderTests : ClientConfigProviderTestsBase
{
    private readonly Mock<IMenuFactory> menuFactoryMock;

    public DebounceButtonClientConfigProviderTests()
    {
        menuFactoryMock = new Mock<IMenuFactory>();

        Target = new DebounceButtonsClientConfigProvider(menuFactoryMock.Object);
    }

    [Fact]
    public async Task ClientConfig_ShouldReturnItems_WhenEnabled()
    {
        var section = new MenuSection { Items = new[] { new MenuItem() } };
        menuFactoryMock.Setup(c => c.GetSectionAsync("App-v1.0/Debounce/Buttons", It.Is<DslEvaluation>(e => e == DslEvaluation.PartialForClient), Ct))
            .ReturnsAsync(section);

        var config = await Target_GetConfigAsync();

        config["items"].Should().Be(section.Items);
    }
}
