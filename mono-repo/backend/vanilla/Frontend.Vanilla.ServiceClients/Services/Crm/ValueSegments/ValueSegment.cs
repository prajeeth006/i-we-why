using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

#pragma warning disable CS1591 // Just dummy data -> no docs needed
namespace Frontend.Vanilla.ServiceClients.Services.Crm.ValueSegments;

public sealed class ValueSegment(
    long customerId = 0,
    int segmentId = 0,
    string lifeCycleStage = null,
    string ewvip = null,
    int microSegmentId = 0,
    double churnRate = 0,
    double futureValue = 0,
    double potentialVip = 0,
    int tierCode = 0,
    UtcDateTime date = default,
    string highestAchievedSegment180D = null,
    string highestAchievedSegment30D = null,
    string highestAchievedSegment365D = null,
    string highestAchievedSegment90D = null,
    string highestAchievedSegmentLt = null,
    string lowestAchievedSegment365D = null,
    string microSegmentDesc = null,
    decimal netRevenue = 0,
    decimal netRevenue2W = 0,
    string optimoveInstance = null,
    string segment = null,
    string favoriteProductLt = null,
    string playerClass = null,
    string playerPriority = null)
{
    public long CustomerId { get; } = customerId;
    public int SegmentId { get; } = segmentId;
    public string LifeCycleStage { get; } = lifeCycleStage;
    public string Ewvip { get; } = ewvip;
    public int MicroSegmentId { get; } = microSegmentId;
    public double ChurnRate { get; } = churnRate;
    public double FutureValue { get; } = futureValue;
    public double PotentialVip { get; } = potentialVip;
    public int TierCode { get; } = tierCode;
    public UtcDateTime Date { get; } = date;
    public string HighestAchievedSegment180D { get; } = highestAchievedSegment180D;
    public string HighestAchievedSegment30D { get; } = highestAchievedSegment30D;
    public string HighestAchievedSegment365D { get; } = highestAchievedSegment365D;
    public string HighestAchievedSegment90D { get; } = highestAchievedSegment90D;
    public string HighestAchievedSegmentLt { get; } = highestAchievedSegmentLt;
    public string LowestAchievedSegment365D { get; } = lowestAchievedSegment365D;
    public string MicroSegmentDesc { get; } = microSegmentDesc;
    public decimal NetRevenue { get; } = netRevenue;
    public decimal NetRevenue2W { get; } = netRevenue2W;
    public string OptimoveInstance { get; } = optimoveInstance;
    public string Segment { get; } = segment;
    public string FavoriteProductLt { get; } = favoriteProductLt;
    public string PlayerClass { get; } = playerClass;
    public string PlayerPriority { get; } = playerPriority;
}

internal sealed class ValueSegmentResponse : IPosApiResponse<ValueSegment>
{
    public ValueSegment PlayerValueSegment { get; set; }
    public ValueSegment GetData() => PlayerValueSegment;
}
