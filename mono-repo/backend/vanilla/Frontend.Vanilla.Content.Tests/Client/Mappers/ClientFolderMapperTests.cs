using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Client.Mappers;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Testing.Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Client.Mappers;

public class ClientFolderMapperTests : ClientContentMapperTestsBase<IFolder, ClientFolder>
{
    private readonly IClientContentMapper<IFolder, ClientFolder> target;

    public ClientFolderMapperTests()
    {
        target = new ClientFolderMapper();
        SourceDoc.SetupGet(s => s.Metadata.Id).Returns("root/folder/xxx");
    }

    [Fact]
    public async Task MapAsyncTest()
    {
        var children = SetupDocuments(s => s.Metadata.ChildIds);

        await RunTest(target);

        TargetDoc.Name.Should().Be("xxx");
        TargetDoc.Items.Should().BeEquivalentTo(children);
    }

    [Fact]
    public async Task ShouldNotMapItems_IfNotAny()
    {
        SourceDoc.SetupGet(s => s.Metadata.ChildIds).ReturnsEmpty();

        await RunTest(target);

        TargetDoc.Items.Should().BeEmpty();
        VerifyNoDocumentsByIdsLoaded();
    }
}
