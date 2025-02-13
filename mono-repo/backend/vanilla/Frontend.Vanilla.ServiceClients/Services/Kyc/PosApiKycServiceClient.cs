using System;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Kyc.Models;

namespace Frontend.Vanilla.ServiceClients.Services.Kyc;

internal class PosApiKycServiceClient(IPosApiRestClient restClient, IPosApiDataCache cache, IServiceClientsConfiguration config) : IKycServiceClient
{
    public async Task<IKycStatus> GetKycStatusAsync(ExecutionMode mode, bool cached = true)
    {
        const string cacheKey = "GetKycStatus";
        return await cache.GetOrCreateAsync(mode,
            PosApiDataType.User,
            cacheKey,
            async () =>
            {
                var request = new PosApiRestRequest(PosApiEndpoint.Kyc.KycStatus)
                {
                    Authenticate = true,
                };

                var result = await restClient.ExecuteAsync<KycStatus>(mode, request);

                return new PosApiKycStatus
                {
                    AccountStatus = (KycAccountStatus)result.AccountStatus,
                    AdditionalKycInfo = result.AdditionalKycInfo,
                    AddressVerificationStatus = ParseEnumSafe(result.AddressVerificationStatus, KycVerificationStatus.Unknown),
                    AgeVerificationGraceDays = result.AgeVerificationGraceDays,
                    AgeVerificationGracePeriod = result.AgeVerificationGracePeriod,
                    AgeVerificationStatus = ParseEnumSafe(result.AgeVerificationStatus, KycVerificationStatus.Unknown),
                    AmlVerificationStatus = result.AmlVerificationStatus,
                    BankIdVerificationStatus = (KycBankIdVerificationStatus)result.BankIdVerificationStatus,
                    BlackListVerificationStatus = result.BlackListVerificationStatus,
                    CreateDate = result.CreateDate,
                    Custom3 = result.Custom3,
                    Custom4 = result.Custom4,
                    DepositGraceDays = result.DepositGraceDays,
                    EmailVerificationStatus = (EmailVerificationStatus)result.EmailVerificationStatus,
                    F2FVerificationRequired = result.F2FVerificationRequired,
                    GraceDaysBeforeNextAction = result.GraceDaysBeforeNextAction,
                    GraceDaysUnit = result.GraceDaysUnit,
                    IdVerificationGraceDays = result.IdVerificationGraceDays,
                    IdVerificationGracePeriod = result.IdVerificationGracePeriod,
                    IdVerificationStatus = ParseEnumSafe(result.IdVerificationStatus, KycVerificationStatus.Unknown),
                    IsKycStarted = result.IsKycStarted,
                    KycAttempts = result.KycAttempts,
                    KycMaxAttempts = result.KycMaxAttempts,
                    KycMaxAttemptsReached = result.KycMaxAttemptsReached,
                    KycVerified = result.KycVerified,
                    PartiallyVerified = result.PartiallyVerified,
                    PersonalIdVerificationStatus = (KycPersonalIdVerificationStatus)result.PersonalIdVerificationStatus,
                    SecretPinVerificationStatus = (KycSecretPinVerificationStatus)result.SecretPinVerificationStatus,
                    SsnVerificationAttempts = result.SsnVerificationAttempts,
                    SsnVerificationMaxAttempts = result.SsnVerificationMaxAttempts,
                    SsnVerificationMaxAttemptsReached = result.SsnVerificationMaxAttemptsReached,
                    SsnVerificationStatus = ParseEnumSafe(result.SsnVerificationStatus, KycVerificationStatus.Unknown),
                    ThirdPartyVerificationStatus = result.ThirdPartyVerificationStatus,
                    VerificationDaysLeft = result.VerificationDaysLeft,
                    VerificationStatus = (KycVerificationStatus)result.VerificationStatus,
                    VerificationType = (KycVerificationType)result.VerificationType,
                };
            }, cached,
            config.CacheTimeEndpoints.GetValue(cacheKey));
    }

    public async Task<IKycInfoForRibbon> GetKycInfoForRibbonAsync(ExecutionMode mode)
    {
        return await cache.GetOrCreateAsync(mode,
            PosApiDataType.User,
            "GetKycInfoForRibbon",
            async () =>
            {
                var request = new PosApiRestRequest(PosApiEndpoint.Kyc.KycInfoForRibbon)
                {
                    Authenticate = true,
                };

                var result = await restClient.ExecuteAsync<KycInfoForRibbon>(mode, request);

                return new PosApiKycInfoForRibbon
                {
                    StatusCode = result.StatusCode,
                    StatusMessage = result.StatusMessage,
                    AdditionalInfo = result.AdditionalInfo,
                };
            },
            false);
    }

    private static TEnum ParseEnumSafe<TEnum>(string input, TEnum defaultValue)
        where TEnum : struct => Enum.TryParse(input, true, out TEnum result) ? result : defaultValue;
}
