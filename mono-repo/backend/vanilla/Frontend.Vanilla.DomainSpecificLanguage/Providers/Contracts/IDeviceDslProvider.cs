using System.ComponentModel;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>
/// Provides user's device capabilities based on DeviceAtlas.
/// See currently available properties at /health/info/device of this website.
/// Ask DeviceAtlas support (not Vanilla team) for more details.
/// See https://deviceatlas.com/resources/available-properties.
/// </summary>
[Description("Provides user's device capabilities."
             + " Ask DeviceAtlas support (not Vanilla team) for more details."
             + " See https://deviceatlas.com/resources/available-properties.")]
[ValueVolatility(ValueVolatility.Client)]
public interface IDeviceDslProvider
{
    /// <summary>
    /// True if the device is meant for use on the move. Most likely includes mobile phones, tablets, convertible PCs etc.
    /// It is 'mobileDevice' DeviceAtlas property. Ask DeviceAtlas support (not Vanilla team) for more details.
    /// </summary>
    [Description(
        "True if the device is meant for use on the move. Most likely includes mobile phones, tablets, convertible PCs etc."
        + " It is 'mobileDevice' DeviceAtlas property. Ask DeviceAtlas support (not Vanilla team) for more details.")]
    Task<bool> IsMobileAsync(ExecutionMode mode);

    /// <summary>
    /// Indicates if the device has touch capabilities.
    /// It is 'touchScreen' DeviceAtlas property. Ask DeviceAtlas support (not Vanilla team) for more details.
    /// </summary>
    [Description("Indicates if the device has touch capabilities."
                 + " It is 'touchScreen' DeviceAtlas property. Ask DeviceAtlas support (not Vanilla team) for more details.")]
    Task<bool> IsTouchAsync(ExecutionMode mode);

    /// <summary>
    /// Indicates if the device is a mobile phone.
    /// It is 'isMobilePhone' DeviceAtlas property. Ask DeviceAtlas support (not Vanilla team) for more details.
    /// </summary>
    [Description("Indicates if the device is a mobile phone."
                 + " It is 'isMobilePhone' DeviceAtlas property. Ask DeviceAtlas support (not Vanilla team) for more details.")]
    Task<bool> IsMobilePhoneAsync(ExecutionMode mode);

    /// <summary>
    /// Indicates if the device is a tablet.
    /// It is 'isTablet' DeviceAtlas property. Ask DeviceAtlas support (not Vanilla team) for more details.
    /// </summary>
    [Description("Indicates if the device is a tablet."
                 + " It is 'isTablet' DeviceAtlas property. Ask DeviceAtlas support (not Vanilla team) for more details.")]
    Task<bool> IsTabletAsync(ExecutionMode mode);

    /// <summary>
    /// Identifies non-human traffic (robots, crawlers, checkers, download agents, spam harvesters and feed readers).
    /// It is 'isRobot' DeviceAtlas property. Ask DeviceAtlas support (not Vanilla team) for more details.
    /// </summary>
    [Description("Identifies non-human traffic (robots, crawlers, checkers, download agents, spam harvesters and feed readers)."
                 + " It is 'isRobot' DeviceAtlas property. Ask DeviceAtlas support (not Vanilla team) for more details.")]
    Task<bool> IsRobotAsync(ExecutionMode mode);

    /// <summary>
    /// Indicates if the device runs on Apple iOS operating system.
    /// It is 'osiOs' DeviceAtlas property. Ask DeviceAtlas support (not Vanilla team) for more details.
    /// </summary>
    [Description("Indicates if the device runs on Apple iOS operating system."
                 + " It is 'osiOs' DeviceAtlas property. Ask DeviceAtlas support (not Vanilla team) for more details.")]
    Task<bool> IsIOSAsync(ExecutionMode mode);

    /// <summary>
    /// Indicates if the device runs on Google Android operating system.
    /// It is 'osAndroid' DeviceAtlas property. Ask DeviceAtlas support (not Vanilla team) for more details.
    /// </summary>
    [Description("Indicates if the device runs on Google Android operating system."
                 + " It is 'osAndroid' DeviceAtlas property. Ask DeviceAtlas support (not Vanilla team) for more details.")]
    Task<bool> IsAndroidAsync(ExecutionMode mode);

    /// <summary>
    /// The name of operating system of the device.
    /// It is 'osName' DeviceAtlas property. Ask DeviceAtlas support (not Vanilla team) for more details.
    /// </summary>
    [Description("The name of operating system of the device."
                 + " It is 'osName' DeviceAtlas property. Ask DeviceAtlas support (not Vanilla team) for more details.")]
    Task<string?> OSNameAsync(ExecutionMode mode);

    /// <summary>
    /// The version of operating system of the device.
    /// It is 'osVersion' DeviceAtlas property. Ask DeviceAtlas support (not Vanilla team) for more details.
    /// </summary>
    [Description("The version of operating system of the device."
                 + " It is 'osVersion' DeviceAtlas property. Ask DeviceAtlas support (not Vanilla team) for more details.")]
    Task<string?> OSVersionAsync(ExecutionMode mode);

    /// <summary>
    /// The model name of the device.
    /// It is 'model' DeviceAtlas property. Ask DeviceAtlas support (not Vanilla team) for more details.
    /// </summary>
    [Description("The model name of the device."
                 + " It is 'model' DeviceAtlas property. Ask DeviceAtlas support (not Vanilla team) for more details.")]
    Task<string?> ModelAsync(ExecutionMode mode);

    /// <summary>
    /// The vendor company name of the device.
    /// It is 'vendor' DeviceAtlas property. Ask DeviceAtlas support (not Vanilla team) for more details.
    /// </summary>
    [Description("The vendor company name of the device."
                 + " It is 'vendor' DeviceAtlas property. Ask DeviceAtlas support (not Vanilla team) for more details.")]
    Task<string?> VendorAsync(ExecutionMode mode);

    /// <summary>
    /// Retrieves device capability of given name.
    /// See currently available properties at /health/info/device of this website.
    /// Ask DeviceAtlas support (not Vanilla team) for more details.
    /// See https://deviceatlas.com/resources/available-properties.
    /// </summary>
    [Description("Retrieves device capability of given name."
                 + " See currently available properties at /health/info/device of this website."
                 + " Ask DeviceAtlas support (not Vanilla team) for more details."
                 + " See https://deviceatlas.com/resources/available-properties.")]
    Task<string?> GetCapabilityAsync(ExecutionMode mode, string name);
}
