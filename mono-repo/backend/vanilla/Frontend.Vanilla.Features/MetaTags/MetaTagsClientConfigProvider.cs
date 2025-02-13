using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.MetaTags;

internal sealed class MetaTagsClientConfigProvider(IMetaTagsConfiguration config) : LambdaClientConfigProvider("vnMetaTags", () => config)
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
