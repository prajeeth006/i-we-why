using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Account.RegistrationDates;

internal interface IRegistrationDateServiceClient : ICachedUserDataServiceClient<UtcDateTime> { }

internal class RegistrationDateServiceClient(IGetDataServiceClient getDataServiceClient) : CachedUserDataServiceClient<RegistrationDateResponse, UtcDateTime>
    (getDataServiceClient, PosApiEndpoint.Account.RegistrationDate, cacheKey: "RegistrationDate"), IRegistrationDateServiceClient
{
    // Used with distributed cache -> must match between products -> don't change!!!
}
