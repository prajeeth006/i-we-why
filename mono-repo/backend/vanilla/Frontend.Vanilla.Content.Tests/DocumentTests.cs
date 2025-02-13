using System;
using System.Collections.Generic;
using System.Globalization;
using FluentAssertions;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.Testing.FluentAssertions;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests;

public class DocumentTests
{
    public class TestDocument : Document
    {
        public string Name => GetValue<string>("DifferentFieldName");
        public int Amount => GetValue<int>("Amount");

        public TestDocument(DocumentData documentData)
            : base(documentData) { }
    }

    [Fact]
    public void ShouldCreateCorrectly()
    {
        var data = new DocumentData(
            Mock.Of<IDocumentMetadata>(),
            new Dictionary<string, object>
            {
                { "DifferentFieldName", "Chuck Norris" },
                { "Amount", 666 },
            });

        // Act
        var target = new TestDocument(data);

        target.Name.Should().Be("Chuck Norris");
        target.Amount.Should().Be(666);
        target.Data.Should().BeSameAs(data);
        target.Metadata.Should().BeSameAs(data.Metadata);
    }

    [Fact]
    public void ShouldThrow_IfNoData()
        => new Func<object>(() => new TestDocument(null))
            .Should().Throw<ArgumentNullException>()
            .Which.ParamName.Should().Be(nameof(IDocument.Data).ToCamelCase());

    [Theory]
    [InlineData("Other", 123, "Unable to find an entry for the field.")]
    [InlineData("Amount", null, "Unable to cast null to System.Int32.")]
    [InlineData("Amount", "abc", "Unable to cast System.String to System.Int32.")]
    public void ShouldThrow_IfInvalidValue(string fieldName, object fieldValue, string expectedErrorPrefix)
    {
        CultureInfoHelper.SetCurrent(new CultureInfo("sw-KE"));
        var metadata = Mock.Of<IDocumentMetadata>(m => m.Id == (DocumentId)"/test-v1.0/page" && m.TemplateName == "test tmpl");
        var fields = new Dictionary<string, object> { { fieldName, fieldValue } };
        var target = new TestDocument(new DocumentData(metadata, fields));

        Func<object> act = () => target.Amount;

        act.Should().Throw().WithMessage(
            expectedErrorPrefix + " Failed in field 'Amount' of content /test-v1.0/page - sw-KE of template 'test tmpl' -> Frontend.Vanilla.Content.Tests.DocumentTests+TestDocument."
                                + " Most likely the auto generated code is out of sync with the template definitions?");
    }
}
