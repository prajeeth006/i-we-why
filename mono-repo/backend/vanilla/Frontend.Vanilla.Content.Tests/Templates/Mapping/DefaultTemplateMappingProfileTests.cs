using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Content.FieldConversion;
using Frontend.Vanilla.Content.Templates.Mapping;
using Frontend.Vanilla.Content.Tests.Fakes;
using Frontend.Vanilla.Core.System.Text;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Templates.Mapping;

public class DefaultTemplateMappingProfileTests
{
    [Fact]
    public void ShouldMapCorrectly()
    {
        var target = new DefaultTemplateMappingProfile();
        var converters = new DefaultFieldConverters();
        var baseTrackingImpl = TestSitecoreTemplate.Get("Base Tracking", fields: new[]
        {
            TestSitecoreTemplate.GetField("TrackingValues"),
            TestSitecoreTemplate.GetField("DisableTracking"),
            TestSitecoreTemplate.GetField("TrackingGroup"),
            TestSitecoreTemplate.GetField("TrackingId"),
        });
        var tmpls = new[]
        {
            TestSitecoreTemplate.Get("TypeTestTmpl", baseTmpls: new[] { baseTrackingImpl }, fields: new[]
            {
                TestSitecoreTemplate.GetField("CheckBoxFld", "CheckBox"),
                TestSitecoreTemplate.GetField("IntegerFld", "Integer"),
                TestSitecoreTemplate.GetField("DateFld", "Date"),
                TestSitecoreTemplate.GetField("DateTimeFld", "DateTime"),
                TestSitecoreTemplate.GetField("HtmlFld", "Html"),
                TestSitecoreTemplate.GetField("ChecklistFld", "Checklist"),
                TestSitecoreTemplate.GetField("RichTextFld", "Rich Text"),
                TestSitecoreTemplate.GetField("MemoFld", "Memo"),
                TestSitecoreTemplate.GetField("PasswordFld", "Password"),
                TestSitecoreTemplate.GetField("TextFld", "Text"),
                TestSitecoreTemplate.GetField("SingleLineTextFld", "Single-Line Text"),
                TestSitecoreTemplate.GetField("MultiLineTextFld", "Multi-Line Text"),
                TestSitecoreTemplate.GetField("JsonFld", "Json"),
                TestSitecoreTemplate.GetField("FileFld", "File"),
                TestSitecoreTemplate.GetField("NameValueListFld", "Name Value List"),
                TestSitecoreTemplate.GetField("DropLinkFld", "DropLink"),
                TestSitecoreTemplate.GetField("DropTreeFld", "DropTree"),
                TestSitecoreTemplate.GetField("ImageFld", "Image"),
                TestSitecoreTemplate.GetField("GeneralLinkFld", "General Link"),
                TestSitecoreTemplate.GetField("BwinLinkFld", "BwinLink"),
                TestSitecoreTemplate.GetField("SmartLinkFld", "SmartLink"),
                TestSitecoreTemplate.GetField("BwinNameValueListSortedFld", "Bwin Name Value List Sorted"),
                TestSitecoreTemplate.GetField("BwinNameValueListUnsortedFld", "Bwin Name Value List Unsorted"),
                TestSitecoreTemplate.GetField("TreeListFld", "TreeList"),
                TestSitecoreTemplate.GetField("TreeListExFld", "TreeListEx"),
                TestSitecoreTemplate.GetField("RelativeTreeListFld", "RelativeTreeList"),
                TestSitecoreTemplate.GetField("RulesFld", "Rules"),
                TestSitecoreTemplate.GetField("BwinVideoFld", "BwinVideo"),
            }),
            TestSitecoreTemplate.Get("Form Element Template", baseTmpls: new[] { baseTrackingImpl }, fields: new[]
            {
                TestSitecoreTemplate.GetField("Values"),
            }),
            TestSitecoreTemplate.Get("PCRegionalComponent", fields: new[]
            {
                TestSitecoreTemplate.GetField("RegionItems"),
            }),
            TestSitecoreTemplate.Get("LinkTemplate", fields: new[]
            {
                TestSitecoreTemplate.GetField("LocalizedUrl"),
                TestSitecoreTemplate.GetField("Url"),
            }),
            TestSitecoreTemplate.Get("View Template", fields: new[]
            {
                TestSitecoreTemplate.GetField("PageKeywords"),
            }),
            TestSitecoreTemplate.Get("PMBasePage", fields: new[]
            {
                TestSitecoreTemplate.GetField("PageKeywords"),
            }),
            baseTrackingImpl,
        };

        // Act
        var mappings = target.MapTemplates(tmpls);

        mappings.Should().BeEquivalentTo(new Dictionary<TrimmedRequiredString, IReadOnlyDictionary<TrimmedRequiredString, FieldMapping>>
        {
            ["TypeTestTmpl"] = new Dictionary<TrimmedRequiredString, FieldMapping>
            {
                { "CheckBoxFld", converters.Bool.AsMapping() },
                { "IntegerFld", converters.Int.AsMapping() },
                { "DateFld", converters.DateTime.AsMapping() },
                { "DateTimeFld", converters.DateTime.AsMapping() },
                { "HtmlFld", converters.String.AsMapping() },
                { "ChecklistFld", converters.String.AsMapping() },
                { "RichTextFld", converters.String.AsMapping() },
                { "MemoFld", converters.String.AsMapping() },
                { "PasswordFld", converters.String.AsMapping() },
                { "TextFld", converters.String.AsMapping() },
                { "SingleLineTextFld", converters.String.AsMapping() },
                { "MultiLineTextFld", converters.String.AsMapping() },
                { "JsonFld", converters.String.AsMapping() },
                { "FileFld", converters.String.AsMapping() },
                { "NameValueListFld", converters.String.AsMapping() },
                { "DropLinkFld", converters.DocumentId.AsMapping() },
                { "DropTreeFld", converters.DocumentId.AsMapping() },
                { "ImageFld", converters.ContentImage.AsMapping() },
                { "GeneralLinkFld", converters.ContentLink.AsMapping() },
                { "BwinLinkFld", converters.ContentLink.AsMapping() },
                { "SmartLinkFld", converters.ContentLink.AsMapping() },
                { "BwinVideoFld", converters.ContentVideo.AsMapping() },
                { "BwinNameValueListSortedFld", converters.BwinNameValueCollection.AsMapping() },
                { "BwinNameValueListUnsortedFld", converters.BwinNameValueCollection.AsMapping() },
                { "TreeListFld", converters.DocumentIdList.AsMapping() },
                { "TreeListExFld", converters.DocumentIdList.AsMapping() },
                { "RelativeTreeListFld", converters.DocumentIdList.AsMapping() },
                { "RulesFld", converters.ProxyRules.AsMapping() },
            },
            ["Form Element Template"] = new Dictionary<TrimmedRequiredString, FieldMapping>
            {
                { "Values", converters.ListItems.AsMapping() },
            },
            ["PCRegionalComponent"] = new Dictionary<TrimmedRequiredString, FieldMapping>
            {
                { "RegionItems", converters.RegionItems.AsMapping() },
            },
            ["LinkTemplate"] = new Dictionary<TrimmedRequiredString, FieldMapping>
            {
                { "Url", converters.LinkTemplateUrl.AsMapping() },
            },
            ["View Template"] = new Dictionary<TrimmedRequiredString, FieldMapping>(),
            ["PMBasePage"] = new Dictionary<TrimmedRequiredString, FieldMapping>(),
        }, o => o.RespectingRuntimeTypes());
    }
}
