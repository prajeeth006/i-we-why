using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Crm.CampaignDatas;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Crm.CampaignDatas;

public sealed class CampaignDataTests
{
    [Fact]
    public void ShouldBeDeserializedCorrectly()
    {
        const string json = @"[{
                    ""action"": ""PC_Weekend_Clickard_UK"",
                    ""campaign"": ""PC_Weekend_Clickard_UK_partycasino_OPTIMOVE"",
                    ""group"": ""PC_WEEKEND_CLICKARD_REM_UK"",
                    ""templateId"": ""123"",
                    ""rewardAttributes"": [
                        { ""Key"": ""BONUS_DEFAULT_CURRENCY"", ""Value"": ""EUR"" },
                        { ""Key"": ""BONUS_MINIMUM_DEPOSIT"", ""Value"": ""40 €"" },
                        { ""Key"": ""BONUS_VALUE"", ""Value"": ""20 €"" }
                    ]
                }]";

        // Act
        var campaignData = PosApiSerializationTester.Deserialize<CampaignDataResponse>(json).GetData();

        campaignData.Should().BeEquivalentTo(new[]
        {
            new CampaignData(
                action: "PC_Weekend_Clickard_UK",
                campaign: "PC_Weekend_Clickard_UK_partycasino_OPTIMOVE",
                group: "PC_WEEKEND_CLICKARD_REM_UK",
                templateId: "123",
                rewardAttributes: new Dictionary<string, string>
                {
                    { "BONUS_DEFAULT_CURRENCY", "EUR" },
                    { "BONUS_MINIMUM_DEPOSIT", "40 €" },
                    { "BONUS_VALUE", "20 €" },
                }),
        });
    }
}
