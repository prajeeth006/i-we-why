using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Account.SegmentationGroups;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Account.SegmentationGroups;

public class SegmentationGroupsResponseTests
{
    [Fact]
    public void ShouldBeDeserializedCorrectly()
    {
        var target = PosApiSerializationTester.Deserialize<SegmentationGroupsResponse>(
            @"{
                ""groupNames"": [
                    ""VIP"",
                    ""Loosers""
            ]}").GetData();

        target.Should().BeEquivalentTo("VIP", "Loosers");
    }
}
