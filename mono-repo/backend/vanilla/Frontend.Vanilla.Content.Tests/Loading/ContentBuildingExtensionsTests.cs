using System;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Content.Loading;
using Frontend.Vanilla.Content.Tests.Fakes;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Loading;

public class ContentBuildingExtensionsTests
{
    private SuccessContent<IDocument> content;

    public ContentBuildingExtensionsTests()
    {
        var metadata = Mock.Of<IDocumentMetadata>(m => m.Id == (DocumentId)"/test-id");
        var fields = new Dictionary<string, object>
        {
            { "Field1", "Value1" },
            { "Field2", "Value2" },
            { "Field3", "Value3" },
        };
        content = new SuccessContent<IDocument>(new TestDocument(new DocumentData(metadata, fields)));
    }

    [Fact]
    public void ToInvalid_ShouldConvertCorrectly()
    {
        var result = content.ToInvalid("Oups"); // Act

        result.Metadata.Should().BeSameAs(content.Metadata);
        result.Errors.Should().Equal("Oups");
    }

    [Fact]
    public void ToFiltered_ShouldConvertCorrectly()
    {
        var result = content.ToFiltered(); // Act

        result.Metadata.Should().BeSameAs(content.Metadata);
    }

    [Theory, BooleanData]
    public void WithFieldsOverwritten_ShouldConvertCorrectly(bool testParamsOverload)
    {
        var newFields = new (string, object)[]
        {
            ("Field1", "Overwritten1"),
            ("field3", "Overwritten3"), // Should be case-insensitive
        };

        var result = RunWithFieldsOverwritten(testParamsOverload, newFields); // Act

        result.Metadata.Should().BeSameAs(content.Metadata);
        result.Document.Should().BeOfType(content.Document.GetType());
        result.Document.Data.Fields.Should().Equal(new Dictionary<string, object>
        {
            { "Field1", "Overwritten1" },
            { "Field2", "Value2" },
            { "Field3", "Overwritten3" },
        });
    }

    [Theory]
    [InlineData(false, null)]
    [InlineData(true, null)]
    [InlineData(false, "")]
    [InlineData(true, "")]
    [InlineData(false, "  ")]
    [InlineData(true, "  ")]
    [InlineData(false, "Unknown")]
    [InlineData(true, "Unknown")]
    public void WithFieldsOverwritten_ShouldThrow_IfNonExistentFieldsSpecified(
        bool testParamsOverload,
        string fieldName)
    {
        var reportedName = fieldName != null ? $"'{fieldName}'" : "null";

        Action act = () => RunWithFieldsOverwritten(testParamsOverload, (fieldName, "Oups"));

        act.Should().Throw<ArgumentException>()
            .WithMessage($"Only existing fields can be overwritten but specified field {reportedName} doesn't exist."
                         + " Existing fields: 'Field1', 'Field2', 'Field3'. (Parameter 'fieldsToOverwrite')");
    }

    private SuccessContent<IDocument> RunWithFieldsOverwritten(bool testParamsOverload, params (string, object)[] newFields)
        => testParamsOverload
            ? content.WithFieldsOverwritten(newFields)
            : content.WithFieldsOverwritten((IEnumerable<(string, object)>)newFields);
}
