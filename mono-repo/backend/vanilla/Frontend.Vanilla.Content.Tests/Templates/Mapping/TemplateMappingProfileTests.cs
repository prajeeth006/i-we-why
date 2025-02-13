using System;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Content.FieldConversion;
using Frontend.Vanilla.Content.Templates;
using Frontend.Vanilla.Content.Templates.Mapping;
using Frontend.Vanilla.Content.Tests.Fakes;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Testing.FluentAssertions;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Templates.Mapping;

public class TemplateMappingProfileTests
{
    private static readonly IFieldConverter<string> StringConverter = Mock.Of<IFieldConverter<string>>();
    private static readonly IFieldConverter<int> IntConverter = Mock.Of<IFieldConverter<int>>();
    private static readonly IFieldConverter<string> ExplicitConverter = Mock.Of<IFieldConverter<string>>();

    private class TestProfile : TemplateMappingProfile
    {
        protected override void OnMap()
        {
            // Should be case-sensitive -> use camel-casing here vs Pascal below
            MapFieldsOfType("text", StringConverter);
            MapFieldsOfType("number", IntConverter);

            IgnoreTemplate("ignoredTmpl");
            IgnoreTemplate("ignoredDespiteNotExistTmpl");

            MapTemplate("explicitTmpl", t =>
            {
                t.IgnoreField("ignoredFld");
                t.IgnoreField("ignoredDespiteNotExistFld");
                t.MapField("explicitFld", ExplicitConverter);
            });
        }
    }

    [Fact]
    public void ShouldMapTemplatesCorrectly()
    {
        var target = new TestProfile();
        var baseTmpl = TestSitecoreTemplate.Get("BaseTmpl", fields: new[]
        {
            TestSitecoreTemplate.GetField(name: "BaseFld", type: "Text"),
        });
        var externalTmplFromVanilla = TestSitecoreTemplate.Get("ExternalTmpl", fields: new[]
        {
            TestSitecoreTemplate.GetField(name: "ExternalFld", type: "Number"),
        });
        var ignoredTmpl = TestSitecoreTemplate.Get("IgnoredTmpl", fields: new[]
        {
            TestSitecoreTemplate.GetField(type: "Text"),
        });
        var templates = new[]
        {
            baseTmpl,
            ignoredTmpl,
            TestSitecoreTemplate.Get("NoFieldsTmpl"),
            TestSitecoreTemplate.Get("FooTmpl", baseTmpls: new[] { baseTmpl, ignoredTmpl }, fields: new[]
            {
                TestSitecoreTemplate.GetField("BarFld", "Number"),
            }),
            TestSitecoreTemplate.Get("ExplicitTmpl", baseTmpls: new[] { externalTmplFromVanilla }, fields: new[]
            {
                TestSitecoreTemplate.GetField("IgnoredFld", "Text"),
                TestSitecoreTemplate.GetField("ExplicitFld", "Text"),
                TestSitecoreTemplate.GetField("DefaultFld", "Text"),
            }),
        };

        // Act
        var mappings = target.MapTemplates(templates);

        mappings.Should().BeEquivalentTo(new Dictionary<TrimmedRequiredString, IReadOnlyDictionary<TrimmedRequiredString, FieldMapping>>
        {
            ["BaseTmpl"] = new Dictionary<TrimmedRequiredString, FieldMapping>
            {
                { "BaseFld", StringConverter.AsMapping() },
            },
            ["NoFieldsTmpl"] = new Dictionary<TrimmedRequiredString, FieldMapping>(),
            ["FooTmpl"] = new Dictionary<TrimmedRequiredString, FieldMapping>
            {
                { "BaseFld", StringConverter.AsMapping() },
                { "BarFld", IntConverter.AsMapping() },
            },
            ["ExplicitTmpl"] = new Dictionary<TrimmedRequiredString, FieldMapping>
            {
                { "ExternalFld", IntConverter.AsMapping() },
                { "ExplicitFld", ExplicitConverter.AsMapping() },
                { "DefaultFld", StringConverter.AsMapping() },
            },
        }, o => o.RespectingRuntimeTypes());
        VerifyComparer(mappings);
        mappings.Values.Each(VerifyComparer);
    }

    private static void VerifyComparer(dynamic dictionary)
        => ((object)dictionary.Comparer).Should().BeSameAs(Document.Comparer);

    private class TypeAlreadyMappedProfile : TemplateMappingProfile
    {
        protected override void OnMap()
        {
            MapFieldsOfType("Text", Mock.Of<IFieldConverter<string>>(c => c.ToString() == "First"));
            MapFieldsOfType("Text", Mock.Of<IFieldConverter<string>>(c => c.ToString() == "Second"));
        }
    }

    [Fact]
    public void ShouldThrow_IfTypeAlreadyMapped()
        => RunExceptionTest<TypeAlreadyMappedProfile>(
            expectedError: "Fields of given type 'Text' can't be mapped using Second because they are already mapped using First. " +
                           TemplateMappingProfile.MappingMessage);

    private class TemplateNotExistProfile : TemplateMappingProfile
    {
        protected override void OnMap()
            => MapTemplate("NotExistTmpl", t => { });
    }

    [Fact]
    public void ShouldThrow_IfTemplateNotExist()
        => RunExceptionTest<TemplateNotExistProfile>(
            expectedError:
            $"Given template 'NotExistTmpl' wasn't found within available templates {TemplateMappingProfile.FromSitecoreDisclaimer}. Existing templates: 'FooTmpl', 'BarTmpl'.",
            tmpls: new[] { TestSitecoreTemplate.Get("FooTmpl"), TestSitecoreTemplate.Get("BarTmpl") });

    private class TemplateAlreadyMappedProfile : TemplateMappingProfile
    {
        protected override void OnMap()
        {
            MapTemplate("FooTmpl", t => t.IgnoreField("TestFld"));
            MapTemplate("FooTmpl", t => { });
        }
    }

    [Fact]
    public void ShouldThrow_IfTemplateAlreadyMapped()
        => RunExceptionTest<TemplateAlreadyMappedProfile>(
            expectedError: "Given template 'FooTmpl' is already mapped - fields: 'TestFld'. " + TemplateMappingProfile.MappingMessage,
            tmpls: TestSitecoreTemplate.Get("FooTmpl"));

    private class FieldNotExistProfile : TemplateMappingProfile
    {
        protected override void OnMap()
            => MapTemplate("FooTmpl", t => t.MapField("NotExistFld", StringConverter));
    }

    [Fact]
    public void ShouldThrow_IfFieldNotExist()
        => RunExceptionTest<FieldNotExistProfile>(
            expectedError: $"There is no own field 'NotExistFld' on template 'FooTmpl' {TemplateMappingProfile.FromSitecoreDisclaimer}."
                           + " Existing own fields: 'OwnFld1', 'OwnFld2'."
                           + " Existing inherited fields (can be customized only on respective template): 'BaseFld1', 'BaseFld2'.",
            tmpls: TestSitecoreTemplate.Get("FooTmpl",
                baseTmpls: new[] { TestSitecoreTemplate.Get(fields: new[] { TestSitecoreTemplate.GetField("BaseFld1"), TestSitecoreTemplate.GetField("BaseFld2") }) },
                fields: new[] { TestSitecoreTemplate.GetField("OwnFld1"), TestSitecoreTemplate.GetField("OwnFld2") }));

    private class NoFieldMappingProfile : TemplateMappingProfile
    {
        protected override void OnMap()
        {
            MapFieldsOfType("Text", StringConverter);
            MapTemplate("BaseTmpl", t => t.MapField("Title", StringConverter));
            MapTemplate("FooTmpl", t => t.MapField("Body", StringConverter));
        }
    }

    [Fact]
    public void ShouldThrow_IfNoFieldMapping()
    {
        var baseTmpl = TestSitecoreTemplate.Get("BaseTmpl", fields: new[]
        {
            TestSitecoreTemplate.GetField("Title"),
        });
        var testTmpl = TestSitecoreTemplate.Get("FooTmpl", baseTmpls: new[] { baseTmpl }, fields: new[]
        {
            TestSitecoreTemplate.GetField("UnknownFld", "Number", true),
            TestSitecoreTemplate.GetField("Body"),
        });

        RunExceptionTest<NoFieldMappingProfile>(
            expectedError: "There is no suitable mapping for field 'UnknownFld' ('Number', Shared=True) of template 'FooTmpl'."
                           + " Are your content templates up-to-date? You can also MapTemplate('FooTmpl', t => t.IgnoreField('UnknownFld'))."
                           + " Explicitly mapped fields of this template: 'Body'."
                           + " Inherited explicitly mapped fields: 'Title'."
                           + " Mapped field types: 'Text'.",
            tmpls: new[] { baseTmpl, testTmpl });
    }

    private static void RunExceptionTest<TProfile>(string expectedError, params SitecoreTemplate[] tmpls)
        where TProfile : TemplateMappingProfile, new()
    {
        var target = new TProfile();

        Action act = () => target.MapTemplates(tmpls); // Act

        act.Should().Throw().WithMessage(expectedError);
    }
}
