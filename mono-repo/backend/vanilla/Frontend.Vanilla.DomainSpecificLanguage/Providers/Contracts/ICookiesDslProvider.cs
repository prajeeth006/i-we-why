using System.ComponentModel;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>
/// Provides generic access to cookies.
/// </summary>
[ValueVolatility(ValueVolatility.Client)]
[Description("Provides generic access to cookies.")]
public interface ICookiesDslProvider
{
    /// <summary>Label-specific cookie domain which makes the cookie accessible on all products of current label.</summary>
    [Description("Label-specific cookie domain which makes the cookie accessible on all products of current label.")]
    [ValueVolatility(ValueVolatility.Server)]
    string LabelDomain { get; }

    /// <summary>Full cookie domain which makes the cookie accessible only on this app (product).</summary>
    [Description("Full cookie domain which makes the cookie accessible only on this app (product).")]
    [ValueVolatility(ValueVolatility.Server)]
    string FullDomain { get; }

    /// <summary>
    /// Gets the value of the cookie with given name e.g. 'TrackerId'.
    /// Name is case-insensitive.
    /// Gets empty string if there is no cookie with given name.
    /// </summary>
    [Description("Gets the value of the cookie with given name e.g. 'TrackerId'."
                 + " Name is case-insensitive."
                 + " Gets empty string if there is no cookie with given name.")]
    string? Get(string name);

    /// <summary>
    /// Sets session cookie with given name to given value.
    /// It expires when browser is closed
    /// and it's accessible by all product of current label.
    /// </summary>
    [Description("Sets session cookie with given name to given value."
                 + " It expires when browser is closed"
                 + " and it's accessible by all product of current label.")]
    void SetSession(string name, string value);

    /// <summary>
    /// Sets persistent cookie with given name to given value.
    /// Its expiration can be relative seconds e.g. from 'Time' DSL provider or absolute unix time e.g. from 'DateTime' DSL provider.
    /// The cookie will be accessible by all product of current label.
    /// </summary>
    [Description("Sets persistent cookie with given name to given value."
                 + " Its expiration can be relative seconds e.g. from 'Time' DSL provider or absolute unix time e.g. from 'DateTime' DSL provider."
                 + " The cookie will be accessible by all product of current label."
                 + " Examples: Cookies.SetPersistent('foo', 'bar', Time.Days(10)) Cookies.SetPersistent('foo', 'bar', DateTime.Date(2025, 2, 1))")]
    void SetPersistent(string name, string value, decimal expiration);

    /// <summary>Deletes cookie with given name.</summary>
    [Description("Deletes cookie with given name.")]
    void Delete(string name);

    /// <summary>
    /// Low-level function to set cookie with all its details. Use with care and prefer other functions.
    /// If expiration is below 0 then cookie is deleted. If it's zero then it's session cookie. Otherwise it's permanent one.
    /// Domain should be Cookies.LabelDomain or Cookies.FullDomain.
    /// </summary>
    [Description("Low-level function to set cookie with all its details. Use with care and prefer other functions."
                 + " If expiration is below 0 then cookie is deleted. If it's zero then it's session cookie. Otherwise it's permanent one."
                 + " Domain should be Cookies.LabelDomain or Cookies.FullDomain.")]
    void Set(string name, string value, decimal expiration, bool httpOnly, string domain, string path);
}
