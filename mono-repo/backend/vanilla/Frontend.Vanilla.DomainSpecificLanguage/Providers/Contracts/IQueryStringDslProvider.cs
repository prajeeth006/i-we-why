using System.ComponentModel;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>
/// Provides generic access to query string parameters.
/// </summary>
[ValueVolatility(ValueVolatility.Client)]
[Description("Provides generic access to query string parameters.")]
public interface IQueryStringDslProvider
{
    /// <summary>Gets the value of query string parameter with specified name.</summary>
    [Description("Gets the value of query string parameter with specified name.")]
    string Get(string name);

    /// <summary>Sets parameter with specified name and value to query string of the URL. It overwrites existing parameter with that name.</summary>
    [Description("Sets parameter with specified name and value to query string of current URL. It overwrites existing parameter with that name.")]
    void Set(string name, string value);

    /// <summary>Removes parameter with specified name from query string of current URL.</summary>
    [Description("Removes parameter with specified name from query string of current URL.")]
    void Remove(string name);
}
