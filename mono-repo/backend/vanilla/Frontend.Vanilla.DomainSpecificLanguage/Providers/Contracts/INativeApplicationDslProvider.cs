using System.ComponentModel;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>
/// Information about requests to Vanilla web app coming from the native application which embeds it.
/// </summary>
[Description("Information about requests to Vanilla web app coming from the native application which embeds it.")]
[ValueVolatility(ValueVolatility.Client)]
public interface INativeApplicationDslProvider
{
    /// <summary>
    /// Indicates whether web request has been made from a native application which embeds it.
    /// </summary>
    [Description("Indicates whether web request has been made from a native application or native wrapper or download client application which embeds it.")]
    bool IsNative();

    /// <summary>
    /// Indicates whether web request has been made from a native application which embeds it.
    /// </summary>
    [Description("Indicates whether web request has been made from a native application which embeds it.")]
    bool IsNativeApp();

    /// <summary>
    /// Indicates whether web request has been made from a native wrapper application which embeds it.
    /// </summary>
    [Description("Indicates whether web request has been made from a native wrapper application which embeds it.")]
    bool IsNativeWrapper();

    /// <summary>
    /// Indicates whether web request has been made from a native download client application or download client wrapper application which embeds it.
    /// </summary>
    [Description("Indicates whether web request has been made from a native download client application or download client wrapper application which embeds it.")]
    bool IsDownloadClient();

    /// <summary>
    /// Indicates whether web request has been made from a native download client application which embeds it.
    /// </summary>
    [Description("Indicates whether web request has been made from a native download client application which embeds it.")]
    bool IsDownloadClientApp();

    /// <summary>
    /// Indicates whether web request has been made from a native download client wrapper application which embeds it.
    /// </summary>
    [Description("Indicates whether web request has been made from a native download client wrapper application which embeds it.")]
    bool IsDownloadClientWrapper();

    /// <summary>
    /// Indicates whether web request has been made from a terminal which embeds it.
    /// </summary>
    [Description("Indicates whether web request has been made from a terminal which embeds it.")]
    bool IsTerminal();

    /// <summary>
    /// The product name of the native application which made the request to this web app.
    /// </summary>
    [Description("The product name of the native application which made the request to this web app.")]
    string GetProduct();

    /// <summary>
    /// The name of the subchannel of the native application which made the request to this web app.
    /// The subchannel is a sub-category of the product.
    /// </summary>
    [Description("The name of the subchannel of the native application which made the request to this web app.")]
    string GetName();
}
