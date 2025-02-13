#nullable enable

using System.Threading.Tasks;

namespace Frontend.Vanilla.Content.Client.Infrastructure;

/// <summary>
/// Interface for mapper that converts content to client POCO classes.
/// </summary>
public interface IClientContentMapper<TSource, TTarget>
    where TSource : class, IDocument
    where TTarget : class, new()
{
    /// <summary>Maps properties from source content to target client POCO class.</summary>
    Task MapAsync(TSource source, TTarget target, IClientContentContext context);
}
