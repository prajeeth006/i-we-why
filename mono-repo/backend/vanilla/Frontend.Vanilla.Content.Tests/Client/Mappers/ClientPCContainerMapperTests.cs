using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Content.Client.Mappers;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Testing.Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Client.Mappers;

public class ClientClientPCContainerMapperMapperTests : ClientContentMapperTestsBase<IPCContainer, ClientPCContainer>
{
    private ClientPcContainerMapper target;

    public ClientClientPCContainerMapperMapperTests()
    {
        target = new ClientPcContainerMapper();
    }

    [Fact]
    public async Task MapAsyncTest()
    {
        var children = SetupDocuments(s => s.Items);

        await RunTest(target);

        TargetDoc.Items.Should().BeEquivalentTo(children);
    }

    [Fact]
    public async Task ShouldNotMapItems_IfNotAny()
    {
        SourceDoc.SetupGet(d => d.Items).ReturnsEmpty();

        await RunTest(target);

        TargetDoc.Items.Should().BeEmpty();
        VerifyNoDocumentsByIdsLoaded();
    }
}
