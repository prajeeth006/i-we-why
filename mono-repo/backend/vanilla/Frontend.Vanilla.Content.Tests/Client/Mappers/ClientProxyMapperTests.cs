using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Client.Mappers;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Testing.FluentAssertions;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Client.Mappers;

public class ClientProxyMapperTests : ClientContentMapperTestsBase<IProxy, ClientProxy>
{
    [Fact]
    public async Task MapAsyncTest()
    {
        SourceDoc.SetupGet(s => s.Target).Returns(new[]
        {
            new ProxyRule("c.User.IsRetard", "/target-1"),
            new ProxyRule("c.Server.IsHacked", null),
            new ProxyRule(null, "/target-2"),
        });
        var targetDoc1 = new ClientDocument();
        var targetDoc2 = new ClientDocument();
        Context.Setup(c => c.LoadAsync("/target-1")).ReturnsAsync(targetDoc1);
        Context.Setup(c => c.LoadAsync("/target-2")).ReturnsAsync(targetDoc2);

        await RunTest(new ClientProxyMapper());

        TargetDoc.Rules.Should().BeEquivalentOrderedTo(
            new ClientProxyRule { Condition = "c.User.IsRetard", Document = targetDoc1 },
            new ClientProxyRule { Condition = "c.Server.IsHacked" },
            new ClientProxyRule { Document = targetDoc2 });
    }
}
