using System;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Notification.EdsGroup;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Notification.EdsGroup;

public class EdsGroupStatusTests
{
    [Fact]
    public void ShouldBeDeserializedCorrectly()
    {
        var json = @"{
                        ""campaignDetails"": [
                            {
                                ""id"": 1234,
                                ""name"": ""testcampaignOne"",
                                ""optInStatus"": ""OFFERED"",
                                ""optInDate"": ""2021-12-03T09:45Z""
                            },
                            {
                                ""id"": 5678,
                                ""name"": ""testCampaignTwo"",
                                ""optInStatus"": ""OPTED_IN"",
                                ""optInDate"": null
                            }],
                        ""groupOptinStatusParameters"": [
                            {
                                ""key"": ""key1"",
                                ""value"": ""value1""
                            }]}";

        // Act
        var result = PosApiSerializationTester.Deserialize<EdsGroupStatusResponse>(json);

        result.CampaignDetails.Should().BeEquivalentTo(new[]
        {
            new CampaignDetails(1234, "testcampaignOne", "OFFERED", new DateTime(2021, 12, 3, 9, 45, 0)),
            new CampaignDetails(5678, "testCampaignTwo", "OPTED_IN", null),
        });
        result.GroupOptinStatusParameters.Should().BeEquivalentTo(new Dictionary<string, string>()
        {
            { "key1", "value1" },
        });
    }
}
