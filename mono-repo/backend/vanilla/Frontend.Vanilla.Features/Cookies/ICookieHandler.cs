namespace Frontend.Vanilla.Features.Cookies;

/// <summary>
/// Handler for working with cookies under common label domain and other options according to <see cref="ICookieConfiguration" />.
/// </summary>
public interface ICookieHandler
{
    /// <summary>Gets the value of particular cookie from current HTTP request. <c>Null</c> if the cookie doesn't exist.</summary>
    string? GetValue(string name);

    /// <summary>Sets particular cookie to current HTTP response.</summary>
    void Set(string name, string value, CookieSetOptions? options = null);

    /// <summary>Deletes particular cookie by setting it to current HTTP response to expire on the client.</summary>
    void Delete(string name, CookieLocationOptions? options = null);
}
