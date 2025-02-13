using Frontend.Vanilla.Configuration.DynaCon.Multitenancy;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Ioc;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.LabelResolution;

namespace Frontend.Vanilla.Features.WebIntegration.Configuration.DynaCon;

/// <summary>
/// Resolves current label which is used as a tenant for the config engine.
/// </summary>
internal sealed class CurrentLabelTenantResolver(
    ICurrentContextAccessor currentContextAccessor,
    ILabelResolver labelResolver)
    : ICurrentTenantResolver
{
    private const string Domain = "Domain";

    public TrimmedRequiredString ResolveName()
        => currentContextAccessor.Items.GetOrAddFromFactory("Van:" + LabelResolver.Label, _ => labelResolver.Get());

    public TrimmedRequiredString ResolveDomain()
        => currentContextAccessor.Items.GetOrAddFromFactory("Van:" + Domain, _ => labelResolver.Get(LabelResolutionMode.HostnameEnd));
}
