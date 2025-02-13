using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Client.Mappers;
using Frontend.Vanilla.Content.Model;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Client.Mappers;

public class ClientPCRegionalComponentTests : ClientContentMapperTestsBase<IPCRegionalComponent, ClientPCRegionalComponent>
{
    private readonly ClientPcRegionalComponentMapper target;
    private readonly Mock<IClientContentRegionalResolver> clientContentRegionalResolver;

    public ClientPCRegionalComponentTests()
    {
        clientContentRegionalResolver = new Mock<IClientContentRegionalResolver>();
        target = new ClientPcRegionalComponentMapper(clientContentRegionalResolver.Object);
    }

    [Fact]
    public async Task ShouldCreateObject()
    {
        var regionItems = new List<KeyValuePair<string, DocumentId>> { new KeyValuePair<string, DocumentId>("en|*", "path") };
        DocumentId documentId = "path";
        clientContentRegionalResolver.Setup(r => r.Resolve(regionItems)).Returns(new[] { documentId });

        var item = SetupDocument("path");

        SourceDoc.SetupGet(v => v.RegionItems).Returns(regionItems);

        await RunTest(target);

        TargetDoc.Item.Should().BeSameAs(item);
    }
}
