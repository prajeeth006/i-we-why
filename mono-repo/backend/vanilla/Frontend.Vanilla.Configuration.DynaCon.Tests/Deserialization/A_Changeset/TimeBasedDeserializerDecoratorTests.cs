using System;
using System.Collections.Generic;
using System.Threading;
using Bwin.DynaCon.Api.Contracts.V1;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization.A_Changeset;
using Frontend.Vanilla.Configuration.DynaCon.Tests.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Deserialization.A_Changeset;

public sealed class TimeBasedDeserializerDecoratorTests
{
    private Mock<IChangesetDeserializer> inner;
    private ConfigurationResponse configDto;
    private VariationHierarchyResponse ctxHierarchy;
    private DynaConEngineSettings settings;

    private const int TimeoutMilliSeconds = 100;

    public TimeBasedDeserializerDecoratorTests()
    {
        inner = new Mock<IChangesetDeserializer>();
        settings = TestSettings.Get(s => s.ChangesPollingInterval = TimeSpan.FromMilliseconds(TimeoutMilliSeconds));
        configDto = TestConfigDto.Create();
        ctxHierarchy = TestCtxHierarchy.Get();
    }

    [Fact]
    public void ShouldSuccessfullyDeserializeResult()
    {
        var changeset = Mock.Of<IValidChangeset>();
        inner.Setup(i => i.Deserialize(configDto, ctxHierarchy, ConfigurationSource.Service)).Returns(changeset);

        var result = GetTarget().Deserialize(configDto, ctxHierarchy, ConfigurationSource.Service);

        result.Should().BeSameAs(changeset);
    }

    [Fact]
    public void ShouldThrowException_WhenDeserializationTakesLongerThanTimeoutSpecified()
    {
        inner.Setup(i => i.Deserialize(configDto, ctxHierarchy, ConfigurationSource.Service)).Callback(() => Thread.Sleep(200));

        var target = GetTarget();

        Action act = () => target.Deserialize(configDto, ctxHierarchy, ConfigurationSource.Service);

        act.Should().Throw<Exception>()
            .Which.Message.Should().StartWith($"The deserialization of the changeset ({configDto.ChangesetId}) was aborted after");
    }

    [Fact]
    public void ShouldRethrowInternalExceptionKeepingStackTrace_WhenDeserializationFails()
    {
        var changeset = Mock.Of<IFailedChangeset>((x) => x.Errors == new List<Exception>());
        var ex = new ChangesetDeserializationException("Oups", changeset);
        inner.Setup(i => i.Deserialize(configDto, ctxHierarchy, ConfigurationSource.Service)).Throws(ex);

        var target = GetTarget();

        Action act = () => target.Deserialize(configDto, ctxHierarchy, ConfigurationSource.Service);

        var resultException = act.Should().Throw<ChangesetDeserializationException>().Which;
        resultException.StackTrace.Should().Contain("IChangesetDeserializerProxy.Deserialize");
        resultException.Message.Should().Be("Oups");
    }

    private IChangesetDeserializer GetTarget()
        => new TimeBasedDeserializerDecorator(settings, inner.Object);
}
