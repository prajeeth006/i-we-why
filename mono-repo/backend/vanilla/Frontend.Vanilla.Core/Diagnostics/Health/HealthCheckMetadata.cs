using System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.Diagnostics.Health;

/// <summary>
/// Defines metadata describing an <see cref="IHealthCheck" />.
/// </summary>
public sealed class HealthCheckMetadata
{
    /// <summary>Gets the name. It must be unique.</summary>
    public TrimmedRequiredString Name { get; }

    /// <summary>Gets the text describing what is actually checked.</summary>
    public TrimmedRequiredString Description { get; }

    /// <summary>Gets steps describing what should be done if the check fails.</summary>
    public TrimmedRequiredString WhatToDoIfFailed { get; }

    /// <summary>Gets the severity.</summary>
    public HealthCheckSeverity Severity { get; }

    /// <summary>Gets name of DynaCon feature corresponding to the configuration which is used during execution of this health check.</summary>
    public TrimmedRequiredString? ConfigurationFeatureName { get; }

    /// <summary>Gets the URL where this health check or related feature is documented.</summary>
    public Uri? DocumentationUri { get; }

    /// <summary>Creates a new instance.</summary>
    public HealthCheckMetadata(
        TrimmedRequiredString name,
        TrimmedRequiredString description,
        TrimmedRequiredString whatToDoIfFailed,
        HealthCheckSeverity severity = default,
        TrimmedRequiredString? configurationFeatureName = null,
        Uri? documentationUri = null)
    {
        Name = Guard.NotNull(name, nameof(name));
        Description = Guard.NotNull(description, nameof(description));
        WhatToDoIfFailed = Guard.NotNull(whatToDoIfFailed, nameof(whatToDoIfFailed));
        Severity = Guard.DefinedEnum(severity, nameof(severity));
        ConfigurationFeatureName = configurationFeatureName;
        DocumentationUri = documentationUri;
    }
}
