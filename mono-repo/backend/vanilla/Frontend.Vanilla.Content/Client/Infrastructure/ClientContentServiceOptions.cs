#nullable enable

using System.Collections.Generic;

namespace Frontend.Vanilla.Content.Client.Infrastructure;

/// <summary>
/// Options for creating an instance of <see cref="ClientContentService"/> with <see cref="IClientContentServiceFactory.CreateService{TInterface}"/>.
/// </summary>
public sealed class ClientContentServiceOptions
{
    /// <summary>
    /// The mappers the instance should use.
    /// </summary>
    public IList<ClientContentMapping> Mappings { get; } = new List<ClientContentMapping>();
}
