namespace Frontend.Vanilla.Features.Games;

internal interface IGameMetadataConfiguration
{
    string CasinoGameLaunchUrl { get; }
    string CasinoUriScheme { get; }
    string MobileCasinoGameDataEndpoint { get; }
}

internal sealed class GameMetadataConfiguration(
    string casinoGameLaunchUrl,
    string casinoUriScheme,
    string mobileCasinoGameDataEndpoint) : IGameMetadataConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.GameMetadata";
    public string CasinoGameLaunchUrl { get; set; } = casinoGameLaunchUrl;
    public string CasinoUriScheme { get; set; } = casinoUriScheme;
    public string MobileCasinoGameDataEndpoint { get; set; } = mobileCasinoGameDataEndpoint;
}
