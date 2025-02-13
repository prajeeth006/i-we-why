#nullable enable

using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.ServiceClients.Infrastructure;

/// <summary>
/// Central point that all PosAPI requests are supposed to pass through, the closest to REST infrastructure.
/// It executes high-level <see cref="PosApiRestRequest" /> as HTTP request accordingly
/// and deserializes the result using Newtonsoft JSON to an object of given result type.
/// If there is an error reported by PosAPI then it's deserialized to <see cref="PosApiException" />.
/// </summary>
public interface IPosApiRestClient
{
    /// <summary>Executes given PosAPI request.</summary>
    void Execute(PosApiRestRequest request);

    /// <summary>Executes given PosAPI request.</summary>
    Task ExecuteAsync(PosApiRestRequest request, CancellationToken cancellationToken);

    /// <summary>Executes given PosAPI request.</summary>
    Task ExecuteAsync(ExecutionMode mode, PosApiRestRequest request);

    /// <summary>Executes given PosAPI request and deserializes specified type from the response.</summary>
    T Execute<T>(PosApiRestRequest request)
        where T : notnull;

    /// <summary>Executes given PosAPI request and deserializes specified type from the response.</summary>
    Task<T> ExecuteAsync<T>(PosApiRestRequest request, CancellationToken cancellationToken)
        where T : notnull;

    /// <summary>Executes given PosAPI request and deserializes specified type from the response.</summary>
    Task<T> ExecuteAsync<T>(ExecutionMode mode, PosApiRestRequest request)
        where T : notnull;
}
