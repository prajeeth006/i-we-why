using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.Features.Kyc;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Account;
using Frontend.Vanilla.ServiceClients.Services.Authentication;
using Frontend.Vanilla.ServiceClients.Services.Crm2;
using Frontend.Vanilla.ServiceClients.Services.Kyc;
using Frontend.Vanilla.ServiceClients.Services.Upload;
using Frontend.Vanilla.ServiceClients.Services.Wallet;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.KycStatus;

[ApiController]
[Route("{culture}/api/[controller]")]
public sealed class KycStatusController : BaseController
{
    private readonly IKycService kycService;
    private readonly IPosApiWalletServiceInternal walletService;
    private readonly ICrmService crmService;
    private readonly IPosApiUploadServiceInternal posApiUploadServiceInternal;
    private readonly IPosApiAccountService accountService;
    private readonly IPosApiAuthenticationService authenticationService;
    private readonly IKycConfiguration config;
    private readonly ILogger<KycStatusController> logger;

    public KycStatusController(IServiceProvider provider, IPosApiAccountService accountService)
        : this(provider.GetRequiredService<IKycService>(),
            provider.GetRequiredService<IPosApiWalletServiceInternal>(),
            provider.GetRequiredService<ICrmService>(),
            provider.GetRequiredService<IPosApiUploadServiceInternal>(),
            accountService,
            provider.GetRequiredService<IPosApiAuthenticationService>(),
            provider.GetRequiredService<IKycConfiguration>(),
            provider.GetRequiredService<ILogger<KycStatusController>>()) { }

    internal KycStatusController(
        IKycService kycService,
        IPosApiWalletServiceInternal walletService,
        ICrmService crmService,
        IPosApiUploadServiceInternal posApiUploadServiceInternal,
        IPosApiAccountService accountService,
        IPosApiAuthenticationService authenticationService,
        IKycConfiguration config,
        ILogger<KycStatusController> logger)
    {
        this.kycService = kycService;
        this.walletService = walletService;
        this.crmService = crmService;
        this.posApiUploadServiceInternal = posApiUploadServiceInternal;
        this.accountService = accountService;
        this.authenticationService = authenticationService;
        this.config = config;
        this.logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken cancellationToken, bool cached, string? useCase)
    {
        var mode = ExecutionMode.Async(cancellationToken);

        try
        {
            var kycStatusTask = kycService.GetKycStatusAsync(mode, cached);
            var getOfferedBonusesTask = crmService.GetOfferedBonusesAsync(mode);
            var documentUploadStatusTask = posApiUploadServiceInternal.GetDocumentUploadStatusAsync(mode, cached, useCase);
            var cashierStatusTask = accountService.GetCashierStatusAsync(mode);
            var bankAccountRegisteredTask = walletService.IsBankAccountRegisteredAsync(mode);
            var verificationStatusTask = authenticationService.GetCommVerificationStatusAsync(cancellationToken, cached);

            IKycInfoForRibbon? ribbonStatus = null;

            if (config.IsRibbonStatusEnabled)
            {
                ribbonStatus = await kycService.GetKycInfoForRibbonAsync(mode);
            }

            var kycStatus = await kycStatusTask;
            var otpVerificationStatus = await verificationStatusTask;
            var userHasBonuses = (await getOfferedBonusesTask).Any();
            var documentUploadStatus = await documentUploadStatusTask;
            var depositSuppressed = (await cashierStatusTask).IsDepositSuppressed;
            var isCommVerified = otpVerificationStatus.Any(k => k.Value.ToLower() == "verified");
            var isMobileNumberVerified =
                otpVerificationStatus.Any(k => k.Key.ToLower() == "mobile" && k.Value.ToLower() == "verified");
            var isEmailVerified =
                otpVerificationStatus.Any(k => k.Key.ToLower() == "email" && k.Value.ToLower() == "verified");

            bool.TryParse(kycStatus.AdditionalKycInfo?.FirstOrDefault(a => a.Key == "isBlackListAttempted")?.Value,
                out var isBlackListAttempted);
            bool.TryParse(kycStatus.AdditionalKycInfo?.FirstOrDefault(a => a.Key == "isTransitionPlayer")?.Value,
                out var isTransitionPlayer);

            var bankAccountIsRegistered = false;

            try
            {
                bankAccountIsRegistered = await bankAccountRegisteredTask;
            }
            catch
            {
                // ignored
            }

            return Ok(new
            {
                accountStatus = kycStatus.AccountStatus.ToString(),
                accountVerificationIsRequired = kycStatus.F2FVerificationRequired,
                additionalRibbonInfo = ribbonStatus?.AdditionalInfo,
                addressVerificationStatus = kycStatus.AddressVerificationStatus.ToString(),
                ageVerificationStatus = kycStatus.AgeVerificationStatus.ToString(),
                bankAccountIsRegistered,
                bankIdVerificationStatus = kycStatus.BankIdVerificationStatus.ToString(),
                depositSuppressed,
                documentUploadStatus.DocsPendingWith,
                documentUploadStatusIsPending = documentUploadStatus.IsPending,
                emailVerificationStatus = kycStatus.EmailVerificationStatus.ToString(),
                graceDaysUnit = kycStatus.GraceDaysUnit ?? string.Empty,
                idVerificationStatus = kycStatus.IdVerificationStatus.ToString(),
                isBlackListAttempted,
                isCommVerified,
                isEmailVerified,
                isMobileNumberVerified,
                isTransitionPlayer,
                kycAuthenticationStatus = kycStatus.GetKycAuthenticationStatus(),
                kycStatus.AdditionalKycInfo,
                kycStatus.AmlVerificationStatus,
                kycStatus.BlackListVerificationStatus,
                kycStatus.Custom3,
                kycStatus.Custom4,
                kycStatus.DepositGraceDays,
                kycStatus.F2FVerificationRequired,
                kycStatus.GraceDaysBeforeNextAction,
                kycStatus.IdVerificationGraceDays,
                kycStatus.IsKycStarted,
                kycStatus.KycAttempts,
                kycStatus.KycMaxAttempts,
                kycStatus.KycMaxAttemptsReached,
                kycStatus.KycVerified,
                kycStatus.PartiallyVerified,
                kycStatus.SsnVerificationAttempts,
                kycStatus.SsnVerificationMaxAttempts,
                kycStatus.SsnVerificationMaxAttemptsReached,
                kycStatus.ThirdPartyVerificationStatus,
                kycStatus.VerificationDaysLeft,
                personalIdVerificationStatus = kycStatus.PersonalIdVerificationStatus.ToString(),
                ribbonStatusCode = ribbonStatus?.StatusCode,
                ribbonStatusMessage = ribbonStatus?.StatusMessage,
                secretPinVerificationStatus = kycStatus.SecretPinVerificationStatus.ToString(),
                ssnVerificationStatus = kycStatus.SsnVerificationStatus.ToString(),
                userHasBonuses,
                verificationStatus = kycStatus.VerificationStatus.ToString(),
                verificationType = kycStatus.VerificationType.ToString(),
            });
        }
        catch (PosApiException posEx)
        {
            logger.LogError(posEx, "Error from PosApi while retrieving KycStatus information");

            return StatusCode(StatusCodes.Status500InternalServerError);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "General error while retrieving KycStatus information");

            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }
}
