using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;
using JetBrains.Annotations;

#pragma warning disable CS1591 // Just dummy data -> no docs needed
namespace Frontend.Vanilla.ServiceClients.Services.Crm.LoyaltyProfiles;

public sealed class LoyaltyProfile(
    string category = null,
    decimal points = 0,
    bool isOptInEnabled = false,
    decimal extraPoints = 0,
    decimal usedMarketPoints = 0,
    decimal expiredMarketPoints = 0,
    decimal cancelledPoints = 0,
    decimal otherDeductedPoints = 0,
    decimal monthlyPoints = 0,
    decimal todayPoints = 0,
    UtcDateTime monthlyPointsSetDate = default,
    decimal pointsToRequalify = 0,
    decimal pointsToUpgrade = 0,
    UtcDateTime nextDowngradeTime = default,
    IEnumerable<ProductWiseMarketPoints> productWiseMarketPoints = null,
    IEnumerable<ProductGameWisePoints> productGameWisePoints = null)
    : BasicLoyaltyProfile(category, points, isOptInEnabled), IPosApiResponse<LoyaltyProfile>
{
    public decimal ExtraPoints { get; } = extraPoints;
    public decimal UsedMarketPoints { get; } = usedMarketPoints;
    public decimal ExpiredMarketPoints { get; } = expiredMarketPoints;
    public decimal CancelledPoints { get; } = cancelledPoints;
    public decimal OtherDeductedPoints { get; } = otherDeductedPoints;
    public decimal MonthlyPoints { get; } = monthlyPoints;
    public decimal TodayPoints { get; } = todayPoints;
    public UtcDateTime MonthlyPointsSetDate { get; } = monthlyPointsSetDate;
    public decimal PointsToRequalify { get; } = pointsToRequalify;
    public decimal PointsToUpgrade { get; } = pointsToUpgrade;
    public UtcDateTime NextDowngradeTime { get; } = nextDowngradeTime;

    [NotNull]
    public IReadOnlyList<ProductWiseMarketPoints> ProductWiseMarketPoints { get; } = productWiseMarketPoints.NullToEmpty().ToList().AsReadOnly();

    [NotNull]
    public IReadOnlyList<ProductGameWisePoints> ProductGameWisePoints { get; } = productGameWisePoints.NullToEmpty().ToList().AsReadOnly();

    LoyaltyProfile IPosApiResponse<LoyaltyProfile>.GetData() => this;
}

public sealed class ProductWiseMarketPoints(string productId = null, decimal gamePoints = 0)
{
    [CanBeNull]
    public string ProductId { get; } = productId;

    public decimal GamePoints { get; } = gamePoints;
}

public class ProductGameWisePoints(string productId = null, decimal totalPoints = 0, IEnumerable<GameWisePoint> gameWisePoints = null)
{
    [CanBeNull]
    public string ProductId { get; } = productId;

    public decimal TotalPoints { get; } = totalPoints;

    [NotNull]
    public IReadOnlyList<GameWisePoint> GameWisePoints { get; } = gameWisePoints.NullToEmpty().ToList().AsReadOnly();
}

public sealed class GameWisePoint(string gameType = null, decimal gamePoints = 0)
{
    [CanBeNull]
    public string GameType { get; } = gameType;

    public decimal GamePoints { get; } = gamePoints;
}
