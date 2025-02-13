using System.ComponentModel;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>
/// Provides referenced assembly information.
/// <example>
/// This sample shows how to use <see cref="IAssemblyDslProvider"/> dsl provider.
/// <code><![CDATA[
/// Assembly.HasVersion("Frontend.Vanilla.Core", ">=7.10.2");
/// bool result = Assembly.HasVersion("Frontend.Vanilla.Core", "= 7.10.2");
/// ]]> </code>
/// </example>
/// </summary>
[ValueVolatility(ValueVolatility.Static)]
[Description("Provides referenced assembly informations")]
public interface IAssemblyDslProvider
{
    /// <summary>
    /// Use comparison operator to compare assembly with referenced assembly by version.
    /// AssemblyName represent the name of assembly (e.g. Frontend.Vanilla.Core).
    /// OperatorAndVersion represent string that consists of comparison operator and version to compare (e.g. ">=7.10.2").
    /// Supported comparison operators are <![CDATA[ >, >=, =, <, <= ]]>.
    /// </summary>
    [Description(
        "Use comparison operator to compare assembly with referenced assembly by version." +
        " AssemblyName represent the name of assembly (e.g. Frontend.Vanilla.Core)." +
        " OperatorAndVersion represent string that consists of comparison operator and version to compare (e.g. \">= 7.10.2\")." +
        " Supported comparison operators are <![CDATA[ >, >=, =, <, <= ]]>")]
    bool HasVersion(string assemblyName, string operatorAndVersion);
}
