using System;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Context;
using Frontend.Vanilla.Configuration.DynaCon.FileFallback;
using Frontend.Vanilla.Configuration.DynaCon.Tests.Fakes;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Moq;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Context;

public class ContextHierarchyInitializerTests : IDisposable
{
    private IConfigurationInitializer target;
    private Mock<IContextHierarchyRestService> restService;
    private Mock<ICurrentContextHierarchyManager> currentContextHierarchy;
    private Mock<IFallbackFile<VariationContextHierarchy>> fallbackFile;
    private TestLogger<ContextHierarchyInitializer> log;

    public ContextHierarchyInitializerTests()
    {
        restService = new Mock<IContextHierarchyRestService>();
        currentContextHierarchy = new Mock<ICurrentContextHierarchyManager>();
        fallbackFile = new Mock<IFallbackFile<VariationContextHierarchy>> { DefaultValue = DefaultValue.Mock };
        log = new TestLogger<ContextHierarchyInitializer>();
        target = new ContextHierarchyInitializer(currentContextHierarchy.Object, restService.Object, fallbackFile.Object, log);
    }

    public void Dispose()
        => fallbackFile.VerifyWithAnyArgs(f => f.Handler.Write(null), Times.Never);

    [Fact]
    public void ShouldInitializeFromRestService()
    {
        var hierarchy = TestCtxHierarchy.Get();
        restService.Setup(s => s.Get()).Returns(hierarchy);

        // Act
        target.Initialize();

        currentContextHierarchy.Verify(h => h.Set(hierarchy));
        fallbackFile.VerifyGet(f => f.Handler, Times.Never);
    }

    [Fact]
    public void ShouldFail_IfServiceFailed_AndFallbackDisabled()
    {
        var serviceEx = new Exception("Service error");
        restService.Setup(s => s.Get()).Throws(serviceEx);
        fallbackFile.SetupGet(f => f.Handler).Returns(() => null);

        var act = target.Initialize;

        act.Should().Throw().SameAs(serviceEx);
        log.Logged.Single().Verify(LogLevel.Critical, serviceEx);
    }

    [Fact]
    public void ShouldFallbackToFile_IfServiceFailed_AndFallbackEnabled()
    {
        var hierarchy = TestCtxHierarchy.Get();
        var serviceEx = new Exception("Service error");
        restService.Setup(s => s.Get()).Throws(serviceEx);
        fallbackFile.Setup(f => f.Handler.Read()).Returns(hierarchy);

        // Act
        target.Initialize();

        currentContextHierarchy.Verify(h => h.Set(hierarchy));
        log.Logged.Single().Verify(LogLevel.Error, serviceEx);
    }

    [Fact]
    public void ShouldFail_IfServiceAndFallbackFileFailed()
    {
        var serviceEx = new Exception("Service error");
        var fallbackEx = new Exception("Fallback error");
        restService.Setup(s => s.Get()).Throws(serviceEx);
        fallbackFile.Setup(f => f.Handler.Read()).Throws(fallbackEx);

        var act = target.Initialize;

        var ex = act.Should().Throw<AggregateException>().Which;
        ex.InnerExceptions.Should().Equal(serviceEx, fallbackEx);
        log.Logged.Should().HaveCount(2);
        log.Logged[0].Verify(LogLevel.Error, serviceEx);
        log.Logged[1].Verify(LogLevel.Critical, ex);
    }
}
