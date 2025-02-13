using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Content.Client.Mappers;
using Frontend.Vanilla.Content.Model;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Client.Mappers;

public class ClientGenericListMapperTests : ClientContentMapperTestsBase<IGenericListItem, ClientGenericListItem>
{
    [Fact]
    public async Task MapAsyncTest()
    {
        SourceDoc.SetupGet(s => s.SharedList).Returns(
            new Dictionary<string, string>
            {
                { "shared", "shared-value-1" },
                { "conflict", "shared-value-2" },
            }.AsContentParameters());
        SourceDoc.SetupGet(s => s.VersionedList).Returns(
            new Dictionary<string, string>
            {
                { "versioned", "versioned-value-1" },
                { "conflict", "versioned-value-2" },
            }.AsContentParameters());

        await RunTest(new ClientGenericListItemMapper());

        TargetDoc.Messages.Keys.Should().BeEquivalentTo("shared", "versioned", "conflict");
        TargetDoc.Messages["shared"].Should().Be("shared-value-1");
        TargetDoc.Messages["versioned"].Should().Be("versioned-value-1");
        TargetDoc.Messages["conflict"].Should().Be("versioned-value-2");
    }
}
