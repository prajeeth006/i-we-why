using System.Security.Claims;
using FluentAssertions;
using Frontend.SharedFeatures.Api.Features.AccountMenu;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Authentication;
using Frontend.Vanilla.ServiceClients.Services.Authentication.ArcSessionSummary;
using Frontend.Vanilla.ServiceClients.Services.Authentication.CurrentSessions;
using Frontend.Vanilla.ServiceClients.Services.Crm2;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.PlayerLimits;
using Frontend.Vanilla.ServiceClients.Services.Wallet;
using Frontend.Vanilla.ServiceClients.Services.Wallet.AverageDeposit;
using Frontend.Vanilla.ServiceClients.Services.Wallet.CustomerNetDeposit;
using Frontend.Vanilla.ServiceClients.Services.Wallet.NetLossInfo;
using Frontend.Vanilla.ServiceClients.Services.Wallet.ProfitLossSummary;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.SharedFeatures.Api.Tests.Features.AccountMenu;

public class AccountMenuControllerTests
{
    private readonly AccountMenuController target;
    private readonly Mock<ICrmService> crmService;
    private readonly Mock<IPosApiResponsibleGamingServiceInternal> posApiResponsibleGamingService;
    private readonly Mock<IPosApiWalletServiceInternal> posApiWalletServiceInternal;
    private readonly Mock<IPosApiAuthenticationService> posapiAuthenticationService;
    private readonly ICurrentUserAccessor currentUserAccessor;
    private readonly TestClock clock;
    private readonly TestLogger<AccountMenuController> log;
    private readonly CancellationToken ct;

    public AccountMenuControllerTests()
    {
        ct = TestCancellationToken.Get();
        log = new TestLogger<AccountMenuController>();
        crmService = new Mock<ICrmService>();
        posApiResponsibleGamingService = new Mock<IPosApiResponsibleGamingServiceInternal>();
        posApiWalletServiceInternal = new Mock<IPosApiWalletServiceInternal>();
        posapiAuthenticationService = new Mock<IPosApiAuthenticationService>();
        currentUserAccessor = Mock.Of<ICurrentUserAccessor>(a => a.User == new ClaimsPrincipal());
        currentUserAccessor.User.AddIdentity(new ClaimsIdentity(new[] { new Claim("http://bwin.com/claims/timezone", "Central European Standard Time") }));
        clock = new TestClock { UtcNow = new UtcDateTime(2021, 7, 8, 14, 5, 6) };

        target = new AccountMenuController(
            crmService.Object,
            posapiAuthenticationService.Object,
            posApiResponsibleGamingService.Object,
            posApiWalletServiceInternal.Object,
            clock,
            currentUserAccessor,
            log);
    }

    [Fact]
    public async Task GetLossLimit_ShouldReturnLossLimit()
    {
        var playerLimits = new PlayerLimits
        {
            WaitingPeriodInDays = 5,
            Limits = new List<Limit>
            {
                new ()
                {
                    LimitType = "SYSTEM_SET_AFFORDABILITY_LTM_LIMIT",
                    CurrentLimit = 200,
                },
                new ()
                {
                    LimitType = null,
                    CurrentLimit = 200,
                },
                new ()
                {
                    LimitType = "PP_SET_AFFORDABILITY_MONTHLY_LIMIT",
                    CurrentLimit = 100,
                },
            },
        };
        var customerNetDeposits = new CustomerNetDepositDto(new List<CustomerNetDepositAmount>
        {
            new ()
            {
                Amount = 140,
            },
            new ()
            {
                Amount = -50,
            },
        });

        posApiResponsibleGamingService.Setup(o => o.GetPlayerLimitsAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(playerLimits);
        posApiWalletServiceInternal
            .Setup(o => o.GetCustomerNetDeposit(It.IsAny<CancellationToken>(), "MONTHLY", false))
            .ReturnsAsync(customerNetDeposits);

        var result = (OkObjectResult)await target.GetLossLimit(ct);

        result.Value.Should().BeEquivalentTo(new
        {
            totalNetDeposit = 90,
            limitType = "MONTHLY",
            totalLossLimit = 100,
        });
    }

    [Fact]
    public async Task GetLossLimit_ShouldReturnServerError_IfPosApiException()
    {
        var ex = new PosApiException("PosAPI error.");
        posApiResponsibleGamingService.Setup(s => s.GetPlayerLimitsAsync(It.IsAny<CancellationToken>()))
            .ThrowsAsync(ex);

        var result = (StatusCodeResult)await target.GetLossLimit(ct); // Act

        result.StatusCode.Should().Be(StatusCodes.Status500InternalServerError);
        log.Logged.Single().Verify(LogLevel.Error, ex);
    }

    [Fact]
    public async Task GetLossLimit_ShouldReturnServerError_IfException()
    {
        var ex = new Exception("PosAPI error.");
        posApiResponsibleGamingService.Setup(s => s.GetPlayerLimitsAsync(It.IsAny<CancellationToken>()))
            .ThrowsAsync(ex);

        var result = (StatusCodeResult)await target.GetLossLimit(ct); // Act

        result.StatusCode.Should().Be(StatusCodes.Status500InternalServerError);
        log.Logged.Single().Verify(LogLevel.Error, ex);
    }

    [Fact]
    public async Task GetNetDeposit_ShouldReturnNetDepositV2()
    {
        var netInfo = new NetLossInfoDto(15M, 40M, 25M);

        posApiWalletServiceInternal
            .Setup(o => o.GetNetLossInfoV2Async(It.IsAny<CancellationToken>(), "user_level", It.IsAny<UtcDateTime>(), It.IsAny<UtcDateTime>(), false))
            .ReturnsAsync(netInfo);

        var result = (OkObjectResult)await target.GetNetDeposit("user_level", 7, ct);

        result.Value.Should().BeEquivalentTo(new
        {
            NetLoss = 15M,
            NetDeposit = 40M,
            NetWithdrawal = 25M,
        });
    }

    [Fact]
    public async Task GetNetDeposit_ShouldReturnServerError_IfPosApiException()
    {
        var ex = new PosApiException("PosAPI error.");
        posApiWalletServiceInternal.Setup(s =>
                s.GetNetLossInfoV2Async(It.IsAny<CancellationToken>(), It.IsAny<string>(), It.IsAny<UtcDateTime>(), It.IsAny<UtcDateTime>(), false))
            .ThrowsAsync(ex);

        var result = await target.GetNetDeposit("test", 7, ct); // Act

        result.Should().BeOfType<BadRequestObjectResult>();
        log.Logged.Single().Verify(LogLevel.Error, ex);
    }

    [Fact]
    public async Task GetNetDeposit_ShouldReturnServerError_IfException()
    {
        var ex = new Exception("PosAPI error.");
        posApiWalletServiceInternal.Setup(s =>
                s.GetNetLossInfoV2Async(It.IsAny<CancellationToken>(), It.IsAny<string>(), It.IsAny<UtcDateTime>(), It.IsAny<UtcDateTime>(), false))
            .ThrowsAsync(ex);

        var result = await target.GetNetDeposit("test", 7, ct); // Act

        result.Should().BeOfType<BadRequestObjectResult>();
        log.Logged.Single().Verify(LogLevel.Error, ex);
    }

    [Fact]
    public async Task GetProfitLoss_ShouldReturnProfitLoss()
    {
        var profitLossSummaryDto = new ProfitLossSummaryDto(15M, 40M,  50M, 80M, 175M);

        posApiWalletServiceInternal.Setup(o =>
                o.GetProfitLossSummaryAsync(It.IsAny<CancellationToken>(), It.IsAny<UtcDateTime>(), It.IsAny<UtcDateTime>(), It.IsAny<string>(), false))
            .ReturnsAsync(profitLossSummaryDto);

        var result = (OkObjectResult)await target.GetProfitLoss(2, ct);

        result.Value.Should().BeEquivalentTo(new
        {
            totalReturn = 15M,
            totalStake = 40M,
            weeklyAverage = 50M,
            monthlyAverage = 80M,
            yearlyAverage = 175M,
        });
        posApiWalletServiceInternal.Verify(c => c.GetProfitLossSummaryAsync(
            It.IsAny<CancellationToken>(),
            It.Is<UtcDateTime>(utc =>
                utc.Value.Year == 2021 && utc.Value.Month == 7 && utc.Value.Day == 7 && utc.Value.Hour == 0 && utc.Value.Minute == 0 && utc.Value.Second == 0),
            It.Is<UtcDateTime>(utc =>
                utc.Value.Year == 2021 && utc.Value.Month == 7 && utc.Value.Day == 8 && utc.Value.Hour == 14 && utc.Value.Minute == 5 && utc.Value.Second == 6),
            "daily",
            false));
    }

    [Fact]
    public async Task GetProfitLoss_ShouldReturnDefaultValues_IfPosApiException_8000()
    {
        var ex = new PosApiException("PosAPI error.", posApiCode: 8000);
        posApiWalletServiceInternal.Setup(s =>
            s.GetProfitLossSummaryAsync(It.IsAny<CancellationToken>(), It.IsAny<UtcDateTime>(), It.IsAny<UtcDateTime>(), It.IsAny<string>(), false)).ThrowsAsync(ex);

        var result = (OkObjectResult)await target.GetProfitLoss(2, ct); // Act

        result.Value.Should().BeEquivalentTo(new
        {
            totalReturn = 0,
            totalStake = 0,
        });
        log.Logged.Single().Verify(LogLevel.Warning, ex, ("posApiCode", 8000), ("posApiMessage", null));
    }

    [Fact]
    public async Task GetProfitLoss_ShouldReturnServerError_IfPosApiException()
    {
        var ex = new PosApiException("PosAPI error.");
        posApiWalletServiceInternal.Setup(s =>
            s.GetProfitLossSummaryAsync(It.IsAny<CancellationToken>(), It.IsAny<UtcDateTime>(), It.IsAny<UtcDateTime>(), It.IsAny<string>(), false)).ThrowsAsync(ex);

        var result = await target.GetProfitLoss(2, ct); // Act

        result.Should().BeOfType<BadRequestObjectResult>();
        log.Logged.Single().Verify(LogLevel.Error, ex);
    }

    [Fact]
    public async Task GetProfitLoss_ShouldReturnServerError_IfException()
    {
        var ex = new Exception("PosAPI error.");
        posApiWalletServiceInternal.Setup(s =>
            s.GetProfitLossSummaryAsync(It.IsAny<CancellationToken>(), It.IsAny<UtcDateTime>(), It.IsAny<UtcDateTime>(), It.IsAny<string>(), false)).ThrowsAsync(ex);

        var result = await target.GetProfitLoss(2, ct); // Act

        result.Should().BeOfType<BadRequestObjectResult>();
        log.Logged.Single().Verify(LogLevel.Error, ex);
    }

    [Fact]
    public async Task GetCurrentSessionProfitLoss_ShouldReturnCurrentSessionProfitLoss()
    {
        var startTime = new UtcDateTime(2020, 1, 1);
        posapiAuthenticationService.Setup(a => a.GetCurrentSessionAsync(ct))
            .ReturnsAsync(new CurrentSession(startTime));
        var profitLossSummaryDto = new ProfitLossSummaryDto(15M, 40M, 50M, 80M, 175M);

        posApiWalletServiceInternal.Setup(o => o.GetProfitLossSummaryAsync(It.IsAny<CancellationToken>(), startTime, It.IsAny<UtcDateTime>(), It.IsAny<string>(), false))
            .ReturnsAsync(profitLossSummaryDto);

        var result = (OkObjectResult)await target.GetCurrentSessionProfitLoss(ct);

        result.Value.Should().BeEquivalentTo(new
        {
            totalReturn = 15M,
            totalStake = 40M,
            weeklyAverage = 50M,
            monthlyAverage = 80M,
            yearlyAverage = 175M,
        });
        posApiWalletServiceInternal.Verify(c => c.GetProfitLossSummaryAsync(
            It.IsAny<CancellationToken>(),
            It.Is<UtcDateTime>(utc =>
                utc.Value.Year == 2020 && utc.Value.Month == 1 && utc.Value.Day == 1 && utc.Value.Hour == 0 && utc.Value.Minute == 0 && utc.Value.Second == 0),
            It.Is<UtcDateTime>(utc =>
                utc.Value.Year == 2021 && utc.Value.Month == 7 && utc.Value.Day == 8 && utc.Value.Hour == 14 && utc.Value.Minute == 5 && utc.Value.Second == 6),
            "daily",
            false));
    }

    [Fact]
    public async Task GetTimeSpent_ShouldReturnTimeSpent()
    {
        if (!OperatingSystem.IsWindows()) return;

        const string aggregationType = "WEEKLY";
        var sessionSummary = new SessionSummaryResponse(aggregationType, new SessionSummary());

        posapiAuthenticationService.Setup(o => o.GetSessionSummaryAsync(
                It.IsAny<CancellationToken>(),
                It.IsAny<UtcDateTime>(),
                It.IsAny<UtcDateTime>(),
                aggregationType,
                It.IsAny<string>(),
                false))
            .ReturnsAsync(sessionSummary);

        var result = (OkObjectResult)await target.GetTimeSpent(aggregationType, ct);

        result.Value.Should().BeEquivalentTo(new
        {
            sessionSummary.AggregationType,
            sessionSummary.SessionSummary,
        });

        posapiAuthenticationService.Verify(c => c.GetSessionSummaryAsync(
            It.IsAny<CancellationToken>(),
            It.Is<UtcDateTime>(utc => utc.Value.DayOfWeek == DayOfWeek.Monday),
            It.Is<UtcDateTime>(utc => utc.Value.DayOfWeek == DayOfWeek.Sunday),
            "WEEKLY",
            It.IsAny<string>(),
            false));
    }

    [Fact]
    public async Task GetAverageDeposit_ShouldReturnAverageDeposit()
    {
        var averageDepositDto = new AverageDepositDto(40M, 15M);

        posApiWalletServiceInternal.Setup(o =>
                o.GetAverageDeposit(It.IsAny<CancellationToken>(), It.IsAny<int>(), false))
            .ReturnsAsync(averageDepositDto);

        var result = (OkObjectResult)await target.GetAverageDeposit(ct, 7);

        result.Value.Should().BeEquivalentTo(new
        {
            labelAverageDepositAmount = 40M,
            userAverageDepositAmount = 15M,
        });
        posApiWalletServiceInternal.Verify(c => c.GetAverageDeposit(
            It.IsAny<CancellationToken>(),
            7,
            false));
    }
}
