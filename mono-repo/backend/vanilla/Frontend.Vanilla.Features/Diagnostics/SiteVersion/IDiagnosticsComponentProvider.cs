namespace Frontend.Vanilla.Features.Diagnostics.SiteVersion;

/// <summary>
/// Used to display component info on site/version and in kibana logs.
/// </summary>
public interface IDiagnosticsComponentProvider
{
    /// <summary>Returns name.</summary>
    string Name { get; }
}
