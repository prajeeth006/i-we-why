using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Infrastructure;

public class PosApiRequestSemaphoresTests
{
    private IPosApiRequestSemaphores target;
    private TestMemoryCache cache;
    private Mock<ICurrentUserAccessor> currentUserAccessor;
    private ExecutionMode mode;

    public PosApiRequestSemaphoresTests()
    {
        cache = new TestMemoryCache();
        currentUserAccessor = new Mock<ICurrentUserAccessor>();
        target = new PosApiRequestSemaphores(cache, currentUserAccessor.Object);
        mode = TestExecutionMode.Get();
    }

    [Theory]
    [InlineData(PosApiDataType.Static, "")]
    [InlineData(PosApiDataType.User, "session-token")]
    public async Task ShouldAllowOneThreadToWait(PosApiDataType dataType, string expectedKeySubstr)
    {
        currentUserAccessor.SetupGet(a => a.User).Returns(TestUser.Get(AuthState.Authenticated));
        var first = await target.WaitDisposableAsync(mode, dataType, "kk");
        var secondTask = Task.Run(() => target.WaitDisposableAsync(mode, dataType, "kk"));

        Thread.Sleep(100);
        secondTask.Status.Should().NotBe(TaskStatus.RanToCompletion);

        first.Dispose();
        await secondTask;

        ((string)cache.CreatedEntries.Single().Key).Should().ContainAll(
            dataType.ToString(), "kk", expectedKeySubstr);
    }

    [Fact]
    public void ShouldFail_IfNotAuthenticated_ButUserData()
    {
        currentUserAccessor.SetupGet(a => a.User).Returns(TestUser.Get());

        Func<Task> act = () => target.WaitDisposableAsync(mode, PosApiDataType.User, "kk");

        act.Should().ThrowAsync<NotAuthenticatedWithPosApiException>();
    }
}
