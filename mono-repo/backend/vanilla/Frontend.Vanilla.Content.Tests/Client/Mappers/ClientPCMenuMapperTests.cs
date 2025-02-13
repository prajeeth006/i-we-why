using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Content.Client.Mappers;
using Frontend.Vanilla.Content.Menus;
using Frontend.Vanilla.Content.Model;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Client.Mappers;

public class ClientPCMenuMapperTests : ClientContentMapperTestsBase<IPCMenu, ClientPCMenu>
{
    [Fact]
    public async Task MapAsyncTest()
    {
        var menu = new MenuItem();
        SourceDoc.SetupGet(s => s.MenuNode).Returns("/menu/primary");
        Context.Setup(c => c.LoadMenuAsync(SourceDoc.Object.MenuNode)).ReturnsAsync(menu);

        await RunTest(new ClientPcMenuMapper());

        TargetDoc.Menu.Should().BeSameAs(menu);
    }
}
