using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Content.Client.Mappers;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Testing.Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Client.Mappers;

public class ClientPM1ColMapperTests : ClientContentMapperTestsBase<IPM1ColPage, ClientPM1Col>
{
    private readonly ClientPm1ColMapper target;

    public ClientPM1ColMapperTests()
    {
        target = new ClientPm1ColMapper();
    }

    [Fact]
    public async Task MapAsyncTest()
    {
        var content = SetupDocuments(s => s.Content);

        await RunTest(target);

        TargetDoc.Content.Should().BeEquivalentTo(content);
    }

    [Fact]
    public async Task ShouldNotMapContent_IfNotAny()
    {
        SourceDoc.SetupGet(d => d.Content).ReturnsEmpty();

        await RunTest(target);

        TargetDoc.Content.Should().BeEmpty();
        VerifyNoDocumentsByIdsLoaded();
    }
}
