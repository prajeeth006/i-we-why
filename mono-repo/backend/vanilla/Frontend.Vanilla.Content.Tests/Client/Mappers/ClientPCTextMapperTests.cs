using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Content.Client.Mappers;
using Frontend.Vanilla.Content.Model;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Client.Mappers;

public class ClientPCTextMapperTests : ClientContentMapperTestsBase<IPCText, ClientPCText>
{
    [Fact]
    public async Task MapAsyncTest()
    {
        SourceDoc.SetupGet(s => s.Text).Returns("<text />");

        await RunTest(new ClientPcTextMapper());

        TargetDoc.Text.Should().Be("client: <text />");
    }
}
