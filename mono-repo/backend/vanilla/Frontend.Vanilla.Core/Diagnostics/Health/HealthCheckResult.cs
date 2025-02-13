using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.Diagnostics.Health;

/// <summary>
/// Report regarding health of an application component.
/// </summary>
public sealed class HealthCheckResult
{
    /// <summary>Gets the error describing why the check has not passed.</summary>
    public object? Error { get; }

    /// <summary>Gets the details regarding check execution.</summary>
    public object? Details { get; }

    private HealthCheckResult(object? error, object? details)
    {
        Error = error;
        Details = details;
    }

    /// <summary>Gets static success result.</summary>
    public static readonly HealthCheckResult Success = CreateSuccess(null);

    internal static readonly HealthCheckResult DisabledFeature = CreateSuccess("The feature is disabled.");

    /// <summary>Creates successfully passed result.</summary>
    public static HealthCheckResult CreateSuccess(object? details)
        => new HealthCheckResult(null, details);

    /// <summary>Create failed result providing error explanation.</summary>
    public static HealthCheckResult CreateFailed(object error, object? details = null)
    {
        Guard.NotNull(error, nameof(error));

        return new HealthCheckResult(error, details);
    }
}
