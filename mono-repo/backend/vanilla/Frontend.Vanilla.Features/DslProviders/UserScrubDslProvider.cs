using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.UserScrub;

namespace Frontend.Vanilla.Features.DslProviders;

/// <summary>
/// Implementation of <see cref="IUserScrubDslProvider" />.
/// </summary>
internal sealed class UserScrubDslProvider(IUserScrubService userScrubService) : IUserScrubDslProvider
{
    public static readonly IEnumerable<string> DefaultValue = Enumerable.Empty<string>();

    public async Task<bool> IsScrubbedForAsync(ExecutionMode mode, string product)
    {
        var products = await userScrubService.ScrubbedForAsync(mode);

        return products.Contains(product, StringComparer.OrdinalIgnoreCase);
    }
}
