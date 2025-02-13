using System;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Context;
using Frontend.Vanilla.Configuration.DynaCon.Polling;
using Frontend.Vanilla.Configuration.DynaCon.Polling.ContextHierarchy;
using Frontend.Vanilla.Configuration.DynaCon.Tests.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Polling.ContextHierarchy;

public class UpdateContextHierarchyJobTests
{
    private IScheduledJob target;
    private Mock<ICurrentContextHierarchyManager> ctxHierarchyManager;
    private Mock<IContextHierarchyRestService> restService;

    public UpdateContextHierarchyJobTests()
    {
        ctxHierarchyManager = new Mock<ICurrentContextHierarchyManager>();
        restService = new Mock<IContextHierarchyRestService>();
        target = new UpdateContextHierarchyJob(ctxHierarchyManager.Object, restService.Object);
    }

    [Fact]
    public void GetInterval_ShouldComeFromSettings()
    {
        var settings = TestSettings.Get(s => s.ChangesPollingInterval = TimeSpan.FromSeconds(66));
        target.GetInterval(settings).Should().Be(TimeSpan.FromSeconds(66));
    }

    [Fact]
    public void Execute_ShouldUpdateHierarchy()
    {
        var hierarchy = TestCtxHierarchy.Get();
        restService.Setup(s => s.Get()).Returns(hierarchy);

        // Act
        target.Execute();

        ctxHierarchyManager.Verify(m => m.Set(hierarchy));
    }
}
