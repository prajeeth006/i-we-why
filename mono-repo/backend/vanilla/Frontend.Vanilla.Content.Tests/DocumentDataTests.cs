using System;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests;

public class DocumentDataTests
{
    [Fact]
    public void ShouldCreateCorrectly()
    {
        var metadata = Mock.Of<IDocumentMetadata>();
        var fields = new Dictionary<string, object>
        {
            { "Foo", "Foo Value" },
            { "Bar", "Bar Value" },
        };

        // Act
        var target = new DocumentData(metadata, fields);

        target.Metadata.Should().BeSameAs(metadata);
        target.Fields.Should().Equal(
            new Dictionary<string, object>
            {
                { "Foo", "Foo Value" },
                { "Bar", "Bar Value" },
            });
        target.Fields.Should().NotBeSameAs(fields, "should be copied");
    }

    [Fact]
    public void Fields_ShoudSupportEmpty()
    {
        var target = new DocumentData(Mock.Of<IDocumentMetadata>(), new Dictionary<string, object>()); // Act
        target.Fields.Should().BeEmpty();
    }

    [Fact]
    public void Fields_ShouldBeReadOnly()
    {
        var target = new DocumentData(Mock.Of<IDocumentMetadata>(), new Dictionary<string, object>()); // Act
        ((IDictionary<string, object>)target.Fields).IsReadOnly.Should().BeTrue();
    }

    [Fact]
    public void Fields_ShouldBeCaseInsensitive()
    {
        var metadata = Mock.Of<IDocumentMetadata>();
        var fields = new Dictionary<string, object>
        {
            { "Foo", "Foo Value" },
            { "foo", "Conflicting Value" },
        };

        Action act = () => new DocumentData(metadata, fields);

        act.Should().Throw<DuplicateException>();
    }

    [Fact]
    public void Fields_ShouldThrow_IfNull()
        => new Action(() => new DocumentData(Mock.Of<IDocumentMetadata>(), null))
            .Should().Throw<ArgumentNullException>()
            .Which.ParamName.Should().Be(nameof(DocumentData.Fields).ToCamelCase());

    [Fact]
    public void Metadata_ShouldThrow_IfNull()
        => new Action(() => new DocumentData(null, new Dictionary<string, object>()))
            .Should().Throw<ArgumentNullException>()
            .Which.ParamName.Should().Be(nameof(DocumentData.Metadata).ToCamelCase());
}
