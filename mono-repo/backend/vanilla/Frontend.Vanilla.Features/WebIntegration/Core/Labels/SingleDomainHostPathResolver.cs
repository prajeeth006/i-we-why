using Frontend.Vanilla.Core.System.Text;
using Microsoft.AspNetCore.Http;
using System;
using System.Linq;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Features.WebUtilities;

namespace Frontend.Vanilla.Features.WebIntegration.Core.Labels;

internal interface ISingleDomainHostPathResolver
{
    string Resolve(HttpContext context);
    string Resolve(string product);
    string ResolveProduct(HttpContext context);
}

internal sealed class SingleDomainHostPathResolver(IHostPathResolver hostPathResolver, IDefaultProductResolver defaultProductResolver) : ISingleDomainHostPathResolver
{
    private static readonly char[] Separator = ['/'];

    public string Resolve(HttpContext context)
    {
        var path = GetPath(context);
        return ResolveFrom(path);
    }

    public string ResolveProduct(HttpContext context)
    {
        var hostPath = Resolve(context);
        if (hostPath is "myaccount")
        {
            return "portal"; // TODO: hack remove once single domain migration is over and  product: myaccount change is in dynacon https://admin.dynacon.prod.env.works/services/462491/features/462492/keys/464544/valuematrix?_matchAncestors=true
        }
        var currentProduct = hostPathResolver.GetAllHostPaths().FirstOrDefault(p => p.Value.EqualsIgnoreCase(hostPath)).Key;
        return currentProduct ?? defaultProductResolver.Resolve();
    }

    private static PathString GetPath(HttpContext context)
    {
        var urlFromQuery = context.Request.Query[BrowserUrlProvider.QueryParameter];
        if (Uri.TryCreate(urlFromQuery, UriKind.Absolute, out var urlFromQueryUri))
        {
            return urlFromQueryUri.AbsolutePath;
        }

        var urlFromHeader = context.Request.Headers[HttpHeaders.XBrowserUrl];
        if (Uri.TryCreate(urlFromHeader, UriKind.Absolute, out var urlFromHeaderUri))
        {
            return urlFromHeaderUri.AbsolutePath;
        }

        return context.Request.Path;
    }

    private string ResolveFrom(PathString requestPath)
    {
        var segments = requestPath.Value?.Split(Separator, StringSplitOptions.RemoveEmptyEntries);
        if (segments is null || segments.Length < 2)
        {
            var defaultProduct = defaultProductResolver.Resolve();
            return Resolve(defaultProduct);
        }

        if (Enum.TryParse<HostPath>(segments[1], true, out var hostPath))
        {
            return hostPath.ToString();
        }

        if (requestPath.StartsWithSegments("/health"))
        {
            var defaultProduct = defaultProductResolver.Resolve();
            return Resolve(defaultProduct);
        }

        return segments[1];
    }

    public string Resolve(string product)
    {
        var path = hostPathResolver.GetAllHostPaths().FirstOrDefault(x => x.Key.EqualsIgnoreCase(product));
        return !path.Value.IsNullOrEmpty() ? path.Value : throw new FormatException($"Failed to resolve {nameof(HostPath)} for '{product}'.");
    }
}
