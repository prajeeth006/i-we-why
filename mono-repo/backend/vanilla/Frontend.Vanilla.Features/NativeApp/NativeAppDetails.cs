using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.Features.NativeApp;

/// <summary>
/// Encapsulates all resolved details about native app.
/// </summary>
public sealed class NativeAppDetails
{
    /// <summary>
    /// Gets the instance if the request isn't made from native app.
    /// </summary>
    public static readonly NativeAppDetails Unknown = new NativeAppDetails();

    private NativeAppDetails()
        : this(applicationName: NativeAppConstants.Unknown, NativeAppConstants.Unknown, NativeAppMode.Unknown.ToString()) { }

    /// <summary>
    /// Creates a new instance with all details specified.
    /// </summary>
    public NativeAppDetails(string applicationName, string product, string nativeMode)
    {
        ApplicationName = applicationName.ToLowerInvariant();
        Product = product.ToUpperInvariant();
        NativeMode = Enum<NativeAppMode>.Parse(nativeMode, ignoreCase: true);
    }

    /// <summary>
    /// Gets the name of the native application that current request comes from.
    /// </summary>
    public string ApplicationName { get; }

    /// <summary>
    /// Gets the product ID mapped to the native application that current request comes from.
    /// </summary>
    public string Product { get; }

    /// <summary>
    /// Gets the native mode.
    /// </summary>
    public NativeAppMode NativeMode { get; }

    /// <summary>
    /// Indicates whether the current request comes in context of some app (native app, wrapper, terminal, download client etc).
    /// </summary>
    public bool IsNative => NativeMode != NativeAppMode.Unknown;

    /// <summary>
    /// Indicates whether the current request comes from Native Application.
    /// </summary>
    public bool IsNativeApp => NativeMode == NativeAppMode.Native;

    /// <summary>
    /// Indicates whether the current request comes from Native Wrapper.
    /// </summary>
    public bool IsNativeWrapper => NativeMode == NativeAppMode.Wrapper;

    /// <summary>
    /// Indicates whether the current request comes from download client.
    /// </summary>
    public bool IsDownloadClient => IsDownloadClientApp || IsDownloadClientWrapper;

    /// <summary>
    /// Indicates whether the current request comes from download client.
    /// </summary>
    public bool IsDownloadClientApp => NativeMode == NativeAppMode.DownloadClient;

    /// <summary>
    /// Indicates whether the current request comes from download client.
    /// </summary>
    public bool IsDownloadClientWrapper => NativeMode == NativeAppMode.DownloadClientWrapper;

    /// <summary>
    /// Indicates whether the current request comes from terminal.
    /// </summary>
    public bool IsTerminal => NativeMode == NativeAppMode.Terminal;
}

/// <summary>
/// Defines mode of the native app.
/// </summary>
public enum NativeAppMode
{
    /// <summary>
    /// Unknown.
    /// </summary>
    Unknown = 0,

    /// <summary>
    /// Native app.
    /// </summary>
    Native = 1,

    /// <summary>
    /// Wrapper app.
    /// </summary>
    Wrapper = 2,

    /// <summary>
    /// Download client app.
    /// </summary>
    DownloadClient = 4,

    /// <summary>
    /// Download client wrapper app.
    /// </summary>
    DownloadClientWrapper = 5,

    /// <summary>
    /// Terminal app.
    /// </summary>
    Terminal = 6,
}
