namespace Frontend.Vanilla.Features.Logout;

internal interface ILogoutConfiguration
{
    string? LogoutMessage { get; }
}

internal sealed class LogoutConfiguration : ILogoutConfiguration
{
    public const string FeatureName = "VanillaFramework.Web.UI.Logout";
    public string? LogoutMessage { get; set; }
}
