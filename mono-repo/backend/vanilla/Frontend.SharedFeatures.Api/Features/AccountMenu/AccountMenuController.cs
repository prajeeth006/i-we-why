using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Time;
using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Authentication;
using Frontend.Vanilla.ServiceClients.Services.Crm2;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming;
using Frontend.Vanilla.ServiceClients.Services.Wallet;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.AccountMenu;

[Authorize]
[Route("{culture}/api/[controller]")]
[ApiController]
public sealed class AccountMenuController : BaseController
{
    private readonly ICrmService crmService;
    private readonly IPosApiResponsibleGamingServiceInternal posApiResponsibleGamingServiceInternal;
    private readonly IPosApiWalletServiceInternal posApiWalletServiceInternal;
    private readonly ICurrentUserAccessor currentUserAccessor;
    private readonly IPosApiAuthenticationService posApiAuthenticationService;
    private readonly IClock clock;
    private readonly ILogger<AccountMenuController> log;
    private const string Monthly = "MONTHLY";
    private const string Yearly = "YEARLY";

    private static readonly List<string> LimitTypes =
    [
        "SYSTEM_SET_AFFORDABILITY_MONTHLY_LIMIT",
        "PP_SET_AFFORDABILITY_MONTHLY_LIMIT",
        "SYSTEM_SET_AFFORDABILITY_LTM_LIMIT",
        "PP_SET_AFFORDABILITY_LTM_LIMIT",
    ];

    private static class ErrorCodes
    {
        public const int NoDataFound = 8000;
        public const int SessionSummaryNoRecordFound = 3;
        public const int NotFound = -2;
    }

    public AccountMenuController(
        IServiceProvider container,
        IPosApiAuthenticationService posApiAuthenticationService,
        ILogger<AccountMenuController> log)
        : this(container.GetRequiredService<ICrmService>(),
            posApiAuthenticationService,
            container.GetRequiredService<IPosApiResponsibleGamingServiceInternal>(),
            container.GetRequiredService<IPosApiWalletServiceInternal>(),
            container.GetRequiredService<IClock>(),
            container.GetRequiredService<ICurrentUserAccessor>(),
            log) { }

    internal AccountMenuController(ICrmService crmService,
        IPosApiAuthenticationService posApiAuthenticationService,
        IPosApiResponsibleGamingServiceInternal posApiResponsibleGamingServiceInternal,
        IPosApiWalletServiceInternal posApiWalletServiceInternal,
        IClock clock,
        ICurrentUserAccessor currentUserAccessor,
        ILogger<AccountMenuController> log)
    {
        this.crmService = crmService;
        this.posApiAuthenticationService = posApiAuthenticationService;
        this.posApiResponsibleGamingServiceInternal = posApiResponsibleGamingServiceInternal;
        this.posApiWalletServiceInternal = posApiWalletServiceInternal;
        this.currentUserAccessor = currentUserAccessor;
        this.clock = clock;
        this.log = log;
    }

    [HttpGet("cashback")]
    public async Task<IActionResult> GetCashback(CancellationToken cancellationToken)
    {
        var cashback = await crmService.GetCashbackAsync(cancellationToken);

        return OkResult(cashback);
    }

    [HttpGet("coralcashback")]
    public async Task<IActionResult> GetCoralCashback(CancellationToken cancellationToken)
    {
        var cashback = await crmService.GetCashbackV2Async(cancellationToken);

        return OkResult(cashback);
    }

    [HttpGet("pokercashback")]
    public async Task<IActionResult> GetPokerCashback(CancellationToken cancellationToken)
    {
        var cashback = await crmService.GetCurrentWeekPokerPointsAsync(cancellationToken);

        return OkResult(cashback);
    }

    [HttpGet("mlifeprofile")]
    public async Task<IActionResult> GetMLifeProfile(CancellationToken cancellationToken)
    {
        var mlife = await crmService.GetMLifeProfileAsync(cancellationToken);

        return OkResult(mlife);
    }

    [HttpGet("profitloss")]
    public async Task<IActionResult> GetProfitLoss(int range, CancellationToken cancellationToken)
    {
        try
        {
            var endDate = clock.UtcNow;
            var startDateFromMidnight = new UtcDateTime(clock.UtcNow.AddDays(-(range - 1)).Value.Date);

            var profitLossSummary = await posApiWalletServiceInternal.GetProfitLossSummaryAsync(cancellationToken, startDateFromMidnight, endDate, "daily", false);

            return Ok(new
            {
                weeklyAverage = profitLossSummary.WeeklyAverage,
                monthlyAverage = profitLossSummary.MonthlyAverage,
                yearlyAverage = profitLossSummary.YearlyAverage,
                totalStake = profitLossSummary.TotalStake,
                totalReturn = profitLossSummary.TotalReturn,
            });
        }
        catch (PosApiException posEx) when (posEx.PosApiCode == ErrorCodes.NoDataFound)
        {
            log.LogWarning(posEx, "Error from PosApi while building profit loss with {posApiCode} {posApiMessage}", posEx.PosApiCode, posEx.PosApiMessage);

            return Ok(new
            {
                weeklyAverage = 0,
                monthlyAverage = 0,
                yearlyAverage = 0,
                totalStake = 0,
                totalReturn = 0,
            });
        }
        catch (PosApiException posEx)
        {
            log.LogError(posEx, "Error from PosApi while building profit loss");

            return BadRequest();
        }
        catch (Exception ex)
        {
            log.LogError(ex, "General error while building profit loss");

            return BadRequest();
        }
    }

    [HttpGet("currentsessionprofitloss")]
    public async Task<IActionResult> GetCurrentSessionProfitLoss(CancellationToken cancellationToken)
    {
        try
        {
            var currentSession = await posApiAuthenticationService.GetCurrentSessionAsync(cancellationToken);
            var startDate = currentSession.StartTime;
            var endDate = clock.UtcNow;
            var profitLossSummary = await posApiWalletServiceInternal.GetProfitLossSummaryAsync(cancellationToken, startDate, endDate, "daily", false);

            return Ok(new
            {
                weeklyAverage = profitLossSummary.WeeklyAverage,
                monthlyAverage = profitLossSummary.MonthlyAverage,
                yearlyAverage = profitLossSummary.YearlyAverage,
                totalStake = profitLossSummary.TotalStake,
                totalReturn = profitLossSummary.TotalReturn,
            });
        }
        catch (PosApiException posEx) when (posEx.PosApiCode == ErrorCodes.NoDataFound)
        {
            log.LogWarning(posEx, "Error from PosApi while building profit loss with {posApiCode} {posApiMessage}", posEx.PosApiCode, posEx.PosApiMessage);

            return Ok(new
            {
                totalStake = 0,
                totalReturn = 0,
                weeklyAverage = 0,
                monthlyAverage = 0,
                yearlyAverage = 0,
            });
        }
        catch (PosApiException posEx)
        {
            log.LogError(posEx, "Error from PosApi while building profit loss");

            return BadRequest();
        }
        catch (Exception ex)
        {
            log.LogError(ex, "General error while building profit loss");

            return BadRequest();
        }
    }

    [HttpGet("netdeposit")]
    public async Task<IActionResult> GetNetDeposit(string level, int days, CancellationToken cancellationToken)
    {
        try
        {
            var endDate = clock.UtcNow;
            var startDate = new UtcDateTime(clock.UtcNow.AddDays(-days).Value.Date.ToUniversalTime());

            var netDeposit = await posApiWalletServiceInternal.GetNetLossInfoV2Async(cancellationToken, level, startDate, endDate, false);

            return OkResult(netDeposit);
        }
        catch (PosApiException posEx)
        {
            log.LogError(posEx, "Error from PosApi while building net deposit");

            return BadRequest();
        }
        catch (Exception ex)
        {
            log.LogError(ex, "General error while building net deposit");

            return BadRequest();
        }
    }

    [HttpGet("losslimit")]
    public async Task<IActionResult> GetLossLimit(CancellationToken cancellationToken)
    {
        try
        {
            var playerLimits = await posApiResponsibleGamingServiceInternal.GetPlayerLimitsAsync(cancellationToken);
            var playerLimit = playerLimits.Limits.Where(p =>
                    p.LimitType != null &&
                    LimitTypes.Any(l => l.Equals(p.LimitType, StringComparison.OrdinalIgnoreCase)))
                .OrderBy(p => LimitTypes.IndexOf(p.LimitType)).FirstOrDefault(p =>
                    LimitTypes.Any(l => l.Equals(p.LimitType, StringComparison.OrdinalIgnoreCase)));
            var limitType = playerLimit != null && playerLimit.LimitType.Contains(Monthly) ? Monthly : Yearly;

            var customerNetDeposit =
                await posApiWalletServiceInternal.GetCustomerNetDeposit(cancellationToken, limitType, false);
            var totalNetDeposit = customerNetDeposit?.CustomerNetDepositAmounts.Sum(c => c.Amount);

            return Ok(new
            {
                totalNetDeposit,
                limitType,
                totalLossLimit = playerLimit?.CurrentLimit,
            });
        }
        catch (PosApiException posEx)
        {
            log.LogError(posEx, "Error from PosApi while building loss limit");

            return StatusCode(StatusCodes.Status500InternalServerError);
        }
        catch (Exception ex)
        {
            log.LogError(ex, "General error while while building loss limit");

            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    [HttpGet("timespent")]
    public async Task<IActionResult> GetTimeSpent(string aggregationType, CancellationToken cancellationToken)
    {
        try
        {
            var startRange = 0;
            var endRange = 1;

            switch (aggregationType)
            {
                case "DAILY":
                    startRange = 0;

                    break;
                case "WEEKLY":
                    startRange = (int)clock.UtcNow.Value.DayOfWeek - (int)DayOfWeek.Monday;
                    endRange = 7;

                    break;
                case "YEARLY":
                    startRange = new DateTime(clock.UtcNow.Value.Year, 1, 1).DayOfYear;

                    break;
            }

            var startDate = new UtcDateTime(clock.UtcNow.AddDays(-startRange).Value.Date);
            var endDate = startDate.AddDays(endRange).AddSeconds(-1);

            // Take the previous period if current one is not complete
            if (endDate > clock.UtcNow)
            {
                startDate = startDate.AddDays(-endRange);
                endDate = endDate.AddDays(-endRange);
            }

            var timezoneClaimValue = currentUserAccessor.User.Claims.FirstOrDefault(c => c.Type.EndsWith("/timezone", StringComparison.OrdinalIgnoreCase))?.Value;

            if (timezoneClaimValue == null)
            {
                throw new Exception("User timezone claim value is null.");
            }

            var timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById(timezoneClaimValue);
            var timeZone = timeZoneInfo.DisplayName.Split('(', ')')[1].Replace("UTC", "GMT");

            var sessionSummary = await posApiAuthenticationService.GetSessionSummaryAsync(cancellationToken, startDate, endDate, aggregationType, timeZone, false);

            return Ok(new
            {
                sessionSummary.AggregationType,
                sessionSummary.SessionSummary,
                startDate = startDate.Value,
                endDate = endDate.Value,
            });
        }
        catch (PosApiException posEx) when (posEx.PosApiCode == ErrorCodes.SessionSummaryNoRecordFound)
        {
            log.LogWarning(posEx, "Error from PosApi while building arc session summary with {posApiCode} {posApiMessage}", posEx.PosApiCode, posEx.PosApiMessage);

            return Ok(new
            {
                AggregationType = 0,
                SessionSummary = default(object),
            });
        }
        catch (PosApiException posEx)
        {
            log.LogError(posEx, "Error from PosApi while building arc session summary");

            return BadRequest();
        }
        catch (Exception ex)
        {
            log.LogError(ex, "General error while building arc session summary");

            return BadRequest();
        }
    }

    [HttpGet("averagedeposit")]
    public async Task<IActionResult> GetAverageDeposit(CancellationToken cancellationToken, int days)
    {
        try
        {
            var averageDeposit = await posApiWalletServiceInternal.GetAverageDeposit(cancellationToken, days, false);

            return Ok(new
            {
                labelAverageDepositAmount = averageDeposit.LabelAverageDepositAmount,
                userAverageDepositAmount = averageDeposit.UserAverageDepositAmount,
            });
        }
        catch (PosApiException posEx) when (posEx.PosApiCode == ErrorCodes.NotFound)
        {
            log.LogWarning(posEx, "Error from PosApi while building average deposit with {posApiCode} {posApiMessage}", posEx.PosApiCode, posEx.PosApiMessage);

            return Ok(new
            {
                labelAverageDepositAmount = 0,
                userAverageDepositAmount = 0,
            });
        }
        catch (PosApiException posEx)
        {
            log.LogError(posEx, "Error from PosApi while building average deposit");

            return StatusCode(StatusCodes.Status500InternalServerError);
        }
        catch (Exception ex)
        {
            log.LogError(ex, "General error while while building average deposit");

            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }
}
