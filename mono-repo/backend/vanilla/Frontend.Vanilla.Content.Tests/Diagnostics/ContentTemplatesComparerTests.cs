using System;
using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Content.Diagnostics;
using Frontend.Vanilla.Content.Templates;
using Frontend.Vanilla.Content.Tests.Fakes;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Diagnostics;

public class ContentTemplatesComparerTests
{
    private static readonly IContentTemplatesComparer Target = new ContentTemplatesComparer();

    [Fact]
    public void ShouldReturnEmpty_IfNoDifferences()
    {
        // Order and case sensitivity shouldn't matter
        var localTemplates = GetTestTemplates("Local", s => s.ToLower());
        var sitecoreTemplates = GetTestTemplates("Sitecore", s => s.ToUpper()).Reverse();

        IEnumerable<SitecoreTemplate> GetTestTemplates(string source, Func<string, string> transform)
        {
            var baseTmpl = TestSitecoreTemplate.Get(transform("Base"), source + "1", fields: new[]
            {
                new SitecoreTemplateField(transform("Field1"), transform("Type1"), true),
            });

            yield return baseTmpl;
            yield return TestSitecoreTemplate.Get(transform("Tmpl1"), source + "2", new[] { baseTmpl }, new[]
            {
                new SitecoreTemplateField(transform("Field2"), transform("Type2"), false),
            });
            yield return TestSitecoreTemplate.Get(transform("Tmpl2"), source + "3", fields: new[]
            {
                new SitecoreTemplateField(transform("Field3"), transform("Type3"), true),
                new SitecoreTemplateField(transform("Field4"), transform("Type4"), false),
            });
        }

        var differences = Target.Compare(localTemplates, sitecoreTemplates); // Act

        differences.Should().BeEmpty();
    }

    [Fact]
    public void ShouldDetectAllDifferences()
    {
        var someField = TestSitecoreTemplate.GetField();
        var localBaseTmpl1 = TestSitecoreTemplate.Get("Base1", "LocalSrc");
        var localBaseTmpl2 = TestSitecoreTemplate.Get("Base2", "LocalSrc", fields: new[] { someField });
        var localBaseTmpl3 = TestSitecoreTemplate.Get("Base3", "LocalSrc");
        var localTemplates = new[]
        {
            localBaseTmpl1, localBaseTmpl2, localBaseTmpl3,
            TestSitecoreTemplate.Get("MissingInSitecore", "LocalSrc"),
            TestSitecoreTemplate.Get("UnmappedBase", "LocalSrc"),
            TestSitecoreTemplate.Get("MissingBaseInSitecoreWithFields", "LocalSrc", new[] { localBaseTmpl2 }),
            TestSitecoreTemplate.Get("MissingBaseInSitecoreWithoutFields", "LocalSrc", new[] { localBaseTmpl3 }),
            TestSitecoreTemplate.Get("FieldDifferences", "LocalSrc", fields: new[]
            {
                TestSitecoreTemplate.GetField("DifferentType", "Type1", true),
                TestSitecoreTemplate.GetField("DifferentShared", "Type2", true),
                TestSitecoreTemplate.GetField("MissingInSitecore", "Text", true),
            }),
        };

        var sitecoreBaseTmpl1 = TestSitecoreTemplate.Get("Base1", "SitecoreSrc");
        var sitecoreBaseTmpl2 = TestSitecoreTemplate.Get("Base2", "SitecoreSrc", fields: new[] { someField });
        var sitecoreBaseTmpl3 = TestSitecoreTemplate.Get("Base3", "SitecoreSrc");
        var sitecoreTemplates = new[]
        {
            sitecoreBaseTmpl1, sitecoreBaseTmpl2, sitecoreBaseTmpl3,
            TestSitecoreTemplate.Get("Unmapped", "SitecoreSrc"),
            TestSitecoreTemplate.Get("UnmappedBase", "SitecoreSrc", new[] { sitecoreBaseTmpl1 }),
            TestSitecoreTemplate.Get("MissingBaseInSitecoreWithFields", "SitecoreSrc"),
            TestSitecoreTemplate.Get("MissingBaseInSitecoreWithoutFields", "SitecoreSrc"),
            TestSitecoreTemplate.Get("FieldDifferences", "SitecoreSrc", fields: new[]
            {
                TestSitecoreTemplate.GetField("Unmapped"),
                TestSitecoreTemplate.GetField("DifferentType", "Type3", true),
                TestSitecoreTemplate.GetField("DifferentShared", "Type2", false),
            }),
        };

        var differences = Target.Compare(localTemplates, sitecoreTemplates); // Act

        differences.Should().BeEquivalentTo(new List<(bool, string)>
        {
            (false, "Template 'Unmapped' from SitecoreSrc isn't mapped."),
            (true, "Template 'MissingInSitecore' from LocalSrc doesn't exist on Sitecore side. Code loading it will fail."),
            (false, "Template 'UnmappedBase' from LocalSrc doesn't have 'Base1' from SitecoreSrc mapped in the code as one of its base templates."),
            (true,
                "Template 'MissingBaseInSitecoreWithFields' from SitecoreSrc doesn't have 'Base2' from LocalSrc as its base template on Sitecore side. Deserialization of base fields can fail."),
            (false,
                "Template 'MissingBaseInSitecoreWithoutFields' from SitecoreSrc doesn't have 'Base3' from LocalSrc as its base template on Sitecore side. However it has no fields."),
            (false, "Field 'Unmapped' of template 'FieldDifferences' from SitecoreSrc isn't mapped."),
            (true,
                "Field 'DifferentType' of template 'FieldDifferences' from SitecoreSrc has type 'Type3' on Sitecore side but 'Type1' in the code. Its deserialization can fail."),
            (true,
                "Field 'DifferentShared' of template 'FieldDifferences' from SitecoreSrc has Shared flag equal to False on Sitecore side but True in the code. Its translation validation can fail."),
            (true,
                "Field 'MissingInSitecore' ('Text', Shared=True) of template 'FieldDifferences' from LocalSrc doesn't exist on Sitecore side. Code loading it will fail."),
        });
    }
}
