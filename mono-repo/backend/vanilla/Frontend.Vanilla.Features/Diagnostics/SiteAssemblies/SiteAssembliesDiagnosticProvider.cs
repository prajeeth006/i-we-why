using System.Reflection;
using System.Text;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Core.Reflection;
using Frontend.Vanilla.Features.Ioc;

namespace Frontend.Vanilla.Features.Diagnostics.SiteAssemblies;

internal sealed class SiteAssembliesDiagnosticProvider(ReferencedAssemblies referencedAssemblies) : SyncDiagnosticInfoProvider
{
    public override DiagnosticInfoMetadata Metadata { get; } = new (
        name: "Site Assemblies",
        urlPath: "assemblies",
        shortDescription: "List of app assemblies.");

    public override object GetDiagnosticInfo()
        => referencedAssemblies.ConvertAll(assembly =>
        {
            var assemblyName = assembly.GetName();
            var publicKey = assemblyName.GetPublicKeyToken();

            return new
            {
                assemblyName.Name,
                Version = assemblyName.Version?.ToString(),
                assembly.Get<AssemblyInformationalVersionAttribute>()?.InformationalVersion,
                PublicToken = publicKey != null ? Encoding.Default.GetString(publicKey) : null,
                assembly.Get<AssemblyDescriptionAttribute>()?.Description,
            };
        });
}
