using System;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Deserialization;

public sealed class DeserializationExceptionTests
{
    [Fact]
    public void ChangesetDeserializationException_Test()
    {
        var changeset = Mock.Of<IFailedChangeset>(
            c => c.Errors == new[]
            {
                new FeatureDeserializationException("Feature1", "Message1", null),
                new FeatureDeserializationException("Feature2", "Message2", null),
            });

        // Act
        var target = new ChangesetDeserializationException("Oups", changeset);

        target.Message.Should().Be("Oups");
        target.InnerException.Should().BeSameAs(changeset.Errors[0]);
        target.InnerExceptions.Should().Equal(changeset.Errors);
        target.FailedChangeset.Should().BeSameAs(changeset);
    }

    [Fact]
    public void FeatureDeserializationException_Test()
    {
        var innerEx = new Exception("Inner");

        // Act
        var target = new FeatureDeserializationException("Features.Foo", "Message", innerEx);

        target.FeatureName.Should().Be("Features.Foo");
        target.Message.Should().Be("Message");
        target.InnerException.Should().BeSameAs(innerEx);
    }

    [Fact]
    public void FeatureDeserializationException_ShouldUSeDefaults()
    {
        // Act
        var target = new FeatureDeserializationException("Features.Foo");

        target.Message.Should().Be("Failed deserializing feature 'Features.Foo'.");
        target.InnerException.Should().BeNull();
    }
}
