using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.DomainSpecificLanguage;

namespace Frontend.Vanilla.Features.LazyFeatures;

/// <summary>
/// Represents a provider which determines if feature with specific Id is enabled.
/// </summary>
internal interface IFeatureEnablementProvider
{
    /// <summary>
    /// Feature Id.
    /// </summary>
    string Id { get; }

    /// <summary>
    /// Feature Data Source.
    /// </summary>
    string Source { get; }

    /// <summary>
    /// Enablement DSL prepared for client evaluation.
    /// </summary>
    Task<ClientEvaluationResult<bool>> IsEnabledAsync(CancellationToken cancellationToken);
}
