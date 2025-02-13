using System.Linq;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.LivePerson;

internal sealed class LivePersonClientConfigProvider(ILivePersonConfiguration config) : LambdaClientConfigProvider("vnLivePerson",
    async ct => new
    {
        config.AccountId,
        ShowInvite = await config.ShowInvite.EvaluateAsync(ct),
        ConditionalEvents = config.ConditionalEvents.Select(o => new
        {
            EventName = o.Key,
            o.Value.UrlRegex,
            TimeoutMilliseconds = o.Value.Timeout.TotalMilliseconds,
        }).ToList().NullToEmpty(),
    })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
