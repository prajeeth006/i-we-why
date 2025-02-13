using System.Linq;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.ServiceClients.Services.Common;

namespace Frontend.Vanilla.Features.DslProviders;

/// <summary>
/// Implementation of <see cref="IListDslProvider" /> for ASP.NET 4 apps.
/// </summary>
internal sealed class ListDslProvider(IPosApiCommonServiceInternal posApiCommonService) : IListDslProvider
{
    public async Task<bool> ContainsAsync(ExecutionMode mode, string listName, string args)
    {
        var list = await posApiCommonService.GetListAsync(mode, listName);

        return list.Intersect(args.Split(',')).Any();
    }
}
