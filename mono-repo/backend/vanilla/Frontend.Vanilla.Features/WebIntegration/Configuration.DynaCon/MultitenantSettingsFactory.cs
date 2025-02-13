#nullable disable
using System.Linq;
using Frontend.Vanilla.Configuration.DynaCon;
using Frontend.Vanilla.Configuration.DynaCon.Multitenancy;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.IO;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Features.WebIntegration.Configuration.DynaCon;

/// <summary>
/// Creates settings for a tenant in multitenant web app.
/// </summary>
internal sealed class MultitenantSettingsFactory(DynaConEngineSettings engineSettings, IDynaConParameterReplacer parameterReplacer) : ITenantSettingsFactory
{
    private readonly TenantSettings blueprint = engineSettings.TenantBlueprint;

    public TenantSettings Create(TrimmedRequiredString tenantName)
    {
        var parameters = blueprint.Parameters
            .Append(new DynaConParameter(DynaConParameter.ContextPrefix + "label", tenantName))
            .ToList();

        RootedPath Replace(RootedPath path)
            => path.IfNotNull(p => new RootedPath(parameterReplacer.Replace(p, parameters)));

        var changesetFallbackFile = Replace(blueprint.ChangesetFallbackFile);
        var localOverridesFile = Replace(blueprint.LocalOverridesFile);

        return new TenantSettings(tenantName, changesetFallbackFile, localOverridesFile, parameters);
    }
}
