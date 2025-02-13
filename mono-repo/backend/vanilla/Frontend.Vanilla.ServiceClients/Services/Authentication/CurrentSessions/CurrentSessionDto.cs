using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Authentication.CurrentSessions;

internal sealed class CurrentSessionDto : IPosApiResponse<CurrentSession>
{
    public UtcDateTime StartTimeUtc { get; set; }
    public UtcDateTime ExpirationTimeUtc { get; set; }
    public bool IsAutomaticLogoutRequired { get; set; }

    public CurrentSession GetData() => new CurrentSession(StartTimeUtc, ExpirationTimeUtc, IsAutomaticLogoutRequired);
}
