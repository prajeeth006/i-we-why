using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Content.FieldConversion;
using Frontend.Vanilla.Content.Loading.Deserialization;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Content.Templates.DataSources;
using Frontend.Vanilla.Content.Tests.Templates.Mapping;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Loading.Deserialization;

public class DocumentDeserializerTests
{
    private IDocumentDeserializer target;
    private IDocumentIdFactory documentIdFactory;
    private Mock<IReflectionTemplatesSource> templatesSource;
    private Mock<IContentConfiguration> contentConfiguration;

    private Mock<IFieldConverter<int>> fieldConverter1;
    private Mock<IFieldConverter<string>> fieldConverter2;
    private Mock<IFieldConverter<string>> fieldConverter3;

    private Mock<IDocumentMetadata> metadata;
    private DocumentSourceData sourceData;

    public DocumentDeserializerTests()
    {
        documentIdFactory = Mock.Of<IDocumentIdFactory>();
        templatesSource = new Mock<IReflectionTemplatesSource>();
        contentConfiguration = new Mock<IContentConfiguration>();
        target = new DocumentDeserializer(documentIdFactory, templatesSource.Object, contentConfiguration.Object);

        fieldConverter1 = new Mock<IFieldConverter<int>>();
        fieldConverter2 = new Mock<IFieldConverter<string>>();
        fieldConverter3 = new Mock<IFieldConverter<string>>();
        templatesSource.SetupGet(s => s.Mappings).Returns(new Dictionary<TrimmedRequiredString, (Type, IReadOnlyDictionary<TrimmedRequiredString, FieldMapping>)>
        {
            ["FooTmpl"] = (typeof(FooDocument), new Dictionary<TrimmedRequiredString, FieldMapping>
            {
                { "Field1", fieldConverter1.Object.AsMapping() },
                { "Field2", fieldConverter2.Object.AsMapping() },
                { "Field3", fieldConverter3.Object.AsMapping() },
            }),
            ["BarTmpl"] = (typeof(string), new Dictionary<TrimmedRequiredString, FieldMapping>()),
        });

        metadata = new Mock<IDocumentMetadata>();
        metadata.SetupGet(m => m.TemplateName).Returns("FooTmpl");
        metadata.SetupGet(m => m.Id).Returns(new DocumentId("/item", culture: new CultureInfo("sw-KE")));
        sourceData = new DocumentSourceData(metadata.Object, new Dictionary<string, string> // Field2 is missing
        {
            { "Field1", "number" },
            { "Field3", "str" },
        });

        fieldConverter1.SetupWithAnyArgs(c => c.Convert(null)).Returns(666);
        fieldConverter2.SetupWithAnyArgs(c => c.Convert(null)).Returns("Hello");
        fieldConverter3.SetupWithAnyArgs(c => c.Convert(null)).Returns("world");
        contentConfiguration.SetupGet(c => c.ItemPathDisplayModeEnabled).Returns(true);
        contentConfiguration.SetupGet(c => c.ItemPathDisplayModeMapping)
            .Returns(new Dictionary<string, IReadOnlyList<string>> { ["FooTmpl"] = new List<string> { "Field1" } });
    }

    private class FooDocument : Document
    {
        public FooDocument(DocumentData data)
            : base(data) { }
    }

    [Fact]
    public void ShouldDeserializeDocumentAndSetItemPathForField1()
    {
        var doc = (FooDocument)target.Deserialize(sourceData); // Act

        doc.Metadata.Should().BeSameAs(metadata.Object);
        doc.Data.Fields.Should().BeEquivalentTo(new Dictionary<string, object>
        {
            { "Field1", "/item" },
            { "Field2", "Hello" },
            { "Field3", "world" },
        });

        Verify(fieldConverter2, null);
        Verify(fieldConverter3, "str");

        void Verify(Mock converter, string expectedValue)
        {
            var ctx = (FieldConversionContext)converter.Invocations.Single().Arguments[0];
            ctx.SourcePath.Should().Be(sourceData.Metadata.Id.Path);
            ctx.FieldValue.Should().Be(expectedValue);
            ctx.Culture.Name.Should().Be("sw-KE");
            ctx.DocumentIdFactory.Should().BeSameAs(documentIdFactory);
            ctx.AllFields.Should().BeEquivalentTo(new Dictionary<string, string>
            {
                { "Field1", "number" },
                { "Field3", "str" },
            });
        }
    }

    [Fact]
    public void ShouldThrow_IfUnknownTemplate()
    {
        metadata.SetupGet(m => m.TemplateName).Returns("WtfTmpl");

        Action act = () => target.Deserialize(sourceData); // Act

        act.Should().Throw().WithMessage(
            "Unknown template 'WtfTmpl'. Mapped templates: 'FooTmpl', 'BarTmpl'.");
    }

    [Theory]
    [InlineData("Field2", "null")]
    [InlineData("Field3", "'str'")]
    public void ShouldThrow_IfFieldConverterFails(string failedField, string reportedValue)
    {
        var converterEx = new Exception("Field error");
        var converter = failedField == "Field2" ? fieldConverter2 : fieldConverter3;
        converter.SetupWithAnyArgs(c => c.Convert(null)).Throws(converterEx);

        Action act = () => target.Deserialize(sourceData); // Act

        var ex = act.Should().Throw().Which;
        ex.Message.Should().StartWith($"Failed converting field '{failedField}' to System.String from raw value {reportedValue}.");
        ex.InnerException.Should().BeSameAs(converterEx);
    }
}
