using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Services.Notification.InboxMessages;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Notification.InboxMessages;

public class InboxMessageTests
{
    [Fact]
    public void ShouldBeDeserializedCorrectly()
    {
        const string json = @"{
                ""newMessageCount"": 3,
                ""messageDetails"": [
                    {
                        ""createdDate"": ""/Date(1479277962593)/"",
                        ""eligibleProducts"": [ ""Casino"", ""Sports"" ],
                        ""id"": ""61"",
                        ""messageSource"": ""OFFER"",
                        ""messageStatus"": ""READ"",
                        ""messageType"": ""BONUS_OFFER"",
                        ""priority"": 8,
                        ""sourceStatus"": ""OFFER_NEW"",
                        ""templateId"": ""inbox"",
                        ""templateMetaData"": [
                            { ""Key"": ""#KEY_FOR_TEMPLATE#"", ""Value"": ""ReplacementValue"" }
                        ],
                        ""campaignMetaData"": [
                            { ""Key"": ""FakeKey"", ""Value"": ""FakeValue"" }
                        ]
                    },
                    {
                        ""id"": ""62""
                    }
                ]
            }";

        // Act
        var result = PosApiSerializationTester.Deserialize<InboxMessagesResponse>(json).GetData();

        result.Should().MatchItems(
            m => m.CreatedDate == new UtcDateTime(2016, 11, 16, 6, 32, 42, 593)
                 && m.EligibleProducts.SequenceEqual(new[] { "Casino", "Sports" }, null)
                 && m.Id == "61"
                 && m.MessageSource == "OFFER"
                 && m.MessageStatus == "READ"
                 && m.MessageType == "BONUS_OFFER"
                 && m.Priority == 8
                 && m.SourceStatus == "OFFER_NEW"
                 && m.TemplateId == "inbox"
                 && m.TemplateMetaData.SequenceEqual(new Dictionary<string, string> { { "#KEY_FOR_TEMPLATE#", "ReplacementValue" } }, null)
                 && m.CampaignMetaData.SequenceEqual(new Dictionary<string, string> { { "FakeKey", "FakeValue" } }, null),
            m => m.Id == "62");
    }

    [Theory]
    [InlineData(@"{}")]
    [InlineData(@"{ ""messageDetails"": null }")]
    [InlineData(@"{ ""messageDetails"": [] }")]
    public void ShouldDeserializeEmpty(string json)
    {
        var result = PosApiSerializationTester.Deserialize<InboxMessagesResponse>(json).GetData();
        result.Should().BeEmpty();
    }
}
