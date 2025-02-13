using System.Threading;
using System.Threading.Tasks;

namespace Frontend.Vanilla.Features.ClientConfig;

internal interface ICachedUserValuesFlag
{
    Task<bool> GetCached(CancellationToken cancellationToken);
}

// HH: this is now experimentally always false
// Previous logic was:
//  - fresh on full page reload (referrer == null) - this has a BUG that referrer is not null when it has a value on the client and the page is reloaded. Its only cleared when clicking address bar and Enter.
//  - fresh when referrer is cashier
//  - fresh when referrer is in https://admin.dynacon.prod.env.works/services/158727/features/158902/keys/158917/valuematrix?_matchAncestors=true
//  - cached when referrer is on current label
//  - fresh otherwise
// JL: we put this back as part of B-407121
internal sealed class CachedUserValuesFlag(ICachedUserValuesConfig cachedUserValuesConfig) : ICachedUserValuesFlag
{
    public Task<bool> GetCached(CancellationToken cancellationToken) => cachedUserValuesConfig.FetchCachedUserValuesCondition.EvaluateAsync(cancellationToken);
}
