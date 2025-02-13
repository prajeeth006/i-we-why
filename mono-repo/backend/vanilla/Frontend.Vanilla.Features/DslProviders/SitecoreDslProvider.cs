using System;
using System.Threading.Tasks;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

namespace Frontend.Vanilla.Features.DslProviders;

internal sealed class SitecoreDslProvider(Func<ISitecoreLinkUrlProvider> linkUrlProvider) : ISitecoreDslProvider
{
    private readonly Lazy<ISitecoreLinkUrlProvider> linkUrlProvider = linkUrlProvider.ToLazy();

    public async Task<string> GetLinkAsync(ExecutionMode mode, string contentPath)
    {
        var url = await linkUrlProvider.Value.GetUrlAsync(mode, contentPath);

        return url.ToString();
    }
}
