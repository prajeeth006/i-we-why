using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Crm;
using Frontend.Vanilla.ServiceClients.Services.Crm2;
using Frontend.Vanilla.ServiceClients.Services.Crm2.Models;
using Frontend.Vanilla.Testing.Moq;
using Frontend.Vanilla.Testing.ServiceClients;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Crm2;

public class PosApiCrmServiceClientTests
{
    private readonly Mock<IPosApiRestClient> restClientMock;
    private readonly Mock<IPosApiDataCache> cacheMock;
    private readonly PosApiCrmServiceClient crmServiceClient;
    private readonly Mock<IPosApiCrmService> crmServiceMock;
    private readonly Mock<ICurrentUserAccessor> currentUserMock;

    public PosApiCrmServiceClientTests()
    {
        restClientMock = new Mock<IPosApiRestClient>();
        cacheMock = new Mock<IPosApiDataCache>();
        crmServiceMock = new Mock<IPosApiCrmService>();
        currentUserMock = new Mock<ICurrentUserAccessor>();
        crmServiceClient = new PosApiCrmServiceClient(restClientMock.Object, cacheMock.Object, crmServiceMock.Object, currentUserMock.Object);
    }

    [Fact]
    public async Task GetCashbackAsyncShouldBeSuccess()
    {
        const string data = @"{""cashbackAmount"":15,""cashbackCurrency"":""USD"",""claimedAmount"":10,""claimedAmountCurrency"":""EUR"",""eligibleForClaim"":true,
                                    ""minEligibleAmount"":5,""minEligibleAmountCurrency"":""USD"",""optinStatus"":true}";
        var closureResponse = new CashbackDetails
        {
            CashbackAmount = 15,
            CashbackCurrency = "USD",
            ClaimedAmount = 10,
            ClaimedAmountCurrency = "EUR",
            EligibleForClaim = true,
            MinEligibleAmount = 5,
            MinEligibleAmountCurrency = "USD",
            OptinStatus = true,
        };
        var response = PosApiSerializationTester.Deserialize<CashbackDetails>(data);
        restClientMock.Setup(s => s.ExecuteAsync<CashbackDetails>(It.IsAny<PosApiRestRequest>(), CancellationToken.None)).ReturnsAsync(response);
        cacheMock.SetupWithAnyArgs(c =>
                c.GetOrCreateAsync(It.IsAny<ExecutionMode>(), It.IsAny<PosApiDataType>(), It.IsAny<TrimmedRequiredString>(), It.IsAny<Func<Task<bool>>>(), default, null))
            .Returns((ExecutionMode mode, PosApiDataType dataType, RequiredString key, Func<Task<bool>> valueFactory, bool cached, TimeSpan? relativeExpiration) =>
                valueFactory());

        // Act
        var result = crmServiceClient.GetCashbackAsync(CancellationToken.None);

        // Assert
        restClientMock.Verify(v => v.ExecuteAsync<CashbackDetails>(It.Is<PosApiRestRequest>(p => p.Url.ToString().Contains("CRM.svc/Loyalty/Cashback") &&
                                                                                                 p.Authenticate && p.Method == HttpMethod.Get), CancellationToken.None),
            Times.Once);
        result.Should().NotBeNull();
        (await result).Should().BeEquivalentTo(response);
        closureResponse.Should().BeEquivalentTo(response);
    }

    [Fact]
    public async Task GetCurrentWeekPokerPointsAsyncShouldBeSuccess()
    {
        const string data = @"{""currentCashback"":25,""currency"":""$"",""currentSlabPoints"":50,""currentTarget"":30,""isOptin"":""Y"",
                                    ""nextSlabPoints"":100,""weeklyPoints"":65,""targetCashback"": 35, ""awardType"":""poker""}";
        var weeklyPokerPoints = new WeeklyPokerPoints(65, 30, 25, 35, "Y", "$", 50, 100, "poker");
        var response = PosApiSerializationTester.Deserialize<WeeklyPokerPoints>(data);
        restClientMock.Setup(s => s.ExecuteAsync<WeeklyPokerPoints>(It.IsAny<PosApiRestRequest>(), CancellationToken.None)).ReturnsAsync(response);

        // Act
        var result = crmServiceClient.GetCurrentWeekPokerPointsAsync(CancellationToken.None);

        // Assert
        restClientMock.Verify(v => v.ExecuteAsync<WeeklyPokerPoints>(
            It.Is<PosApiRestRequest>(p => p.Url.ToString().Contains("CRM.svc/PokerWeekly/Points/Weekly") &&
                                          p.Authenticate && p.Method == HttpMethod.Get), CancellationToken.None), Times.Once);
        result.Should().NotBeNull();
        (await result).Should().BeEquivalentTo(response);
        weeklyPokerPoints.Should().BeEquivalentTo(response);
    }

    [Fact]
    public async Task GetMLifeRewardsAsyncShouldBeSuccess()
    {
        const string data = @"{""mlifeNo"":12312312,""tier"":""B"",""tierDesc"":""Sapphire"",""tierCredits"":3200}";
        var mLifeProfile = new MLifeProfile()
        {
            MlifeNo = 12312312,
            Tier = "B",
            TierDesc = "Sapphire",
            TierCredits = 3200,
        };
        var response = PosApiSerializationTester.Deserialize<MLifeProfile>(data);
        restClientMock.Setup(s => s.ExecuteAsync<MLifeProfile>(It.IsAny<PosApiRestRequest>(), CancellationToken.None)).ReturnsAsync(response);

        // Act
        var result = crmServiceClient.GetMLifeProfileAsync(CancellationToken.None);

        // Assert
        restClientMock.Verify(v => v.ExecuteAsync<MLifeProfile>(
            It.Is<PosApiRestRequest>(p => p.Url.ToString().Contains("CRM.svc/LoyaltyProfile/Mlife") &&
                                          p.Authenticate && p.Method == HttpMethod.Get), CancellationToken.None), Times.Once);
        result.Should().NotBeNull();
        (await result).Should().BeEquivalentTo(response);
        mLifeProfile.Should().BeEquivalentTo(response);
    }

    [Fact]
    public async Task GetBonusesAsyncShouldBeSuccess()
    {
        const string data = @"{""IssuedBonuses"":
              [
                 {""bonusId"":1,
                ""bonusIssueId"":12,
                ""bonusCode"":""123ABC"",
                ""bonusAmount"":10.00,
                ""bonusExpiryDate"":""/Date(1298441192000)/"",
                ""currentRestrictedAmount"":10.00,
                ""releasedBonusAmount"":10.00,
                ""bonusStatusId"":5,
                ""bonusTypeId"":6,
                ""bonusRestrictionTypeId"":2,
                ""pointsFlag"":1,
                ""offerBonusValue"":10000,
                ""offerMaxBonusAmount"":10000,
                ""offerBonusValueTypeId"":1,
                ""numberOfSlabs"":1,
                ""IsBonusActive"":true,
                ""numberOfSlabsReleased"":1,
                ""bonusReleaseConditions"": [{
                    ""brandId"": ""BWINCOM"",
                    ""gameConditionType"": ""OR"",
                    ""games"": [""PARTY_ARA_BLM_GAMETYPE_POKER""],
                    ""slabReleaseConditions"": [{
                            ""bonusAmount"": 100,
                            ""bonusTransactionId"": 0,
                            ""currencyAttached"": 0,
                            ""gameCountCurrentValue"": 0,
                            ""gamingActivityKey"": ""PARTY_ARA_BLM_ACTIVITYTYPE_RAKEDHANDSNONE"",
                            ""pendingRelease"": 15,
                            ""productId"": ""POKER"",
                            ""slabNumber"": 1,
                            ""statusId"": 1,
                            ""totalRelease"": 15
                        }]
                    }]
                }]}";

        var getBonusesResponse = new BonusDto
        {
            IssuedBonuses = new[]
            {
                new IssuedBonus()
                {
                    BonusId = 1,
                    BonusIssueId = 12,
                    BonusCode = "123ABC",
                    BonusExpiryDate = new DateTime(2011, 2, 23, 6, 6, 32, DateTimeKind.Utc),
                    BonusAmount = 10,
                    CurrentRestrictedAmount = 10,
                    ReleasedBonusAmount = 10,
                    BonusStatusId = 5,
                    BonusTypeId = 6,
                    BonusRestrictionTypeId = 2,
                    PointsFlag = 1,
                    OfferBonusValue = 10000,
                    OfferMaxBonusAmount = 10000,
                    OfferBonusValueTypeId = 1,
                    NumberOfSlabs = 1,
                    NumberOfSlabsReleased = 1,
                    IsBonusActive = true,
                    BonusReleaseConditions = new[]
                    {
                        new BonusReleaseCondition()
                        {
                            BrandId = "BWINCOM",
                            GameConditionType = "OR",
                            Games = new[]
                            {
                                "PARTY_ARA_BLM_GAMETYPE_POKER",
                            },
                            SlabReleaseConditions = new[]
                            {
                                new SlabReleaseCondition()
                                {
                                    BonusAmount = 100,
                                    BonusTransactionId = 0,
                                    CurrencyAttached = 0,
                                    GameCountCurrentValue = 0,
                                    GamingActivityKey = "PARTY_ARA_BLM_ACTIVITYTYPE_RAKEDHANDSNONE",
                                    PendingRelease = 15,
                                    ProductId = "POKER",
                                    SlabNumber = 1,
                                    StatusId = 1,
                                    TotalRelease = 15,
                                },
                            },
                        },
                    },
                },
            },
        };
        var response = PosApiSerializationTester.Deserialize<BonusDto>(data);
        cacheMock.SetupWithAnyArgs(c => c.GetOrCreateAsync<IEnumerable<Bonus>>(default, default, null, null, default, null))
            .Returns((
                ExecutionMode mode,
                PosApiDataType dataType,
                RequiredString key,
                Func<Task<IEnumerable<Bonus>>> valueFactory,
                bool cached,
                TimeSpan? relativeExpiration) => valueFactory());
        restClientMock.Setup(s => s.ExecuteAsync<BonusDto>(It.IsAny<PosApiRestRequest>(), CancellationToken.None)).ReturnsAsync(response);

        // Act
        var result = crmServiceClient.GetBonusesAsync(CancellationToken.None);

        // Assert
        restClientMock.Verify(v => v.ExecuteAsync<BonusDto>(
            It.Is<PosApiRestRequest>(p => p.Url.ToString().Contains("CRM.svc/Bonuses") &&
                                          p.Authenticate && p.Method == HttpMethod.Get), CancellationToken.None), Times.Once);

        result.Should().NotBeNull();
        (await result).FirstOrDefault()?.BonusStatusVanilla.Should().Be(BonusStatusVanilla.Closed);
        getBonusesResponse.Should().BeEquivalentTo(response);
    }
}
