using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.IO;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Configuration.DynaCon.Multitenancy;

/// <summary>
/// Settings specific to concrete tenant (label for Vanilla web app).
/// </summary>
public sealed class TenantSettings
{
    /// <summary>Name.</summary>
    public TrimmedRequiredString Name { get; }

    /// <summary>ChangesetFallbackFile.</summary>
    public RootedPath? ChangesetFallbackFile { get; }

    /// <summary>LocalOverridesFile.</summary>
    public RootedPath? LocalOverridesFile { get; }

    /// <summary>Parameters.</summary>
    public IReadOnlyList<DynaConParameter> Parameters { get; }

    /// <summary>
    /// Initializes a new instance of the <see cref="TenantSettings"/> class.
    /// </summary>
    /// <param name="name"></param>
    /// <param name="changesetFallbackFile"></param>
    /// <param name="localOverridesFile"></param>
    /// <param name="parameters"></param>
    public TenantSettings(
        TrimmedRequiredString name,
        RootedPath? changesetFallbackFile,
        RootedPath? localOverridesFile,
        IEnumerable<DynaConParameter> parameters)
    {
        Name = name;
        ChangesetFallbackFile = changesetFallbackFile;
        LocalOverridesFile = localOverridesFile;
        Parameters = parameters.ToArray();
    }
}
