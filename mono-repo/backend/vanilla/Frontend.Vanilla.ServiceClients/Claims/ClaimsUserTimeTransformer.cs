using System;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Time;
using Frontend.Vanilla.ServiceClients.Security;

namespace Frontend.Vanilla.ServiceClients.Claims;

internal sealed class ClaimsUserTimeTransformer(ICurrentUserAccessor currentUserAccessor) : IUserTimeTransformer
{
    public DateTimeOffset ToUserDateTimeOffset(UtcDateTime time)
    {
        var timeZone = currentUserAccessor.User.GetTimeZone();

        return time.ConvertTo(timeZone);
    }
}
