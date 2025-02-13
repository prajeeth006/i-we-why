using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Time;
using Frontend.Vanilla.ServiceClients.Services.Authentication;

namespace Frontend.Vanilla.Features.LoginDuration;

internal interface ILoginExpirationProvider
{
    Task<(long?, long?)> GetRemainingTimeAndLoginDurationInMillisecondsAsync(CancellationToken cancellationToken);
}

internal class LoginExpirationProvider(IPosApiAuthenticationServiceInternal posApiAuthenticationService, IClock clock) : ILoginExpirationProvider
{
    public async Task<(long?, long?)> GetRemainingTimeAndLoginDurationInMillisecondsAsync(CancellationToken cancellationToken)
    {
        var currentSession = await posApiAuthenticationService.GetCurrentSessionAsync(cancellationToken);

        TimeSpan? remainingTime = null;

        if (currentSession.IsAutomaticLogoutRequired)
        {
            remainingTime = new[] { currentSession.ExpirationTime - clock.UtcNow, TimeSpan.Zero }.Max();
        }

        var loginDuration = new[] { clock.UtcNow - currentSession.StartTime, TimeSpan.Zero }.Max();

        return (remainingTime != null ? Convert.ToInt64(remainingTime.Value.TotalMilliseconds) : null, Convert.ToInt64(loginDuration.TotalMilliseconds));
    }
}
