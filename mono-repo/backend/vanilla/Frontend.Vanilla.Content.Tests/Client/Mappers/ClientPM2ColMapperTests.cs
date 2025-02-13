using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Content.Client.Mappers;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Testing.Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Client.Mappers;

public class ClientPM2ColMapperTests : ClientContentMapperTestsBase<IPM2ColPage, ClientPM2Col>
{
    private readonly ClientPm2ColMapper target;

    public ClientPM2ColMapperTests()
    {
        target = new ClientPm2ColMapper();
    }

    [Fact]
    public async Task MapAsyncTest()
    {
        var contentLeft = SetupDocuments(s => s.ContentLeft);
        var contentRight = SetupDocuments(s => s.ContentRight);

        await RunTest(target);

        TargetDoc.ContentLeft.Should().BeEquivalentTo(contentLeft);
        TargetDoc.ContentRight.Should().BeEquivalentTo(contentRight);
    }

    [Fact]
    public async Task ShouldNotMapContent_IfNotAny()
    {
        SourceDoc.SetupGet(d => d.ContentLeft).ReturnsEmpty();
        SourceDoc.SetupGet(d => d.ContentRight).ReturnsEmpty();

        await RunTest(target);

        TargetDoc.ContentLeft.Should().BeEmpty();
        TargetDoc.ContentRight.Should().BeEmpty();
        VerifyNoDocumentsByIdsLoaded();
    }
}
