using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Client.Mappers;
using Frontend.Vanilla.Content.Model;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Client.Mappers;

public class ClientFilteredDocumentMapperTests : ClientContentMapperTestsBase<IFilterTemplate, ClientFilteredDocument>
{
    [Fact]
    public async Task MapAsyncTest()
    {
        SourceDoc.SetupGet(s => s.Condition).Returns("User.IsRetard");

        await RunTest(new ClientFilteredDocumentMapper());

        TargetDoc.Condition.Should().Be("client: User.IsRetard");
    }
}
