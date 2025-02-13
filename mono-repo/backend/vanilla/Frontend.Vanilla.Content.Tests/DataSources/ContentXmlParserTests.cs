using System;
using System.Collections.Generic;
using System.Globalization;
using System.Xml.Linq;
using FluentAssertions;
using Frontend.Vanilla.Content.DataSources;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.FluentAssertions;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.DataSources;

public class ContentXmlParserTests
{
    private IContentXmlParser target;
    private CultureInfo culture;
    private UtcDateTime sitecoreLoadTime;

    public ContentXmlParserTests()
    {
        var documentIdFactory = new FakeDocumentIdFactory { Prefix = "/rewritten" };
        target = new ContentXmlParser(documentIdFactory);

        culture = new CultureInfo("zh-CN");
        sitecoreLoadTime = TestTime.GetRandomUtc();
    }

    [Fact]
    public void ShouldParseAllItems()
    {
        var xml = XElement.Parse(
            @"<items data-srvid=""140.2.35"">
                <item path=""/app-v1.0/mypromos"" language=""sitecoreLang"" version=""20"" template=""promotion"" key=""mypromos"" name=""MyPromos"" id=""{111}"" parentid=""{5D899774-CD78-4153-AAFC-E07B047A6E4A}"" templateId=""{08233CA5-8A10-418A-951B-383149E5DE41}"">
                    <fields>
                        <field key=""text"" type=""Rich Text"">
                            <content>Hello from promotion!</content>
                        </field>
                        <field key=""condition"" type=""Single-Line Text"">
                            <content>User.IsOK</content>
                        </field>
                    </fields>
                    <item path=""/app-v1.0/mypromos/mylinks"" language=""sitecoreLang"" version=""21"" template=""folder"" key=""mylinks"" name=""MyLinks"" id=""{222}"" parentid=""{5D899774-CD78-4153-AAFC-E07B047A6E4A}"" templateId=""{08233CA5-8A10-418A-951B-383149E5DE41}"">
                        <item path=""/app-v1.0/mypromos/mylinks/myfolder"" language=""sitecoreLang"" version=""0"" template=""folder"" key=""myfolder"" name=""MyFolder"" id=""{333}"" parentid=""{5D899774-CD78-4153-AAFC-E07B047A6E4A}"" templateId=""{08233CA5-8A10-418A-951B-383149E5DE41}"">
                            <item path=""/app-v1.0/mypromos/mylinks/myfolder/myitem1"" language=""sitecoreLang"" version=""0"" template=""pclink"" key=""myitem1"" name=""MyItem1"" id=""{444}"" parentid=""{5D899774-CD78-4153-AAFC-E07B047A6E4A}"" templateId=""{08233CA5-8A10-418A-951B-383149E5DE41}"" />
                            <item path=""/app-v1.0/mypromos/mylinks/myfolder/myitem2"" language=""sitecoreLang"" version=""0"" template=""pclink"" key=""myitem2"" name=""MyItem2"" id=""{555}"" parentid=""{5D899774-CD78-4153-AAFC-E07B047A6E4A}"" templateId=""{08233CA5-8A10-418A-951B-383149E5DE41}"" />
                        </item>
                    </item>
                    <item path=""/app-v1.0/mypromos/promocontent"" language=""sitecoreLang"" version=""30"" template=""pctext"" key=""promocontent"" name=""PromoContent"" id=""{666}"" parentid=""{5D899774-CD78-4153-AAFC-E07B047A6E4A}"" templateId=""{08233CA5-8A10-418A-951B-383149E5DE41}"">
                        <fields>
                            <field key=""parameters"" type=""Rich Text"">
                                <content>
                                    <![CDATA[<xml><param key=""flag"">true</param></xml>]]>
                                </content>
                            </field>
                        </fields>
                    </item>
                </item>
            </items>");

        // Act
        var results = target.ParseData(xml, culture, "sitecoreLang", depthToParse: 2, sitecoreLoadTime);

        VerifyItem(
            results.Requested,
            new DocumentMetadata(
                id: GetExpectedId("/app-v1.0/mypromos", "{111}"),
                templateName: "promotion",
                version: 20,
                childIds: new[] { GetExpectedId("/app-v1.0/mypromos/mylinks"), GetExpectedId("/app-v1.0/mypromos/promocontent") },
                sitecoreLoadTime,
                true),
            expectedFields: new Dictionary<string, string>
            {
                { "text", "Hello from promotion!" },
                { "condition", "User.IsOK" },
            });
        results.Prefetched.Should().HaveCount(3);
        VerifyItem(
            results.Prefetched[0],
            new DocumentMetadata(
                id: GetExpectedId("/app-v1.0/mypromos/mylinks"),
                templateName: "folder",
                version: 21,
                childIds: new[] { GetExpectedId("/app-v1.0/mypromos/mylinks/myfolder") },
                sitecoreLoadTime,
                false));
        VerifyItem(
            results.Prefetched[1],
            new DocumentMetadata(
                id: GetExpectedId("/app-v1.0/mypromos/mylinks/myfolder"),
                templateName: "folder",
                version: 0,
                childIds: new[] { GetExpectedId("/app-v1.0/mypromos/mylinks/myfolder/myitem1"), GetExpectedId("/app-v1.0/mypromos/mylinks/myfolder/myitem2") },
                sitecoreLoadTime,
                false));
        VerifyItem(
            results.Prefetched[2],
            new DocumentMetadata(
                id: GetExpectedId("/app-v1.0/mypromos/promocontent", "{666}"),
                templateName: "pctext",
                version: 30,
                childIds: new DocumentId[0],
                sitecoreLoadTime,
                false),
            expectedFields: new Dictionary<string, string>
            {
                { "parameters", @"<xml><param key=""flag"">true</param></xml>" },
            });

        void VerifyItem(DocumentSourceData actual, DocumentMetadata expectedMetadata, IDictionary<string, string> expectedFields = null)
        {
            actual.Metadata.Should().BeEquivalentTo(expectedMetadata);
            actual.Fields.Should().Equal(expectedFields ?? new Dictionary<string, string>());
        }

        DocumentId GetExpectedId(string path, string id = null)
            => new DocumentId("/rewritten" + path, culture: culture, id: id);
    }

    [Theory]
    [InlineData("<items />", "There must be a single root 'item' but there are 0 of them.")]
    [InlineData("<items><item /><item /></items>", "There must be a single root 'item' but there are 2 of them.")]
    [InlineData(@"<items><item language=""en"" /></items>", null)]
    [InlineData(@"<items><item /></items>", null)]
    [InlineData(@"<items><item version=""wtf"" /></items>", null)]
    public void ShouldWrapException(string invalidXmlStr, string expectedInnerMsg)
    {
        var xml = XElement.Parse(invalidXmlStr);

        Action act = () => target.ParseData(xml, culture, "sitecoreLang", 2, TestTime.GetRandomUtc());

        var ex = act.Should().Throw()
            .WithMessage("Content XML returned from Sitecore isn't according to expected contract: " + xml)
            .Which;

        if (expectedInnerMsg != null)
            ex.InnerException.Message.Should().Be(expectedInnerMsg);
    }
}
