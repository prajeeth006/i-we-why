using System;
using System.Collections.Generic;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.WebUtilities;
using Microsoft.Extensions.Primitives;

namespace Frontend.Vanilla.Features.DslProviders;

/// <summary>
/// Implementation of <see cref="IQueryStringDslProvider" /> for ASP.NET 4 apps.
/// </summary>
internal sealed class QueryStringDslProvider(IBrowserUrlProvider browserUrlProvider) : IQueryStringDslProvider
{
    public string Get(string name)
    {
        var queryString = QueryUtil.Parse(browserUrlProvider.Url.Query);

        return queryString.GetValue(name).ToString();
    }

    public void Remove(string name)
        => ModifyQueryString(qs => qs.Remove(name));

    public void Set(string name, string value)
        => ModifyQueryString(qs => qs[name] = value);

    private void ModifyQueryString(Action<Dictionary<string, StringValues>> modifyAction)
    {
        var builder = new UriBuilder(browserUrlProvider.Url);
        var queryString = QueryUtil.Parse(builder.Query);

        modifyAction(queryString);
        builder.Query = QueryUtil.Build(queryString);
        browserUrlProvider.EnqueueRedirect(builder.GetHttpUri());
    }
}
