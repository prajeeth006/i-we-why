using System;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Container;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization;
using Frontend.Vanilla.Configuration.DynaCon.FileFallback;
using Frontend.Vanilla.Configuration.DynaCon.Initialization;
using Frontend.Vanilla.Configuration.DynaCon.Tests.Fakes;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Moq;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.FileFallback;

public sealed class FallbackChangesetLoaderTests : IDisposable
{
    private IInitialChangesetLoader target;
    private DynaConEngineSettings settings;
    private Mock<IInitialChangesetLoader> inner;
    private Mock<IFallbackFile<IValidChangeset>> fallbackFile;
    private TestLogger<FallbackChangesetLoader> log;

    public FallbackChangesetLoaderTests()
    {
        inner = new Mock<IInitialChangesetLoader>();
        fallbackFile = new Mock<IFallbackFile<IValidChangeset>> { DefaultValue = DefaultValue.Mock };
        log = new TestLogger<FallbackChangesetLoader>();
        settings = TestSettings.Get();
        target = new FallbackChangesetLoader(inner.Object, fallbackFile.Object, log);
    }

    public void Dispose()
        => fallbackFile.VerifyWithAnyArgs(f => f.Handler.Write(null), Times.Never);

    [Fact]
    public void ShouldPassInnerResultByDefault()
    {
        var innerSnapshot = Mock.Of<IConfigurationSnapshot>();
        inner.Setup(i => i.GetConfiguration(It.IsAny<bool>())).Returns(innerSnapshot);

        // Act
        var result = target.GetConfiguration();

        result.Should().BeSameAs(innerSnapshot);
    }

    [Fact]
    public void ShouldGetConfigFromFallbackFile_IfInnerFailed()
    {
        var (innerEx, failedChangeset) = SetupInnerToFail();
        var ctxHierarchy = TestCtxHierarchy.Get();
        var fallbackChangeset = Mock.Of<IValidChangeset>(c => c.Id == 222 && c.ContextHierarchy == ctxHierarchy);
        fallbackFile.Setup(f => f.Handler.Read()).Returns(fallbackChangeset);

        // Act
        var snapshot = target.GetConfiguration();

        snapshot.ActiveChangeset.Should().BeSameAs(fallbackChangeset);
        snapshot.FutureChangesets.Should().Equal(failedChangeset);
        log.Logged.Single().Verify(LogLevel.Error, innerEx);
    }

    [Fact]
    public void ShouldThrow_IfInnerAndFallbackFail()
    {
        var (innerEx, _) = SetupInnerToFail();
        var fallbackEx = new Exception("Fallback error");
        fallbackFile.Setup(f => f.Handler.Read()).Throws(fallbackEx);

        Func<object> act = () => target.GetConfiguration();

        var ex = act.Should().Throw<AggregateException>().Which;
        ex.InnerException.Should().BeSameAs(innerEx);
        ex.InnerExceptions.Skip(1).Single().Should().BeSameAs(fallbackEx);
        log.Logged.Should().HaveCount(2);
        log.Logged[0].Verify(LogLevel.Error, innerEx);
        log.Logged[1].Verify(LogLevel.Critical, ex);
    }

    [Fact]
    public void ShouldRethrow_IfFallbackFileDisabled()
    {
        fallbackFile.SetupGet(f => f.Handler).Returns(() => null);
        var (innerEx, _) = SetupInnerToFail();

        Func<object> act = () => target.GetConfiguration();

        act.Should().Throw().SameAs(innerEx);
    }

    private (Exception, IFailedChangeset) SetupInnerToFail()
    {
        var changeset = Mock.Of<IFailedChangeset>(c => c.Id == 111 && c.Errors == new[] { new Exception() });
        var ex = new ConfigurationLoadException("REST error", new ChangesetDeserializationException("Error", changeset));
        inner.Setup(i => i.GetConfiguration(It.IsAny<bool>())).Throws(ex);

        return (ex, changeset);
    }
}
