using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Content.Client.Mappers;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Testing.Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Client.Mappers;

public class ClientPMNav1ColPageMapperTests : ClientContentMapperTestsBase<IPMNav1ColPage, ClientPMNav1Col>
{
    private readonly ClientPmNav1ColMapper target;

    public ClientPMNav1ColPageMapperTests()
    {
        target = new ClientPmNav1ColMapper();
    }

    [Fact]
    public async Task MapAsyncTest()
    {
        var navigation = SetupDocuments(s => s.Navigation);
        var content = SetupDocuments(s => s.Content);

        await RunTest(target);

        TargetDoc.Navigation.Should().BeEquivalentTo(navigation);
        TargetDoc.Content.Should().BeEquivalentTo(content);
    }

    [Fact]
    public async Task ShouldNotMapContent_IfNotAny()
    {
        SourceDoc.SetupGet(d => d.Navigation).ReturnsEmpty();
        SourceDoc.SetupGet(d => d.Content).ReturnsEmpty();

        await RunTest(target);

        TargetDoc.Navigation.Should().BeEmpty();
        TargetDoc.Content.Should().BeEmpty();
        VerifyNoDocumentsByIdsLoaded();
    }
}
