using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Content.Client.Mappers;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Testing.Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Client.Mappers;

public class ClientPCScrollMenulMapperTests : ClientContentMapperTestsBase<IPCScrollMenu, ClientPCScrollMenu>
{
    private ClientPcScrollMenuMapper target;

    public ClientPCScrollMenulMapperTests()
    {
        target = new ClientPcScrollMenuMapper();
    }

    [Fact]
    public async Task MapAsyncTest()
    {
        var menuItems = SetupDocuments(s => s.MenuItems);
        var items = SetupDocuments(s => s.Metadata.ChildIds);

        await RunTest(target);

        TargetDoc.Items.Should().BeEquivalentTo(items);
        TargetDoc.MenuItems.Should().BeEquivalentTo(menuItems);
    }

    [Fact]
    public async Task ShouldNotMapItems_IfNotAny()
    {
        SourceDoc.SetupGet(d => d.MenuItems).ReturnsEmpty();
        SourceDoc.SetupGet(s => s.Metadata.ChildIds).ReturnsEmpty();

        await RunTest(target);

        TargetDoc.Items.Should().BeEmpty();
        TargetDoc.MenuItems.Should().BeEmpty();
        VerifyNoDocumentsByIdsLoaded();
    }
}
