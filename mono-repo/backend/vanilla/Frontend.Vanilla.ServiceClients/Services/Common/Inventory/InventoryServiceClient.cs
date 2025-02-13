using System;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Common.Inventory.Shop;
using Frontend.Vanilla.ServiceClients.Services.Common.Inventory.Terminal;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.ServiceClients.Services.Common.Inventory;

internal interface IInventoryServiceClient
{
    Task<ShopDetailsResponse> GetShopDetailsAsync(ExecutionMode mode, string shopId, bool cached = true);

    Task<TerminalDetailsResponse> GetTerminalDetailsAsync(ExecutionMode mode, TerminalDetailsRequest request);
}

internal sealed class InventoryServiceClient(IPosApiRestClient restClient, IPosApiDataCache cache, ILogger<InventoryServiceClient> logger)
    : IInventoryServiceClient
{
    public async Task<ShopDetailsResponse> GetShopDetailsAsync(ExecutionMode mode, string shopId, bool cached = true)
    {
        if (string.IsNullOrWhiteSpace(shopId))
        {
            logger.LogWarning("Shop ID is missing");

            return new ShopDetailsResponse();
        }

        return await cache.GetOrCreateAsync(
            mode,
            PosApiDataType.Static,
            $"Shop/{shopId}",
            async () =>
            {
                // TODO: Read from PosApiEndpoint
                var url = new UriBuilder()
                    .AppendPathSegment(PosApiServiceNames.CommonData)
                    .AppendPathSegment("Inventory")
                    .AppendPathSegment("Shop")
                    .AppendPathSegment("V2")
                    .AppendPathSegment(shopId)
                    .GetRelativeUri();

                var posApiRequest = new PosApiRestRequest(url);

                try
                {
                    var response = await restClient.ExecuteAsync<ShopDetailsDto>(mode, posApiRequest);

                    return response?.GetData();
                }
                catch (PosApiException ex)
                {
                    logger.LogError(ex,
                        "Error from PosAPI while calling GetShopDetails action with Shop ID: {ShopId}. {Message}",
                        ex.Message,
                        shopId);

                    return new ShopDetailsResponse();
                }
            }, cached);
    }

    public async Task<TerminalDetailsResponse> GetTerminalDetailsAsync(ExecutionMode mode, TerminalDetailsRequest request)
    {
        if (string.IsNullOrWhiteSpace(request?.ShopId) || string.IsNullOrWhiteSpace(request.TerminalId))
        {
            logger.LogWarning("Shop ID or/and Terminal ID is missing");

            return new TerminalDetailsResponse();
        }

        return await cache.GetOrCreateAsync(
            mode,
            PosApiDataType.User,
            $"Terminal/{request.ShopId}/{request.TerminalId}",
            async () =>
            {
                var url = new UriBuilder()
                    .AppendPathSegment(PosApiServiceNames.CommonData)
                    .AppendPathSegment("Inventory")
                    .AppendPathSegment("Terminal")
                    .AppendPathSegment(request.ShopId)
                    .AppendPathSegment(request.TerminalId)
                    .GetRelativeUri();

                var posApiRequest = new PosApiRestRequest(url) { Authenticate = true };

                try
                {
                    var response = await restClient.ExecuteAsync<TerminalDetailsDto>(mode, posApiRequest);

                    return response?.GetData();
                }
                catch (PosApiException ex)
                {
                    logger.LogError(ex,
                        "Error from PosAPI while calling GetShopDetails action with Shop ID: {ShopId} and Terminal ID: {TerminalId}. {Message}",
                        ex.Message,
                        request.ShopId,
                        request.TerminalId);

                    return new TerminalDetailsResponse();
                }
            }, request.Cached);
    }
}
