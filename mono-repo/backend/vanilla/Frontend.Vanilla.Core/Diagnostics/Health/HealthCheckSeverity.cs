using System.ComponentModel;

namespace Frontend.Vanilla.Core.Diagnostics.Health;

/// <summary>
/// Defines severity of <see cref="IHealthCheck" />.
/// </summary>
public enum HealthCheckSeverity
{
    /// <summary>
    /// It should pass for the app to work properly. Usually it's related to a feature or some component
    /// therefore should be fixed by responsible persons.
    /// </summary>
    [Description("Non-critical Check")]
    Default = 0,

    /// <summary>
    /// It must pass always because the app is unable to work otherwise.
    /// Therefore if it fails then monitoring tools pound an alarm for on-duty team to fix it as soon as possible.
    /// </summary>
    [Description("Critical Check")]
    Critical = 1,
}
