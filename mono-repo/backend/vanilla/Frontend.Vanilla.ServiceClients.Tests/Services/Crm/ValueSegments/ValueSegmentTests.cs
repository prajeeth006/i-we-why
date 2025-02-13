using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Services.Crm.ValueSegments;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Crm.ValueSegments;

public sealed class ValueSegmentTests
{
    [Fact]
    public void ValueSegmentResponse_ShouldBeDeserialized()
    {
        var target = PosApiSerializationTester.Deserialize<ValueSegmentResponse>(
            @"{
                ""playerValueSegment"": {
                    ""customerId"": 325132333,
                    ""segmentId"": 9,
                    ""lifeCycleStage"": ""Active Sport"",
                    ""ewvip"": ""No"",
                    ""microSegmentId"": 198,
                    ""churnRate"": 0.084808864553975,
                    ""futureValue"": 921.681511010879,
                    ""potentialVip"": 0.013935969868,
                    ""date"": ""/Date(1434427200000)/"",
                    ""favoriteProductLT"": ""POKER"",
                    ""highestAchievedSegment30D"": ""Top NGR"",
                    ""highestAchievedSegment90D"": ""Top NGR"",
                    ""highestAchievedSegment180D"": ""Top NGR"",
                    ""highestAchievedSegment365D"": ""Top NGR"",
                    ""highestAchievedSegmentLT"": ""Top NGR"",
                    ""lowestAchievedSegment365D"": ""Negative"",
                    ""microSegmentDesc"": ""Tier 3 Depositors-Mid Recency, High Frequency-High Activity, High Bet Amount"",
                    ""netRevenue"": 679.997097216547,
                    ""netRevenue2W"": 156.950011014938,
                    ""optimoveInstance"": ""gvcdach"",
                    ""playerClass"": ""asdf"",
                    ""playerPriority"": ""P1"",
                    ""segment"": ""Top NGR""
                }
            }").GetData();

        target.CustomerId.Should().Be(325132333);
        target.SegmentId.Should().Be(9);
        target.LifeCycleStage.Should().Be("Active Sport");
        target.Ewvip.Should().Be("No");
        target.MicroSegmentId.Should().Be(198);
        target.ChurnRate.Should().Be(0.084808864553975);
        target.FutureValue.Should().Be(921.681511010879);
        target.PotentialVip.Should().Be(0.013935969868);
        target.Date.Should().Be(new UtcDateTime(2015, 6, 16, 4, 0, 0));
        target.FavoriteProductLt.Should().Be("POKER");
        target.HighestAchievedSegment30D.Should().Be("Top NGR");
        target.HighestAchievedSegment90D.Should().Be("Top NGR");
        target.HighestAchievedSegment180D.Should().Be("Top NGR");
        target.HighestAchievedSegment365D.Should().Be("Top NGR");
        target.HighestAchievedSegmentLt.Should().Be("Top NGR");
        target.LowestAchievedSegment365D.Should().Be("Negative");
        target.MicroSegmentDesc.Should().Be("Tier 3 Depositors-Mid Recency, High Frequency-High Activity, High Bet Amount");
        target.NetRevenue.Should().Be((decimal)679.997097216547);
        target.NetRevenue2W.Should().Be((decimal)156.950011014938);
        target.OptimoveInstance.Should().Be("gvcdach");
        target.PlayerClass.Should().Be("asdf");
        target.PlayerPriority.Should().Be("P1");
        target.Segment.Should().Be("Top NGR");
    }
}
