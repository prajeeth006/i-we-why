using System;
using System.Collections.Generic;
using System.Xml;
using FluentAssertions;
using Frontend.Vanilla.Content.FieldConversion.Converters;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Xunit;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.FieldConversion.Converters;

public class LinkTemplateUrlConverterTests : ConverterTestsBase<Uri>
{
    private Dictionary<string, string> allFields;
    private const string NotExist = "Field doesn't exist.";

    public LinkTemplateUrlConverterTests()
    {
        Target = new LinkTemplateUrlConverter();
        allFields = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
        Context.SetupGet(c => c.AllFields).Returns(allFields);
    }

    private static readonly IEnumerable<string> NotExistOrEmptyField = EmptyValues.Append(NotExist);

    [Fact]
    public void ShouldParseUrlFromLocalizedUrl()
    {
        SetupFields(thisField: "http://url", localizedUrlField: "http://localized-url", linkField: "<a href='http://link' />");
        ConvertAndExpect(new Uri("http://localized-url")); // Act
    }

    [Theory, ValuesData(NotExist, null, "", " ")]
    public void ShouldFallbackToUrlField_IfNoLocalizedUrlField(string localizedUrlField)
    {
        SetupFields(thisField: "http://url", localizedUrlField, linkField: "<a href='http://link' />");
        ConvertAndExpect(new Uri("http://url")); // Act
    }

    public static IEnumerable<object[]> TestCases =>
        EmptyValues.ToTestCases().CombineWith(EmptyValues.Append(NotExist));

    [Theory, MemberData(nameof(TestCases))]
    public void ShouldFallbackToUrlField_IfNoFieldValue_NorLocalizedUrlField(
        string thisField,
        string localizedUrlField)
    {
        SetupFields(thisField, localizedUrlField, linkField: "<a href='http://link' />");
        ConvertAndExpect(new Uri("http://link")); // Act
    }

    [Theory, MemberValuesData(nameof(TestUrls))]
    public void ShouldSupportAllUrls(string url)
    {
        SetupFields(url);
        ConvertAndExpect(new Uri(url, UriKind.RelativeOrAbsolute)); // Act
    }

    public static IEnumerable<object[]> TestCasesFields => EmptyValues.ToTestCases()
        .CombineWith(NotExistOrEmptyField)
        .CombineWith(NotExistOrEmptyField);

    [Theory, MemberData(nameof(TestCasesFields))]
    public void ShouldReturnNull_IfAllFieldsEmpty(
        string thisField,
        string localizedUrlField,
        string linkField)
    {
        SetupFields(thisField, localizedUrlField, linkField);
        ConvertAndExpect(null); // Act
    }

    [Fact]
    public void ShouldFail_IfMalformedLinkXml()
    {
        SetupFields(linkField: "<< wtf");

        Target_Convert.Should().Throw() // Act
            .WithMessage("Invalid XML in 'Link' field with value '<< wtf'.")
            .And.InnerException.Should().BeOfType<XmlException>();
    }

    [Theory]
    [InlineData("http://bwin:invalid", null, null, "Url")]
    [InlineData(null, "http://bwin:invalid", null, "LocalizedUrl")]
    [InlineData(null, null, "<a href='http://bwin:invalid' />", "Link")]
    public void ShouldFail_IfMalformedUrl(string thisField, string localizedUrlField, string linkField, string reportedField)
    {
        SetupFields(thisField, localizedUrlField, linkField);
        var reportedFieldValue = thisField ?? localizedUrlField ?? linkField;

        Target_Convert.Should().Throw() // Act
            .WithMessage($"Invalid URL (absolute or relative) in field '{reportedField}' with value '{reportedFieldValue}'.");
    }

    private void SetupFields(string thisField = null, string localizedUrlField = NotExist, string linkField = NotExist)
    {
        Context.SetupGet(c => c.FieldValue).Returns(thisField);

        if (localizedUrlField != NotExist)
            allFields[LinkTemplateUrlConverter.Fields.LocalizedUrl] = localizedUrlField;
        if (linkField != NotExist)
            allFields[LinkTemplateUrlConverter.Fields.Link] = linkField;
    }
}
