using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Authentication.PendingActions;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Authentication.PendingActionsPostLogin;

public class PendingActionsTests
{
    [Fact]
    public void CanBeDeserialized()
    {
        var target = PosApiSerializationTester.Deserialize<PendingActionList>(
            @"{
                ""Actions"": [{
                    ""Details"": [
                        { ""Key"": ""DAILYPENDINGLIMIT"", ""Value"": ""1000.5"" },
                        { ""Key"": ""WEEKLYPENDINGLIMIT"", ""Value"": ""2000.5"" }
                    ],
                    ""name"": ""RGV2_DEPOSITLIMIT"",
                    ""reactionNeeded"": true
                }],
                ""ordered"": true
            }");

        target.Should().NotBeNull();
        target.Ordered.Should().BeTrue();
        target.Actions.Count.Should().Be(1);

        target.Actions[0].Name.Should().Be("RGV2_DEPOSITLIMIT");
        target.Actions[0].ReactionNeeded.Should().BeTrue();
        target.Actions[0].Details.Count.Should().Be(2);
        target.Actions[0].Details["DAILYPENDINGLIMIT"].Should().Be("1000.5");
        target.Actions[0].Details["WEEKLYPENDINGLIMIT"].Should().Be("2000.5");
    }

    [Fact]
    public void CanBeDeserializedWithNullDetails()
    {
        var target = PosApiSerializationTester.Deserialize<PendingActionList>(
            @"{
                ""Actions"": null,
                ""ordered"": true
            }");

        target.Actions.Should().BeEmpty();
    }
}
