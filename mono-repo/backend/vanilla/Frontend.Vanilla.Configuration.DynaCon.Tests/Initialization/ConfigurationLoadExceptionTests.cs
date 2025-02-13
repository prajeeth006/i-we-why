using System;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization;
using Frontend.Vanilla.Configuration.DynaCon.Initialization;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Initialization;

public sealed class ConfigurationLoadExceptionTests
{
    [Theory, BooleanData]
    public void ConstructorTest(bool hasFailedChangeset)
    {
        var failedChangeset = hasFailedChangeset ? Mock.Of<IFailedChangeset>(c => c.Errors == new[] { new Exception() }) : null;
        var innerEx = hasFailedChangeset ? new ChangesetDeserializationException("Error", failedChangeset) : new Exception();

        // Act
        var target = new ConfigurationLoadException("Error msg", innerEx);

        target.Message.Should().Be("Error msg");
        target.InnerException.Should().BeSameAs(innerEx);
        target.FailedChangeset.Should().Be(failedChangeset);
    }
}
