#nullable enable

using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.ServiceClients.Infrastructure.Execution;

/// <summary>
/// Base class which collapses sync + async methods to one with <see cref="ExecutionMode" />.
/// </summary>
internal abstract class PosApiRestClientBase : IPosApiRestClient
{
    public abstract Task ExecuteAsync(ExecutionMode mode, PosApiRestRequest request);

    public abstract Task<T> ExecuteAsync<T>(ExecutionMode mode, PosApiRestRequest request)
        where T : notnull;

    void IPosApiRestClient.Execute(PosApiRestRequest request)
        => ExecutionMode.ExecuteSync(ExecuteAsync, request);

    Task IPosApiRestClient.ExecuteAsync(PosApiRestRequest request, CancellationToken cancellationToken)
        => ExecuteAsync(ExecutionMode.Async(cancellationToken), request);

    T IPosApiRestClient.Execute<T>(PosApiRestRequest request)
        => ExecutionMode.ExecuteSync(ExecuteAsync<T>, request);

    Task<T> IPosApiRestClient.ExecuteAsync<T>(PosApiRestRequest request, CancellationToken cancellationToken)
        => ExecuteAsync<T>(ExecutionMode.Async(cancellationToken), request);
}
