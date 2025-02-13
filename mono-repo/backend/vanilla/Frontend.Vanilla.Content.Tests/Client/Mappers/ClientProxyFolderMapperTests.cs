using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Client.Mappers;
using Frontend.Vanilla.Content.Loading.ProxyFolder;
using Frontend.Vanilla.Testing.FluentAssertions;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Client.Mappers;

public class ClientProxyFolderMapperTests : ClientContentMapperTestsBase<IVanillaProxyFolder, ClientProxy>
{
    [Fact]
    public async Task MapAsyncTest()
    {
        var doc1 = Mock.Of<IDocument>();
        var doc2 = Mock.Of<IDocument>();
        SourceDoc.SetupGet(s => s.Target).Returns(new[]
        {
            new ProxyFolderChildItem("c.User.IsRetard", doc1),
            new ProxyFolderChildItem(null, doc2),
        });
        var targetDoc1 = new ClientDocument();
        var targetDoc2 = new ClientDocument();
        Context.Setup(c => c.ConvertAsync(doc1)).ReturnsAsync(targetDoc1);
        Context.Setup(c => c.ConvertAsync(doc2)).ReturnsAsync(targetDoc2);

        await RunTest(new ClientProxyFolderMapper());

        TargetDoc.Rules.Should().BeEquivalentOrderedTo(
            new ClientProxyRule { Condition = "c.User.IsRetard", Document = targetDoc1 },
            new ClientProxyRule { Document = targetDoc2 });
    }
}
