using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Common.ClientInfo;
using Frontend.Vanilla.ServiceClients.Services.Common.Currencies;
using Frontend.Vanilla.ServiceClients.Services.Wallet.Balances;
using Frontend.Vanilla.ServiceClients.Tests.TestUtilities;
using Frontend.Vanilla.Testing.Moq;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Wallet.Balances;

public class BalanceServiceClientTests : ServiceClientTestsBase
{
    private IBalanceServiceClient target;
    private Mock<ICurrenciesServiceClient> currenciesServiceClient;
    private Mock<IPosApiRequestSemaphores> requestSemaphores;
    private Mock<IClientInformationServiceClient> clientInfoServiceClient;

    private Mock<IDisposable> semaphore;
    private BalancePosApiDto testDto;
    private IReadOnlyList<Currency> currencies;

    protected override void Setup()
    {
        currenciesServiceClient = new Mock<ICurrenciesServiceClient>();
        requestSemaphores = new Mock<IPosApiRequestSemaphores>();
        clientInfoServiceClient = new Mock<IClientInformationServiceClient>();
        target = new BalanceServiceClient(RestClient.Object, currenciesServiceClient.Object, Cache.Object, requestSemaphores.Object, clientInfoServiceClient.Object);

        semaphore = new Mock<IDisposable>();
        currencies = new[]
        {
            new Currency(id: "USD", name: "United States Dollar"),
            new Currency(id: "EUR", name: "Euro"),
        };
        RestClientResult = testDto = new BalancePosApiDto { AccountBalance = 1, PayPalBalance = 2, AccountCurrency = "EUR" };
        currenciesServiceClient.Setup(c => c.GetAsync(TestMode)).ReturnsAsync(currencies);
        requestSemaphores.Setup(s => s.WaitDisposableAsync(TestMode, PosApiDataType.User, "Balance")).ReturnsAsync(semaphore.Object);
        clientInfoServiceClient.Setup(c => c.GetAsync(TestMode)).ReturnsAsync(new ClientInformation(productId: "porn"));
    }

    [Theory, BooleanData]
    public async Task GetAsync_ShouldExecuteCorrectly(bool cached)
    {
        // Act
        var result = await target.GetAsync(TestMode, cached);

        VerifyBalance(result);
        VerifyRestClient_ExecuteAsync("Wallet.svc/Balance", authenticate: true, resultType: typeof(BalancePosApiDto));
        clientInfoServiceClient.VerifyWithAnyArgs(c => c.GetAsync(default), Times.Once);

        Cache.Verify(c => c.GetAsync(typeof(CrossProductBalanceCachedDto), TestMode, PosApiDataType.User, "Balance"), Times.Exactly(cached ? 2 : 0));
        Cache.Verify(c => c.GetAsync(typeof(ProductSpecificBalanceCachedDto), TestMode, PosApiDataType.User, "Balance:porn"), Times.Exactly(cached ? 2 : 0));
        Cache.VerifyWithAnyArgs(c => c.GetAsync(null, default, default, null), Times.Exactly(cached ? 4 : 0));
        VerifySetToCache();

        requestSemaphores.Verify(s => s.WaitDisposableAsync(TestMode, PosApiDataType.User, "Balance"));
        requestSemaphores.Invocations.Should().HaveCount(1);
        semaphore.Verify(s => s.Dispose(), Times.Once);
    }

    [Theory]
    [InlineData(false, false, 1)]
    [InlineData(false, true, 1)]
    [InlineData(true, false, 1)]
    [InlineData(true, true, 0)]
    public async Task GetAsync_ShouldGetFreshBalance_IfMissingOnePart(bool isCrossProductCached, bool isProductSpecificCached, int expectedRestRequestCount)
    {
        if (isCrossProductCached)
            Cache.Setup(c => c.GetAsync(typeof(CrossProductBalanceCachedDto), TestMode, PosApiDataType.User, "Balance"))
                .ReturnsAsync(new CrossProductBalanceCachedDto(
                    0,
                    new Currency(),
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0));
        if (isProductSpecificCached)
            Cache.Setup(c => c.GetAsync(typeof(ProductSpecificBalanceCachedDto), TestMode, PosApiDataType.User, "Balance:porn"))
                .ReturnsAsync(new ProductSpecificBalanceCachedDto(0, 0, 0, 0));

        // Act
        await target.GetAsync(TestMode, true);

        RestClientCalls.Should().HaveCount(expectedRestRequestCount);
        clientInfoServiceClient.VerifyWithAnyArgs(c => c.GetAsync(default), Times.Once);
    }

    [Fact]
    public async Task ConvertAsync_ShouldResolveCurrencyAndCopyAllProperties()
    {
        var result = await target.ConvertAsync(TestMode, testDto); // Act

        VerifyBalance(result);
        RestClientCalls.Should().HaveCount(0);
        clientInfoServiceClient.Invocations.Should().BeEmpty();
        Cache.Invocations.Should().BeEmpty();
    }

    [Fact]
    public async Task SetToCacheAsync_ShouldSetValueToCache()
    {
        var balance = new Balance(
            new Currency(),
            accountBalance: 1,
            payPalBalance: 2);

        // Act
        await target.SetToCacheAsync(TestMode, balance);

        VerifySetToCache();
        clientInfoServiceClient.VerifyWithAnyArgs(c => c.GetAsync(default), Times.Once);
    }

    private void VerifyBalance(Balance result)
    {
        result.AccountBalance.Should().Be(1);
        result.PayPalBalance.Should().Be(2);
        result.AccountCurrency.Should().BeSameAs(currencies[1]);
    }

    private void VerifySetToCache()
    {
        Cache.Verify(c => c.SetAsync(TestMode, PosApiDataType.User, "Balance", It.Is<CrossProductBalanceCachedDto>(d => d.AccountBalance == 1), null));
        Cache.Verify(c => c.SetAsync(TestMode, PosApiDataType.User, "Balance:porn", It.Is<ProductSpecificBalanceCachedDto>(d => d.PayPalBalance == 2), null));
    }
}
