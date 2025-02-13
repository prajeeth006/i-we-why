using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Account.RegistrationDates;

internal sealed class RegistrationDateResponse : IPosApiResponse<UtcDateTime>
{
    public UtcDateTime RegistrationDate { get; set; }
    public UtcDateTime GetData() => RegistrationDate;
}
