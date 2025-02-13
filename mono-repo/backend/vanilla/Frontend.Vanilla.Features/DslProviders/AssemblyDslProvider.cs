using System;
using System.Linq;
using System.Reflection;
using System.Text.RegularExpressions;
using Frontend.Vanilla.Core.Reflection;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.Ioc;

namespace Frontend.Vanilla.Features.DslProviders;

internal sealed class AssemblyDslProvider(ReferencedAssemblies referencedAssemblies) : IAssemblyDslProvider
{
    private static readonly Regex Regex = new Regex(@"^(?<operator>>=|>|=|<|<=|)\s*(?<version>\d+(\.\d+(\.\d+(\.\d+)?)?)?)$",
        RegexOptions.Compiled | RegexOptions.IgnoreCase | RegexOptions.CultureInvariant);

    public bool HasVersion(string assemblyName, string operatorAndVersion)
    {
        Guard.NotWhiteSpace(assemblyName, nameof(assemblyName));
        Guard.NotWhiteSpace(operatorAndVersion, nameof(operatorAndVersion));

        var match = Regex.Match(operatorAndVersion);

        var comparisonOperator = match.Groups["operator"].Value;
        var versionNumber = match.Groups["version"].Value;

        if (string.IsNullOrEmpty(comparisonOperator) || string.IsNullOrEmpty(versionNumber))
        {
            throw new ArgumentException($"Unable to parse valid comparison operator or assembly version from value '{operatorAndVersion}'.", nameof(operatorAndVersion));
        }

        try
        {
            var assembly = referencedAssemblies.FirstOrDefault(a => a.GetName().Name == assemblyName);

            if (assembly == null) return false;

            var version = Version.Parse(versionNumber);
            var fileVersion = assembly.Get<AssemblyFileVersionAttribute>()?.Version.WhiteSpaceToNull();
            var fileVersionNumber = fileVersion ?? assembly.GetName().Version!.ToString();
            var assemblyVersion = Version.Parse(fileVersionNumber);

            return comparisonOperator switch
            {
                "=" => assemblyVersion == version,
                ">" => assemblyVersion > version,
                ">=" => assemblyVersion >= version,
                "<" => assemblyVersion < version,
                "<=" => assemblyVersion <= version,
                _ => throw new VanillaBugException($"Operator {comparisonOperator.Dump()}"),
            };
        }
        catch (Exception ex)
        {
            throw new ArgumentException($"Unable to parse valid version number from value '{operatorAndVersion}'.", nameof(operatorAndVersion), ex);
        }
    }
}
