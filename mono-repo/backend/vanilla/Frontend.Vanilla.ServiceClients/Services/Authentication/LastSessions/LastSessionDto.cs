using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Authentication.LastSessions;

internal sealed class LastSessionDto : IPosApiResponse<LastSession>
{
    public bool FirstLogin { get; set; }
    public LastSessionDetailsDto LastSession { get; set; }

    public LastSession GetData()
    {
        Guard.Requires(FirstLogin ^ LastSession != null, nameof(LastSession), "Either FirstLogin is true or LastSession is not null.");

        return new LastSession(LastSession != null ? new LastSessionDetails(LastSession.LoginTimeUtc, LastSession.LogoutTimeUtc) : null);
    }
}

internal sealed class LastSessionDetailsDto
{
    public UtcDateTime LoginTimeUtc { get; set; }
    public UtcDateTime LogoutTimeUtc { get; set; }
}
