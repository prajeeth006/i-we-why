using Frontend.Vanilla.ServiceClients.Services.Crm.UserScrub;

namespace Frontend.Vanilla.Features.UserScrub;

internal interface IUserScrubConfiguration
{
    public UserScrubRequest PlayerScrubRequest { get; }
}

internal sealed class UserScrubConfiguration(UserScrubRequest playerScrubRequest) : IUserScrubConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.PlayerScrub";

    public UserScrubRequest PlayerScrubRequest { get; } = playerScrubRequest;
}
