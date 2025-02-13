namespace Frontend.Vanilla.Features.LoginDuration;

internal interface ILoginDurationConfiguration
{
    /// <summary>
    /// Specifies if and where the login duration should be displayed.
    /// </summary>
    string SlotName { get; }

    bool IsEnabled { get; }
    string TimeFormat { get; }
}

internal sealed class LoginDurationConfiguration(string slotName, string timeformat) : ILoginDurationConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.LoginDuration";

    public string SlotName { get; set; } = slotName;
    public bool IsEnabled { get; set; }
    public string TimeFormat { get; set; } = timeformat;
}
