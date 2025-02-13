using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.ServiceClients.Services.Common;

namespace Frontend.Vanilla.Features.AppInfo;

/// <summary>
/// Outputs client-side config related to backend connection - info extracted from PosAPI access ID for direct connection to the platform.
/// </summary>
internal sealed class AppInfoClientConfigProvider(IPosApiCommonService posApiCommonService) : LambdaClientConfigProvider("vnAppInfo", async cancellationToken =>
{
    var info = await posApiCommonService.GetClientInformationAsync(cancellationToken);

    return new
    {
        brand = info.BrandId,
        channel = info.ChannelId,
        frontend = info.FrontendId,
        product = info.ProductId,
    };
}) { }
