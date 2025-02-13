namespace Frontend.Vanilla.Features.PublicPages;

internal interface IPublicPagesConfiguration
{
    bool UseStrict404Checking { get; }
    uint PrefetchDepth { get; }
}

internal sealed class PublicPagesConfiguration : IPublicPagesConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.PublicPages";

    public bool UseStrict404Checking { get; set; }
    public uint PrefetchDepth { get; set; }
}
