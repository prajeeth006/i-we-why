#nullable enable

using System;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Content.Client.Infrastructure;

/// <summary>
/// Wraps strongly-type <see cref="IClientContentMapper{TSource,TTarget}" /> to non-generic class easier to handle all together.
/// </summary>
public sealed class ClientContentMapping
{
    /// <summary>
    /// Gets the source type of the mapper.
    /// </summary>
    public Type SourceType { get; }

    /// <summary>
    /// Gets the target type of the mapper.
    /// </summary>
    public Type TargetType { get; }

    internal Func<ClientDocument>? CreateClientDocument { get; }
    internal Func<IDocument, ClientDocument, IClientContentContext, Task> MapAsync { get; }
    internal Type MapperType { get; }

    private ClientContentMapping(
        Type sourceType,
        Type targetType,
        Func<ClientDocument>? createClientDocument,
        Func<IDocument, ClientDocument, IClientContentContext, Task> mapAsync,
        Type mapperType)
    {
        SourceType = sourceType;
        TargetType = targetType;
        CreateClientDocument = createClientDocument;
        MapAsync = mapAsync;
        MapperType = mapperType;
    }

    /// <summary>Creates the mapping.</summary>
    public static ClientContentMapping Create<TSource, TTarget>(IClientContentMapper<TSource, TTarget> mapper, bool isFinalType)
        where TSource : class, IDocument
        where TTarget : ClientDocument, new()
    {
        Guard.NotNull(mapper, nameof(mapper));

        return new ClientContentMapping(
            sourceType: typeof(TSource),
            targetType: typeof(TTarget),
            mapperType: mapper.GetType(),
            mapAsync: (source, target, context) => mapper.MapAsync((TSource)source, (TTarget)target, context),
            createClientDocument: isFinalType ? new Func<ClientDocument>(() => new TTarget()) : null);
    }
}
