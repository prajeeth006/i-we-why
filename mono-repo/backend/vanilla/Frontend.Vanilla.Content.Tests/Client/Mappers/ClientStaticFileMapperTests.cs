using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Content.Client.Mappers;
using Frontend.Vanilla.Content.Model;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Client.Mappers;

public class ClientStaticFileMapperTests : ClientContentMapperTestsBase<IStaticFileTemplate, ClientStaticFileTemplate>
{
    [Fact]
    public async Task MapAsyncTest()
    {
        SourceDoc.SetupGet(s => s.Metadata.Id).Returns("bla/Name");
        SourceDoc.SetupGet(s => s.Content).Returns("Test Page");
        await RunTest(new ClientStaticFileMapper());

        TargetDoc.Content.Should().Be("client: Test Page");
        TargetDoc.InternalId.Should().Be("name");
    }
}
