using System;
using System.Collections.Generic;
using System.Xml.Linq;
using FluentAssertions;
using Frontend.Vanilla.Content.Templates;
using Frontend.Vanilla.Content.Templates.DataSources;
using Frontend.Vanilla.Core.Xml;
using Frontend.Vanilla.Testing.FluentAssertions;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Templates.DataSources;

public class SitecoreServiceTemplatesXmlParserTests
{
    private ISitecoreServiceTemplatesXmlParser target;
    private List<string> trace;

    public SitecoreServiceTemplatesXmlParserTests()
    {
        target = new SitecoreServiceTemplatesXmlParser();
        trace = new List<string>();
    }

    [Fact]
    public void ShouldParseTemplates()
    {
        var xml = XElement.Parse(@"<templates>
                <template name=""LinkTemplate"" key=""linktemplate"" id=""{0A07025B-65F3-4A79-9E5D-0EBD284FD380}"" path=""/Vanilla/Framework/LinkTemplate"">
                    <base>
                        {76734D65-9F48-4298-9260-ECBFEB8BFD86}|{85A20486-C01D-48EA-A259-1941AFCDC0B6}
                    </base>
                    <section name=""SmartLink"" key=""smartlink"" id=""{DB4A2542-CE79-4E0C-8102-B8D30B525FDE}"">
                        <field name=""Name"" key=""name"" id=""{445E8DF0-63E2-40C1-BE67-87718C398A33}"" type=""Single-Line Text"" shared=""1""/>
                        <field name=""Link"" key=""link"" id=""{3A103B84-2D47-46ED-9772-C56BB11F6E52}"" type=""SmartLink"" shared=""0""/>
                    </section>
                    <section name=""Link"" key=""link"" id=""{117AFDE7-3F48-4C1F-BEB5-092B2E63AE93}"">
                        <field name=""Url"" key=""url"" id=""{09917C07-84AB-4B55-B7ED-D7820A4EF042}"" type=""Uri"" shared=""0""/>
                    </section>
                </template>
                <template name=""Base Template"" key=""base template"" id=""{76734D65-9F48-4298-9260-ECBFEB8BFD86}"" path=""/System/Base Template"">
                    <base>
                        {1930BBEB-7805-471A-A3BE-4858AC7CF696}|{81479F42-66D4-4FCE-AD99-1890F64A2CB8}
                    </base>
                </template>
                <template name=""Filter Template"" key=""filter template"" id=""{85A20486-C01D-48EA-A259-1941AFCDC0B6}"" path=""/Vanilla/Framework/Filter Template"">
                    <base>{76734D65-9F48-4298-9260-ECBFEB8BFD86}</base>
                    <section name=""Filter"" key=""filter"" id=""{6DC5DBEA-F1C4-47C6-A488-3825A4F3BF0B}"">
                        <field name=""Condition"" key=""condition"" id=""{63EEB285-1FE5-41DE-A80C-0CA1B2A5BAF3}"" type=""Single-Line Text"" shared=""1""/>
                    </section>
                </template>
            </templates>");

        var result = target.Parse(xml, trace.Add); // Act

        var baseTemplate = new SitecoreTemplate("Base Template", "Sitecore folder '/System'", Array.Empty<SitecoreTemplate>(), Array.Empty<SitecoreTemplateField>());
        var filterTemplate = new SitecoreTemplate("Filter Template", "Sitecore folder '/Vanilla/Framework'", new[] { baseTemplate }, new[]
        {
            new SitecoreTemplateField("Condition", "Single-Line Text", true),
        });
        var linkTemplate = new SitecoreTemplate("LinkTemplate", "Sitecore folder '/Vanilla/Framework'", new[] { baseTemplate, filterTemplate }, new[]
        {
            new SitecoreTemplateField("Name", "Single-Line Text", true),
            new SitecoreTemplateField("Link", "SmartLink", false),
            new SitecoreTemplateField("Url", "Uri", false),
        });
        result.Should().BeEquivalentTo(baseTemplate, filterTemplate, linkTemplate);

        trace.Should().Equal(
            "Warning: Template 'Base Template' from Sitecore folder '/System' refers to base template '{1930BBEB-7805-471A-A3BE-4858AC7CF696}' which is missing in XML response from Sitecore. It will be skipped.",
            "Warning: Template 'Base Template' from Sitecore folder '/System' refers to base template '{81479F42-66D4-4FCE-AD99-1890F64A2CB8}' which is missing in XML response from Sitecore. It will be skipped.",
            "Parsed templates: 'Base Template', 'Filter Template', 'LinkTemplate'.");
    }

    [Fact]
    public void ShouldHandleWhiteSpaces()
    {
        var xml = XElement.Parse(@"<templates>
                <template name=""Whatever"" key=""linktemplate"" id=""{0A07025B-65F3-4A79-9E5D-111}"" path=""/MyTemplates/NoBaseNoFields"" />
                <template name=""Whatever"" key=""linktemplate"" id=""{0A07025B-65F3-4A79-9E5D-222}"" path=""/MyTemplates/WhiteSpaceBaseAndEmptySections"">
                    <base>  </base>
                    <section name=""SmartLink"" key=""smartlink"" id=""{DB4A2542-CE79-4E0C-8102-B8D30B525FDE}"">
                    </section>
                    <section />
                </template>
                <template name=""Whatever"" key=""linktemplate"" id=""  {0A07025B-65F3-4A79-9E5D-333}  "" path=""  /MyTemplates/  NotTrimmed  "">
                    <base />
                    <section name=""SmartLink"" key=""smartlink"" id=""{DB4A2542-CE79-4E0C-8102-B8D30B525FDE}"">
                        <field name=""  NotTrimmedAttributes  "" key=""name"" id=""{445E8DF0-63E2-40C1-BE67-87718C398A33}"" type=""  Single-Line Text  "" shared=""  1  ""/>
                        <field name=""MissingSharedAttribute"" key=""link"" id=""{3A103B84-2D47-46ED-9772-C56BB11F6E52}"" type=""SmartLink"" />
                    </section>
                </template>
                <template name=""Whatever"" key=""linktemplate"" id=""{0A07025B-65F3-4A79-9E5D-444}"" path=""/MyTemplates/BaseWithWhiteSpaces"">
                    <base> {0A07025B-65F3-4A79-9E5D-333} |  {0A07025B-65F3-4A79-9E5D-111}  </base>
                </template>
            </templates>");

        var result = target.Parse(xml, trace.Add); // Act

        var noBaseNoFields = new SitecoreTemplate(
            "NoBaseNoFields",
            "Sitecore folder '/MyTemplates'",
            Array.Empty<SitecoreTemplate>(),
            Array.Empty<SitecoreTemplateField>());

        var whiteSpaceBaseAndEmptySections = new SitecoreTemplate(
            "WhiteSpaceBaseAndEmptySections",
            "Sitecore folder '/MyTemplates'",
            Array.Empty<SitecoreTemplate>(),
            Array.Empty<SitecoreTemplateField>());

        var notTrimmed = new SitecoreTemplate("NotTrimmed", "Sitecore folder '/MyTemplates'", Array.Empty<SitecoreTemplate>(), new[]
        {
            new SitecoreTemplateField("NotTrimmedAttributes", "Single-Line Text", true),
            new SitecoreTemplateField("MissingSharedAttribute", "SmartLink", false),
        });

        var baseWithWhiteSpaces = new SitecoreTemplate(
            "BaseWithWhiteSpaces",
            "Sitecore folder '/MyTemplates'",
            new[] { notTrimmed, noBaseNoFields },
            Array.Empty<SitecoreTemplateField>());

        result.Should().BeEquivalentTo(noBaseNoFields, baseWithWhiteSpaces, notTrimmed, whiteSpaceBaseAndEmptySections);
        trace.Should().Equal("Parsed templates: 'NoBaseNoFields', 'WhiteSpaceBaseAndEmptySections', 'NotTrimmed', 'BaseWithWhiteSpaces'.");
    }

    public static IEnumerable<object[]> GetInvalidXmls() => new[]
    {
        new object[] { GetInvalidXml(id: "  ") },
        new object[] { GetInvalidXml(path: "  ") },
        new object[] { GetInvalidXml(fieldName: "  ") },
        new object[] { GetInvalidXml(fieldType: "  ") },
    };

    private static XElement GetInvalidXml(string id = "0A07025B", string path = "/Vanilla/LinkTemplate", string fieldName = "Foo", string fieldType = "Text")
        => XElement.Parse($@"<template name=""Whatever"" key=""linktemplate"" id=""{id}"" path=""{path}"">
                <section name=""SmartLink"" key=""smartlink"" id=""DB4A2542-CE79-4E0C-8102-B8D30B525FDE"">
                    <field name=""{fieldName}"" key=""name"" id=""445E8DF0-63E2-40C1-BE67-87718C398A33"" type=""{fieldType}"" shared=""1""/>
                </section>
            </template>");

    [Theory, MemberData(nameof(GetInvalidXmls))]
    public void ShouldThrow_IfInvalidXml(XElement templateXml)
    {
        var xml = new XElement("templates", templateXml);

        Action act = () => target.Parse(xml, trace.Add); // Act

        act.Should().Throw().WithMessage("Failed parsing template from XML: " + templateXml)
            .Which.InnerException.Should().BeOfType<RequiredXmlAttributeException>();
    }

    [Fact]
    public void ShouldThrow_IfMultipleTemplatesWithSameName()
    {
        var xml = XElement.Parse(@"<templates>
                <template name=""Whatever"" key=""linktemplate"" id=""{0A07025B-65F3-4A79-9E5D-111}"" path=""/Folder-1/Conflict"" />
                <template name=""Whatever"" key=""linktemplate"" id=""{0A07025B-65F3-4A79-9E5D-222}"" path=""/Folder-2/confLICT"" />
            </templates>");

        Action act = () => target.Parse(xml, trace.Add); // Act

        act.Should().Throw()
            .WithMessage(
                "Template name is used as unique identifier but 'Conflict' is used by multiple templates: 'Conflict' from Sitecore folder '/Folder-1', 'confLICT' from Sitecore folder '/Folder-2'.");
    }

    [Fact]
    public void ShouldReturnEmpty_IfEmpty()
    {
        var result = target.Parse(new XElement("templates"), trace.Add); // Act

        result.Should().BeEmpty();
    }

    [Fact]
    public void ShouldIgnoreDuplicateTemplateById_BecauseXmlIsMergedFromMultipleRequests()
    {
        var xml = XElement.Parse(@"<templates>
                <template name=""Foo"" key=""footemplate"" id=""{0A07025B-65F3-4A79-9E5D-111}"" path=""/MyTemplates/Foo"" />
                <template name=""Bar"" key=""bartemplate"" id=""{0A07025B-65F3-4A79-9E5D-111}"" path=""/MyTemplates/Bar"" />
            </templates>");

        var result = target.Parse(xml, trace.Add); // Act

        result.Should().BeEquivalentTo(
            new SitecoreTemplate("Foo", "Sitecore folder '/MyTemplates'", Array.Empty<SitecoreTemplate>(), Array.Empty<SitecoreTemplateField>()));
    }
}
