using Frontend.Vanilla.Core.Configuration;

namespace Frontend.Vanilla.Features.UserFlags;

internal interface IUserFlagsConfiguration : IDisableableConfiguration { }

internal sealed class UserFlagsConfiguration : IUserFlagsConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.UserFlags";

    public bool IsEnabled { get; set; }
}
