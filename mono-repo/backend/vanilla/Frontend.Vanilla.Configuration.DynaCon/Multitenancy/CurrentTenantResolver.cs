using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Configuration.DynaCon.Multitenancy;

internal interface ICurrentTenantResolver
{
    TrimmedRequiredString ResolveName();
    TrimmedRequiredString ResolveDomain();
}

internal sealed class SingleTenantResolver : ICurrentTenantResolver
{
    private static readonly TrimmedRequiredString Name = "(single)";

    public TrimmedRequiredString ResolveName() => Name;
    public TrimmedRequiredString ResolveDomain() => Name;
}
