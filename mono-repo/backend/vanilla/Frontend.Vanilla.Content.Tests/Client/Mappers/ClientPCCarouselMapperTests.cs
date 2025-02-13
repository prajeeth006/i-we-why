using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Content.Client.Mappers;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Testing.Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Client.Mappers;

public class ClientPCCarouselMapperTests : ClientContentMapperTestsBase<IPCCarousel, ClientPCCarousel>
{
    private readonly ClientPcCarouselMapper target;

    public ClientPCCarouselMapperTests()
    {
        target = new ClientPcCarouselMapper();
        SourceDoc.SetupGet(s => s.MaxItems).Returns(666);
    }

    [Fact]
    public async Task MapAsyncTest()
    {
        var children = SetupDocuments(s => s.Metadata.ChildIds);

        await RunTest(target);

        TargetDoc.MaxItems.Should().Be(666);
        TargetDoc.Items.Should().BeEquivalentTo(children);
    }

    [Fact]
    public async Task ShouldNotMapItems_IfNotAny()
    {
        SourceDoc.SetupGet(s => s.Metadata.ChildIds).ReturnsEmpty();

        await RunTest(target);

        TargetDoc.MaxItems.Should().Be(0);
        TargetDoc.Items.Should().BeEmpty();
        VerifyNoDocumentsByIdsLoaded();
    }
}
