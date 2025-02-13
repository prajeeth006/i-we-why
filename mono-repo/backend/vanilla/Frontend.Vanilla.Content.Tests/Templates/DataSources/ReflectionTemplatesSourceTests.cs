using System;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Content.FieldConversion;
using Frontend.Vanilla.Content.Templates;
using Frontend.Vanilla.Content.Templates.DataSources;
using Frontend.Vanilla.Content.Templates.Mapping;
using Frontend.Vanilla.Content.Tests.Fakes;
using Frontend.Vanilla.Content.Tests.Templates.Mapping;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Templates.DataSources;

public class ReflectionTemplatesSourceTests
{
    [Fact]
    public void ShouldDiscoverAndMapAllTemplatesCorrectly()
    {
        var reflectionTemplatesResolver = new Mock<IReflectionTemplatesResolver>();

        var vanillaProfile = new Mock<TemplateMappingProfile>();
        var vanillaSrc = new TemplateAssemblySource(Mock.Of<TestAssembly>(a => a.FullName == "Frontend.Vanilla.Content"), vanillaProfile.Object);
        var vanillaReflected = new ReflectedTemplate(TestSitecoreTemplate.Get("VanillaTmpl"), typeof(IWhatever), typeof(VanillaDocument));
        var vanillaFields = new Dictionary<TrimmedRequiredString, FieldMapping> { { "Field1", MockMapping() }, { "Field2", MockMapping() } };

        reflectionTemplatesResolver.Setup(r => r.Resolve(vanillaSrc, Array.Empty<ReflectedTemplate>())).Returns(new[] { vanillaReflected });
        vanillaProfile.Setup(p => p.MapTemplates(new[] { vanillaReflected.Template })).Returns(
            new Dictionary<TrimmedRequiredString, IReadOnlyDictionary<TrimmedRequiredString, FieldMapping>> { { "VanillaTmpl", vanillaFields } });

        var productProfile = new Mock<TemplateMappingProfile>();
        var productSrc = new TemplateAssemblySource(Mock.Of<TestAssembly>(a => a.FullName == "Bwin.Sports"), productProfile.Object);
        var productRreflected = new ReflectedTemplate(TestSitecoreTemplate.Get("ProductTmpl"), typeof(IWhatever), typeof(ProductDocument));
        var productFields = new Dictionary<TrimmedRequiredString, FieldMapping> { { "Field3", MockMapping() }, { "Field4", MockMapping() } };

        reflectionTemplatesResolver.Setup(r => r.Resolve(productSrc, new[] { vanillaReflected })).Returns(new[] { productRreflected });
        productProfile.Setup(p => p.MapTemplates(new[] { productRreflected.Template, vanillaReflected.Template })).Returns(
            new Dictionary<TrimmedRequiredString, IReadOnlyDictionary<TrimmedRequiredString, FieldMapping>> { { "ProductTmpl", productFields } });

        // Act
        IReflectionTemplatesSource target = new ReflectionTemplatesSource(reflectionTemplatesResolver.Object, new[] { vanillaSrc, productSrc });

        target.Templates.Should().BeEquivalentTo(new List<SitecoreTemplate> { { vanillaReflected.Template }, { productRreflected.Template } });
        target.Mappings.Should().BeEquivalentTo(
            new Dictionary<TrimmedRequiredString, (Type Implementation, IReadOnlyDictionary<TrimmedRequiredString, FieldMapping> FieldMappings)>
            {
                { "VanillaTmpl", (typeof(VanillaDocument), vanillaFields) },
                { "ProductTmpl", (typeof(ProductDocument), productFields) },
            });
    }

    private static FieldMapping MockMapping() => Mock.Of<IFieldConverter<string>>().AsMapping();

    internal interface IWhatever { }

    internal sealed class VanillaDocument : IWhatever { }

    internal sealed class ProductDocument : IWhatever { }
}
