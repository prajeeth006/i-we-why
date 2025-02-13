using System.Collections.Generic;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using JetBrains.Annotations;

namespace Frontend.Vanilla.ServiceClients.Services.Authentication.OTP;

internal interface IVerificationStatusServiceClient
{
    [NotNull, ItemNotNull]
    Task<IReadOnlyDictionary<string, string>> GetAsync(ExecutionMode mode, bool cached);
}

internal sealed class VerificationStatusServiceClient(IPosApiRestClient restClient, IPosApiDataCache cache, IServiceClientsConfiguration config) : IVerificationStatusServiceClient
{
    public Task<IReadOnlyDictionary<string, string>> GetAsync(ExecutionMode mode, bool cached)
    {
        const string cacheKey = "OTP.VerificationStatus";
        var expiration = config.CacheTimeEndpoints.GetValue(cacheKey);

        return cache.GetOrCreateAsync(
            mode,
            PosApiDataType.User,
            key: cacheKey,
            async () =>
            {
                var dto = await restClient.ExecuteAsync<VerificationStatusResponse>(mode,
                    new PosApiRestRequest(PosApiEndpoint.Authentication.OtpVerificationStatus)
                    {
                        Authenticate = true,
                    });

                return dto.GetData();
            },
            cached,
            relativeExpiration: expiration);
    }
}
