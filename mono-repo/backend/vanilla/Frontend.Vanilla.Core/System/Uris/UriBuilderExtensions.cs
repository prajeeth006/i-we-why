using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;
using Microsoft.Extensions.Primitives;

namespace Frontend.Vanilla.Core.System.Uris;

/// <summary>
/// Extensions of <see cref="UriBuilder" /> for fluent building of a Uri.
/// </summary>
public static class UriBuilderExtensions
{
    /// <summary>
    /// Appends given path segment to the URL being constructed.
    /// Trailing white-spaces are removed. If you want to keep them, append a slash or encode them.
    /// </summary>
    public static UriBuilder AppendPathSegment(this UriBuilder builder, string segment)
    {
        Guard.NotWhiteSpace(segment, nameof(segment));

        var separator = builder.Path.LastChar() != '/' && segment[0] != '/' ? "/" : null;
        builder.Path += separator + segment;

        return builder;
    }

    /// <summary>Appends trailing slash (if not already present) to the URL being constructed. It eases combination with other relative URLs.</summary>
    public static UriBuilder AppendTrailingSlash(this UriBuilder builder)
    {
        if (builder.Path.LastChar() != '/')
            builder.Path += "/";

        return builder;
    }

    /// <summary>Adds the query string parameters to the URL being constructed. Parameter is added only if its value is not null nor white-space.</summary>
    public static UriBuilder AddQueryParametersIfValueNotWhiteSpace(
        this UriBuilder builder,
        params (string Name, string? Value)[] queryParameters)
        => builder.AddQueryParametersIfValueNotWhiteSpace(queryParameters, default);

    /// <summary>Adds the query string parameters to the URL being constructed. Parameter is added only if its value is not null nor white-space.</summary>
    [Obsolete("Use other overloads.")]
    public static UriBuilder AddQueryParametersIfValueNotWhiteSpace(
        this UriBuilder builder,
        QueryStringDuplicateHandling duplicateHandling,
        params (string Name, string? Value)[] queryParameters)
        => builder.AddQueryParametersIfValueNotWhiteSpace(queryParameters, duplicateHandling);

    /// <summary>Adds the query string parameters to the URL being constructed. Parameter is added only if its value is not null nor white-space.</summary>
    public static UriBuilder AddQueryParametersIfValueNotWhiteSpace(
        this UriBuilder builder,
        IEnumerable<(string Name, string? Value)> queryParameters,
        QueryStringDuplicateHandling duplicateHandling = QueryStringDuplicateHandling.Merge)
        => builder.AddQueryParameters(queryParameters.Where(p => !p.Value.IsNullOrWhiteSpace()), duplicateHandling);

    /// <summary>Adds the query string parameters to the URL being constructed.</summary>
    public static UriBuilder AddQueryParameters(
        this UriBuilder builder,
        params (string Name, string? Value)[] queryParameters)
        => builder.AddQueryParameters(queryParameters, default);

    /// <summary>Adds the query string parameters to the URL being constructed.</summary>
    [Obsolete("Use other overloads.")]
    public static UriBuilder AddQueryParameters(
        this UriBuilder builder,
        QueryStringDuplicateHandling duplicateHandling,
        params (string Name, string? Value)[] queryParameters)
        => builder.AddQueryParameters(queryParameters, duplicateHandling);

    /// <summary>Adds the query string parameters to the URL being constructed.</summary>
    public static UriBuilder AddQueryParameters(
        this UriBuilder builder,
        IEnumerable<(string Name, string? Value)> queryParameters,
        QueryStringDuplicateHandling duplicateHandling = QueryStringDuplicateHandling.Merge)
    {
        Guard.NotNull(builder, nameof(builder));
        Guard.NotNull(queryParameters, nameof(queryParameters));

        Dictionary<string, StringValues>? query = null;

        foreach (var param in queryParameters)
        {
            Guard.NotWhiteSpace(param.Name, nameof(queryParameters), "Name of a query parameter can't be null nor whitespace.");
            query ??= QueryUtil.Parse(builder.Query);

            switch (duplicateHandling)
            {
                case QueryStringDuplicateHandling.Merge:
                    query.Append(param.Name, param.Value);

                    break;

                case QueryStringDuplicateHandling.PreferNew:
                    query[param.Name] = param.Value;

                    break;

                case QueryStringDuplicateHandling.PreferOriginal:
                    if (!query.ContainsKey(param.Name))
                        query[param.Name] = param.Value;

                    break;

                default:
                    throw duplicateHandling.GetInvalidException();
            }
        }

        if (query != null)
            builder.Query = QueryUtil.Build(query);

        return builder;
    }

    /// <summary>Adds the query string parameters to the URL being constructed.</summary>
    [Obsolete("Use other overloads.")]
    public static UriBuilder AddQueryParameters(
        this UriBuilder builder,
        NameValueCollection queryParameters,
        QueryStringDuplicateHandling duplicateHandling = QueryStringDuplicateHandling.Merge)
    {
        var pairs = (from string key in queryParameters
                let values = queryParameters.GetValuesForExistingKey(key)
                from value in values
                select (key, value))
            .ToList();

        return builder.AddQueryParameters(pairs, duplicateHandling);
    }

    internal static UriBuilder RemoveQueryParameters(this UriBuilder builder, params string[] parameterNames)
        => builder.RemoveQueryParameters((IEnumerable<string>)parameterNames);

    internal static UriBuilder RemoveQueryParameters(this UriBuilder builder, IEnumerable<string> parameterNames)
    {
        var query = QueryUtil.Parse(builder.Query);
        foreach (var name in parameterNames)
            query.Remove(name);

        builder.Query = QueryUtil.Build(query);

        return builder;
    }

    internal static UriBuilder CombineWith(this UriBuilder builder, PathRelativeUri relativeUri)
    {
        var combinedUrl = new Uri(builder.Uri, relativeUri);
        builder.Path = combinedUrl.AbsolutePath;
        builder.Query = TrimFirstChar(combinedUrl.Query);
        builder.Fragment = TrimFirstChar(combinedUrl.Fragment);

        return builder;
    }

    // Because UriBuilder.Query and Fragment gets "?q=1" but on set require "q=1"
    private static string TrimFirstChar(string str)
        => str.Length > 1 ? str.Substring(1) : "";

    /// <summary>Configures the builder if given condition is satisfied. Convenient for fluent syntax.</summary>
    public static UriBuilder If(this UriBuilder builder, bool condition, Action<UriBuilder> configure)
    {
        if (condition)
            configure(builder);

        return builder;
    }

    /// <summary>Gets relative URL thus omitting left part (scheme, host...).</summary>
    public static PathRelativeUri GetRelativeUri(this UriBuilder builder)
    {
        Guard.NotWhiteSpace(builder.Host, nameof(builder), "Given builder must have valid Host.");
        Guard.NotWhiteSpace(builder.Scheme, nameof(builder), "Given builder must have valid Scheme.");

        var baseUri = new Uri(builder.Uri.GetLeftPart(UriPartial.Authority));
        var uri = baseUri.MakeRelativeUri(builder.Uri);

        return new PathRelativeUri(uri);
    }

    /// <summary>Constructs HTTP URL from given builder.</summary>
    public static HttpUri GetHttpUri(this UriBuilder builder)
        => new HttpUri(builder.Uri);

    /// <summary>Changes scheme and also port which is set to default one according to scheme if not provided explicitly.</summary>
    internal static UriBuilder ChangeSchemeWithPort(this UriBuilder builder, string scheme, int port = -1)
    {
        builder.Scheme = scheme;
        builder.Port = port;

        return builder;
    }
}
