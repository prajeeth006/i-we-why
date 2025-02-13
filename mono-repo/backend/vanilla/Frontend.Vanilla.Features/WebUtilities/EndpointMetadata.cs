using System.Collections.Generic;
using System.Linq;

namespace Frontend.Vanilla.Features.WebUtilities;

/// <summary>
/// Provides metadata of an endpoint (a controller) in a way that can be easily mocked and it's cross-platform (legacy ASP.NET and ASP.NET Core).
/// </summary>
internal interface IEndpointMetadata
{
    bool Contains<T>()
        where T : class;

    T? Get<T>()
        where T : class;

    /// <summary>Gets the metadata items of type T in ascending order of precedence so the most specific is the last one.</summary>
    IReadOnlyList<T> GetOrdered<T>()
        where T : class;
}

internal abstract class EndpointMetadataBase : IEndpointMetadata
{
    public T? Get<T>()
        where T : class
        => GetOrdered<T>().LastOrDefault();

    public bool Contains<T>()
        where T : class
        => GetOrdered<T>().Count > 0;

    public abstract IReadOnlyList<T> GetOrdered<T>()
        where T : class;
}
