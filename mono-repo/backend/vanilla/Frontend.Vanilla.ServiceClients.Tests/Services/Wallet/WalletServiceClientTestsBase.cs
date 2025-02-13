using System.Net.Http;
using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Tests.TestUtilities;
using Frontend.Vanilla.Testing.Moq;
using Moq;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Wallet;

public class WalletServiceClientTestsBase : ServiceClientTestsBase
{
    internal Mock<IPosApiRequestSemaphores> RequestSemaphoresMock { get; private set; }

    protected Mock<IPosApiRestClient> PosApiRestClientMock { get; private set; }

    protected override void Setup()
    {
        PosApiRestClientMock = new Mock<IPosApiRestClient>();
        RequestSemaphoresMock = new Mock<IPosApiRequestSemaphores>();
    }

    protected void VerifyGetAsync<T>(bool cached, string endpoint)
    {
        // Assert
        PosApiRestClientMock.Verify(v => v.ExecuteAsync<T>(TestMode,
            It.Is<PosApiRestRequest>(p => p.Url.ToString().Contains($"Wallet.svc/{endpoint}") &&
                                          p.Authenticate && p.Method == HttpMethod.Get)), Times.Once);

        Cache.Verify(c => c.GetAsync(typeof(T), TestMode, PosApiDataType.User, endpoint), Times.Exactly(cached ? 2 : 0));
        Cache.VerifyWithAnyArgs(c => c.GetAsync(null, default, default, null), Times.Exactly(cached ? 2 : 0));
        Cache.Verify(c => c.SetAsync(TestMode, PosApiDataType.User, endpoint, It.IsAny<T>(), null));

        RequestSemaphoresMock.Verify(s => s.WaitDisposableAsync(TestMode, PosApiDataType.User, endpoint));
        RequestSemaphoresMock.Invocations.Should().HaveCount(1);
    }
}
