using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Menus;
using Frontend.Vanilla.Features.BottomSheet;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.BottomSheet;

public class BottomSheetContentClientConfigProviderTests
{
    private IClientConfigProvider configurationProvider;

    private Mock<IMenuFactory> menuFactory;
    private CancellationToken ct;

    public BottomSheetContentClientConfigProviderTests()
    {
        menuFactory = new Mock<IMenuFactory>();
        ct = TestCancellationToken.Get();

        configurationProvider = new BottomSheetContentClientConfigProvider(menuFactory.Object);
    }

    [Fact]
    public void ShouldHaveCorrectName()
    {
        configurationProvider.Name.Should().Be("vnBottomSheet");
    }

    [Fact]
    public async Task GetClientConfiguration_ShouldReturnBottomSheetContent()
    {
        var menu = new MenuSection();

        menuFactory.Setup(c => c.GetSectionAsync("App-v1.0/BottomSheet/Menu", DslEvaluation.PartialForClient, ct)).ReturnsAsync(menu);

        dynamic config = await configurationProvider.GetClientConfigAsync(ct);

        ((object)config.menu).Should().BeSameAs(menu);
    }
}
