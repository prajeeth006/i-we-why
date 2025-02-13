using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Common.Inventory;
using Frontend.Vanilla.ServiceClients.Services.Common.Inventory.Shop;
using Frontend.Vanilla.ServiceClients.Services.Common.Inventory.Terminal;
using Frontend.Vanilla.ServiceClients.Tests.TestUtilities;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Common.Inventory;

public class InventoryServiceClientTests : ServiceClientTestsBase
{
    private IInventoryServiceClient target;

    protected override void Setup()
    {
        target = new InventoryServiceClient(RestClient.Object, Cache.Object, new Mock<ILogger<InventoryServiceClient>>().Object);
    }

    [Theory]
    [InlineData(true, true)]
    [InlineData(false, false)]
    public async Task GetShopDetailsAsync_ShouldExecuteCorrectly(bool cached, bool expectedCached)
    {
        // Setup
        var response = new ShopDetailsResponse();
        RestClientResult = new ShopDetailsDto();

        // Act
        var result = await target.GetShopDetailsAsync(TestMode, "1", cached);

        // Assert
        result.Should().BeEquivalentTo(response);
        VerifyRestClient_ExecuteAsync("Common.svc/Inventory/Shop/V2/1", resultType: typeof(ShopDetailsDto));
        VerifyCache_GetOrCreateAsync<ShopDetailsResponse>(PosApiDataType.Static, "Shop/1", expectedCached);
    }

    [Theory]
    [InlineData(true, true)]
    [InlineData(false, false)]
    public async Task GetTerminalDetailsAsync_ShouldExecuteCorrectly(bool cached, bool expectedCached)
    {
        // Setup
        var request = new TerminalDetailsRequest { ShopId = "1", TerminalId = "1", Cached = cached };
        var response = new TerminalDetailsResponse();
        RestClientResult = new TerminalDetailsDto();

        // Act
        var result = await target.GetTerminalDetailsAsync(TestMode, request);

        // Assert
        result.Should().BeEquivalentTo(response);
        VerifyRestClient_ExecuteAsync("Common.svc/Inventory/Terminal/1/1", authenticate: true, resultType: typeof(TerminalDetailsDto));
        VerifyCache_GetOrCreateAsync<TerminalDetailsResponse>(PosApiDataType.User, "Terminal/1/1", expectedCached);
    }

    [Theory]
    [MemberData(nameof(GetTestCases))]
    public async Task GetShopDetailsAsync_Should_Hanlde_Exceptions(
        string shopId,
        bool shouldThrow,
        Action callback)
    {
        callback ??= () => { };
        var cache = new Mock<IPosApiDataCache>();
        var restClient = new Mock<IPosApiRestClient>();
        var response = new ShopDetailsDto { ShopId = shopId };

        restClient.Setup(c => c.ExecuteAsync<ShopDetailsDto>(It.IsAny<ExecutionMode>(), It.IsAny<PosApiRestRequest>()))
            .ReturnsAsync(response)
            .Callback((ExecutionMode mode, PosApiRestRequest request) => callback());

        var log = new Mock<ILogger<InventoryServiceClient>>();
        var service = new InventoryServiceClient(restClient.Object, cache.Object, log.Object);

        try
        {
            var details = await service.GetShopDetailsAsync(TestMode, shopId, false);
            shouldThrow.Should().BeFalse();
        }
        catch (Exception)
        {
            shouldThrow.Should().BeTrue();
        }
    }

    public static IEnumerable<object[]> GetTestCases()
    {
        yield return GetTestCase("1", false);
        yield return GetTestCase("2", true, () => throw new Exception());
        yield return GetTestCase("3", true, () => throw new PosApiException());
        yield return GetTestCase("4", true, () => throw new PosApiException("hello", new Exception()));
    }

    private static object[] GetTestCase(
        string shopId,
        bool shouldThrow,
        Action callback = null) => new object[] { shopId, shouldThrow, callback };
}
