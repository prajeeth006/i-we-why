using System;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Content.Templates;
using Frontend.Vanilla.Content.Templates.DataSources;
using Frontend.Vanilla.Content.Templates.Mapping;
using Frontend.Vanilla.Content.Tests.Fakes;
using Frontend.Vanilla.Testing.FluentAssertions;
using Moq;
using Xunit;
using TestAssembly = Frontend.Vanilla.Testing.Fakes.TestAssembly;

namespace Frontend.Vanilla.Content.Tests.Templates.DataSources;

public class ReflectionTemplatesResolverTests
{
    private IReflectionTemplatesResolver target;
    private Mock<TestAssembly> assembly;
    private TemplateAssemblySource assemblySource;

    public ReflectionTemplatesResolverTests()
    {
        assembly = new Mock<TestAssembly>();
        assemblySource = new TemplateAssemblySource(assembly.Object, new TestProfile());
        target = new ReflectionTemplatesResolver();
    }

    [Fact]
    public void ShouldDiscoverTemplatesCorrectly()
    {
        assembly.Setup(a => a.GetTypes()).Returns(new[]
        {
            GetType(), typeof(string), typeof(TraitAttribute), // Unrelated
            typeof(IBase), typeof(IFoo), typeof(IBar), typeof(IIgnoredBecauseOtherProfile),
            typeof(BaseDocument), typeof(FooDocument), typeof(BarDocument), typeof(IgnoredBecauseOtherProfileDocument),
        });
        var externalBase = new ReflectedTemplate(TestSitecoreTemplate.Get(), typeof(IExternalBase), typeof(ExternalBaseDocument));

        // Act
        var reflectedTmpls = target.Resolve(assemblySource, new[] { externalBase }).ToList();

        var baseTmpl = Verify("BaseTmpl", typeof(IBase), typeof(BaseDocument), new SitecoreTemplateField("BaseFld", "Text", true));
        Verify("FooTmpl", typeof(IFoo), typeof(FooDocument), new SitecoreTemplateField("FooFld", "Number", false), baseTmpls: new[] { externalBase.Template });
        Verify("BarTmpl", typeof(IBar), typeof(BarDocument), new SitecoreTemplateField("BarFld", "Date", false), baseTmpls: new[] { baseTmpl });
        reflectedTmpls.Select(t => t.Template.Name).Should().BeEmpty();

        SitecoreTemplate Verify(string name, Type @interface, Type implementation, SitecoreTemplateField field, params SitecoreTemplate[] baseTmpls)
        {
            var tmpl = reflectedTmpls.Should().ContainSingle(t => t.Template.Name == name, name).Which;
            reflectedTmpls.Remove(tmpl);

            tmpl.Interface.Should().Be(@interface);
            tmpl.Implementation.Should().Be(implementation);
            tmpl.Template.Source.Should().Be(implementation.ToString());
            tmpl.Template.BaseTemplates.Should().BeEquivalentTo(baseTmpls);

            tmpl.Template.OwnFields.Select(f => f.Name).Should().Equal(field.Name);
            tmpl.Template.OwnFields[0].Type.Should().Be(field.Type);
            tmpl.Template.OwnFields[0].Shared.Should().Be(field.Shared);

            return tmpl.Template;
        }
    }

    [Fact]
    public void ShouldWrapException()
    {
        var reflectionEx = new Exception("Reflection error");
        assembly.Setup(a => a.GetTypes()).Throws(reflectionEx);

        var innerEx = RunAndExpectWrappedException(); // Act

        innerEx.Should().BeSameAs(reflectionEx);
    }

    [Fact]
    public void ShouldThrow_IfNoTypesFound()
    {
        assembly.Setup(a => a.GetTypes()).Returns(new[]
        {
            GetType(), typeof(string), typeof(TraitAttribute), // Unrelated
            typeof(IBase), typeof(IFoo), typeof(IBar), typeof(IIgnoredBecauseOtherProfile),
        });

        var innerEx = RunAndExpectWrappedException(); // Act

        innerEx.Message.Should().Contain("No template classes found");
    }

    private Exception RunAndExpectWrappedException()
        => new Action(() => target.Resolve(assemblySource, Array.Empty<ReflectedTemplate>()))
            .Should().Throw()
            .WithMessage($"Failed reflecting content templates from {assembly.Object} based on {typeof(TestProfile)}.")
            .Which.InnerException;

    [Fact]
    public void ReflectedTemplate_Test()
    {
        var template = TestSitecoreTemplate.Get();

        // Act
        var reflected = new ReflectedTemplate(template, typeof(IFoo), typeof(FooDocument));

        reflected.Template.Should().BeSameAs(template);
        reflected.Interface.Should().Be(typeof(IFoo));
        reflected.Implementation.Should().Be(typeof(FooDocument));
    }

    [SitecoreTemplate("ExternalTmpl", typeof(OtherIgnoredProfile))]
    public interface IExternalBase
    {
        object ExternalValue { get; }
    }

    [SitecoreTemplate("BaseTmpl", typeof(TestProfile))]
    public interface IBase
    {
        string BaseValue { get; }
    }

    [SitecoreTemplate("FooTmpl", typeof(TestProfile))]
    public interface IFoo : IExternalBase
    {
        int FooValue { get; }
    }

    [SitecoreTemplate("BarTmpl", typeof(TestProfile))]
    public interface IBar : IBase
    {
        DateTime BarValue { get; }
    }

    [SitecoreTemplate("IgnoredBecauseOtherProfileTmpl", typeof(OtherIgnoredProfile))]
    public interface IIgnoredBecauseOtherProfile
    {
        string OtherValue { get; }
    }

    internal abstract class DummyDocument : Document
    {
        public DummyDocument()
            : base(null) { }
    }

    [SitecoreTemplate("ExternalTmpl", typeof(OtherIgnoredProfile))]
    internal sealed class ExternalBaseDocument : DummyDocument, IExternalBase
    {
        [SitecoreField("ExternalFld", "Whatever", true)]
        public object ExternalValue { get; set; }
    }

    [SitecoreTemplate("BaseTmpl", typeof(TestProfile))]
    internal sealed class BaseDocument : DummyDocument, IBase
    {
        [SitecoreField("BaseFld", "Text", true)]
        public string BaseValue { get; set; }
    }

    [SitecoreTemplate("FooTmpl", typeof(TestProfile))]
    internal sealed class FooDocument : DummyDocument, IFoo
    {
        [SitecoreField("ExternalFld", "Whatever", false)]
        public object ExternalValue { get; set; }

        [SitecoreField("FooFld", "Number", false)]
        public int FooValue { get; set; }
    }

    [SitecoreTemplate("BarTmpl", typeof(TestProfile))]
    internal sealed class BarDocument : DummyDocument, IBar
    {
        [SitecoreField("BaseFld", "Text", true)]
        public string BaseValue { get; set; }

        [SitecoreField("BarFld", "Date", false)]
        public DateTime BarValue { get; set; }
    }

    [SitecoreTemplate("IgnoredBecauseOtherProfileTmpl", typeof(OtherIgnoredProfile))]
    internal sealed class IgnoredBecauseOtherProfileDocument : DummyDocument, IIgnoredBecauseOtherProfile
    {
        [SitecoreField("OtherFld", "Text", true)]
        public string OtherValue { get; set; }
    }

    public class TestProfile : DefaultTemplateMappingProfile { }

    public class OtherIgnoredProfile : DefaultTemplateMappingProfile { }
}
