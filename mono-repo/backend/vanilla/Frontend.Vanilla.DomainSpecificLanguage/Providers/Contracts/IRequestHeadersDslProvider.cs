using System.ComponentModel;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>
/// Provides generic access to HTTP request headers.
/// </summary>
[Description("Provides generic access to HTTP request headers.")]
public interface IRequestHeadersDslProvider
{
    /// <summary>
    /// Gets the value of the HTTP request header with given name (e.g. User-Agent). Name is case-insensitive. Gets empty string if there is no header with given name.
    /// </summary>
    [Description(
        "Gets the value of the HTTP request header with given name (e.g. User-Agent). Name is case-insensitive. Gets empty string if there is no header with given name.")]
    string Get(string name);

    /// <summary>The 'User-Agent' HTTP request header.</summary>
    [Description("The 'User-Agent' HTTP request header.")]
    [ValueVolatility(ValueVolatility.Client)]
    string UserAgent { get; }
}
