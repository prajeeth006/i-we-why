using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Features.ClientConfig;

/// <summary>
/// Merges all given configurations into final one.
/// </summary>
internal interface IClientConfigMerger
{
    /// <summary>
    /// Gets configuration from all client config providers.
    /// </summary>
    Task<IReadOnlyDictionary<string, object>> GetMergedConfigAsync(CancellationToken cancellationToken);

    /// <summary>
    /// Gets configuration from specified client config providers.
    /// </summary>
    Task<IReadOnlyDictionary<string, object>> GetMergedConfigForAsync(IEnumerable<string> names, CancellationToken cancellationToken);
}

internal class ClientConfigException(string message) : Exception(message) { }

internal sealed class ClientConfigMerger : IClientConfigMerger
{
    private readonly IReadOnlyDictionary<string, IClientConfigProvider> providers;
    private readonly IClientConfigMergeExecutor executor;
    private readonly IInternalRequestEvaluator internalRequestEvaluator;

    public ClientConfigMerger(
        IEnumerable<IClientConfigProvider> providers,
        IClientConfigMergeExecutor executor,
        IInternalRequestEvaluator internalRequestEvaluator)
    {
        this.providers = Enumerable.ToDictionary(providers, p => p.Name.Value, StringComparer.OrdinalIgnoreCase);
        this.executor = executor;
        this.internalRequestEvaluator = internalRequestEvaluator;
    }

    public Task<IReadOnlyDictionary<string, object>> GetMergedConfigAsync(CancellationToken cancellationToken)
    {
        var requestedProviders = providers.Values.Where(p => p.Type == ClientConfigType.Eager);

        return executor.ExecuteAsync(requestedProviders, cancellationToken);
    }

    public Task<IReadOnlyDictionary<string, object>> GetMergedConfigForAsync(IEnumerable<string> names, CancellationToken cancellationToken)
    {
        var requestedProviders = names.Select(n =>
            providers.GetValue(n) ?? throw new ClientConfigException(ExceptionMessage(n)));

        return executor.ExecuteAsync(requestedProviders, cancellationToken);
    }

    private string ExceptionMessage(string name)
    {
        return internalRequestEvaluator.IsInternal()
            ? $"There is no registered {typeof(IClientConfigProvider)} with requested Name '{name}'. Available ones: {providers.Keys.Dump()}."
            : $"There is no registered {typeof(IClientConfigProvider)} with requested Name '{name}'.";
    }
}
