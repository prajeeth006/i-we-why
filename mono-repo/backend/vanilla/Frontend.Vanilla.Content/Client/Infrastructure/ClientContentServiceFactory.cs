#nullable enable

using System;
using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Content.Menus;
using Frontend.Vanilla.Core.Reflection;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Content.Client.Infrastructure;

/// <summary>
/// A factory that helps with creation of <see cref="IClientContentService"/>.
/// </summary>
public interface IClientContentServiceFactory
{
    /// <summary>
    /// Creates an instance of <see cref="ClientContentService"/> that also implements <typeparamref name="TInterface"/>.
    /// </summary>
    /// <typeparam name="TInterface">The interface under which the service will be registered in DI.</typeparam>
    TInterface CreateService<TInterface>(ClientContentServiceOptions? options = null)
        where TInterface : class, IClientContentService;

    /// <summary>
    /// Creates a collection of vanilla mappers that you can then customize and pass to <see cref="CreateService{TInterface}"/>.
    /// </summary>
    List<ClientContentMapping> CreateBaseMappings();
}

internal sealed class ClientContentServiceFactory(
    IContentService contentService,
    IMenuFactory menuFactory,
    ILogger<ClientContentService> log,
    IEnumerable<ClientContentMapping> mappers)
    : IClientContentServiceFactory
{
    public TInterface CreateService<TInterface>(ClientContentServiceOptions? options)
        where TInterface : class, IClientContentService
    {
        if (typeof(TInterface).GetMembers().Length > 0)
        {
            var message =
                $"Error creating an instance of ClientContentService. The specified interface {typeof(TInterface).Name} cannot have any additional methods or properties,"
                + $" but [ {string.Join(", ", typeof(TInterface).GetMembers().Select(m => m.Name))} ] were found.";

            throw new ArgumentException(message, nameof(TInterface));
        }

        var mappings = options?.Mappings ?? CreateBaseMappings();
        var service = new ClientContentService(contentService, menuFactory, mappings, log);

        return DynamicProxy.ExtendTo<IClientContentService, TInterface>(service);
    }

    public List<ClientContentMapping> CreateBaseMappings() => new (mappers);
}
