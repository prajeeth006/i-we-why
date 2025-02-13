using System;
using System.CodeDom.Compiler;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using FluentAssertions;
using Frontend.Vanilla.Content.CodeGeneration;
using Frontend.Vanilla.Content.FieldConversion;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Content.Templates;
using Frontend.Vanilla.Content.Templates.DataSources;
using Frontend.Vanilla.Content.Templates.Mapping;
using Frontend.Vanilla.Content.Tests.Fakes;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Testing.Moq;
using JetBrains.Annotations;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Xunit;
using Xunit.Sdk;

namespace Frontend.Vanilla.Content.Tests.CodeGeneration;

public class CodeGenerationTests
{
    [Fact]
    public void ShouldGenerateTemplatesCorrectly()
    {
        var profile = new TestCodeGenerationProfile();
        var baseTmpl = TestSitecoreTemplate.Get("Base Test Tmpl", fields: new[]
        {
            TestSitecoreTemplate.GetField("Count"),
        });
        var fooTmpl = TestSitecoreTemplate.Get("Foo Tmpl", baseTmpls: new[] { baseTmpl }, fields: new[]
        {
            TestSitecoreTemplate.GetField("Page Title", type: "Test Type"),
        });

        // Act
        var generatedAssembly = RunCodeGeneration(profile, new[] { baseTmpl, fooTmpl });

        var generatedTypes = generatedAssembly.GetTypes();
        var baseTmplIface = VerifyInterface(generatedTypes, "IBaseTestTmpl", expectedBaseIface: typeof(IDocument));
        var baseTmplImpl = VerifyImplementation(generatedTypes, "BaseTestTmplDocument", expectToImplement: baseTmplIface);
        baseTmplIface.GetProperties().Select(p => (p.Name, p.PropertyType)).ToDictionary().Should()
            .BeEquivalentTo(new Dictionary<string, Type> { { "Count", typeof(int) } });

        var fooTmplIface = VerifyInterface(generatedTypes, "IFooTmpl", expectedBaseIface: baseTmplIface);
        var fooTmplImpl = VerifyImplementation(generatedTypes, "FooTmplDocument", expectToImplement: fooTmplIface);
        fooTmplIface.GetProperties().Select(p => (p.Name, p.PropertyType)).ToDictionary().Should()
            .BeEquivalentTo(new Dictionary<string, Type> { { "PageTitle", typeof(string) } });

        var reflectedTmpls = new ReflectionTemplatesResolver().Resolve(new TemplateAssemblySource(generatedAssembly, profile), Array.Empty<ReflectedTemplate>());
        reflectedTmpls.Should().BeEquivalentTo(new[]
        {
            new ReflectedTemplate(baseTmpl, baseTmplIface, baseTmplImpl),
            new ReflectedTemplate(fooTmpl, fooTmplIface, fooTmplImpl),
        }, o => o.Excluding(c => c.Path.EndsWith(nameof(SitecoreTemplate.Source))));
    }

    [Fact]
    public void ShouldInheritVanillaTemplatesCorrectly()
    {
        var profile = new InheritedTestCodeGenerationProfile();
        var vanillaTmpls = GetExistingVanillaTemplates(out var vanillaAssemblySource).ToList();
        var filterTmpl = vanillaTmpls.Select(t => t.Template).Single(t => t.Name == "Filter Template");
        var fooTmpl = TestSitecoreTemplate.Get("Foo Tmpl", baseTmpls: new[] { filterTmpl }, fields: new[]
        {
            TestSitecoreTemplate.GetField("Page Title", type: "Test Type"),
        });

        // Act
        var generatedAssembly = RunCodeGeneration(profile, vanillaTmpls.Select(t => t.Template).Append(fooTmpl), vanillaTmpls, vanillaAssemblySource);

        var generatedTypes = generatedAssembly.GetTypes();
        var fooTmplIface = VerifyInterface(generatedTypes, "IFooTmpl", typeof(IFilterTemplate));
        VerifyImplementation(generatedTypes, "FooTmplDocument", expectToImplement: fooTmplIface);
        fooTmplIface.GetProperties().Select(p => (p.Name, p.PropertyType)).ToDictionary().Should()
            .BeEquivalentTo(new Dictionary<string, Type> { { "PageTitle", typeof(string) } });
    }

    private static Assembly RunCodeGeneration(
        TemplateMappingProfile profile,
        IEnumerable<SitecoreTemplate> sitecoreTmpls,
        IEnumerable<ReflectedTemplate> externalBaseTmpls = null,
        TemplateAssemblySource baseAssemblySource = null)
    {
        var ms = new MemoryStream();
        var sitecoreTemplatesSource = new Mock<ISitecoreServiceTemplatesSource>();
        var reflectionTemplatesResolver = new Mock<IReflectionTemplatesResolver>();
        var target = new CodeManager(sitecoreTemplatesSource.Object, reflectionTemplatesResolver.Object);

        sitecoreTemplatesSource.SetupWithAnyArgs(s => s.GetTemplatesAsync(default, null, default)).ReturnsAsync(sitecoreTmpls.ToList);
        reflectionTemplatesResolver.SetupWithAnyArgs(r => r.Resolve(null, null)).Returns(externalBaseTmpls.NullToEmpty());

        // Act
        using (var writer = new CSharpCodeWriter(ms))
            target.WriteCode(writer, profile, "Bwin.Product", baseAssemblySource);

        var cSharpCode = ms.ToArray().DecodeToString();
        var syntaxTree = CSharpSyntaxTree.ParseText(cSharpCode);
        var references = new[]
        {
            typeof(object).Assembly,
            typeof(ArrayList).Assembly,
            typeof(GeneratedCodeAttribute).Assembly,
            typeof(CanBeNullAttribute).Assembly,
            GetAssembly("NetStandard"),
            GetAssembly("System.Runtime"),
            GetAssembly("Frontend.Vanilla.Core"),
            GetAssembly("Frontend.Vanilla.Content"),
            typeof(TestCodeGenerationProfile).Assembly,
        };
        var compilation = CSharpCompilation.Create(
            assemblyName: Path.GetRandomFileName(),
            syntaxTrees: new[] { syntaxTree },
            references: references.Select(r => MetadataReference.CreateFromFile(r.Location)),
            options: new CSharpCompilationOptions(OutputKind.DynamicallyLinkedLibrary));

        ms = new MemoryStream();
        var result = compilation.Emit(ms);

        if (!result.Success)
        {
            Console.WriteLine("Compilation failed. See errors and actual generated code below.");
            foreach (var error in result.Diagnostics.Where(d => d.IsWarningAsError || d.Severity == DiagnosticSeverity.Error))
                Console.WriteLine($"{error.Id}{error.Location.GetLineSpan()} - {error.GetMessage()}");

            Console.WriteLine(Environment.NewLine + Environment.NewLine);
            Console.WriteLine("Actual generated code:");
            Console.WriteLine(cSharpCode);

            throw new XunitException("Compilation failed. See errors and actual generated code below.");
        }

        return Assembly.Load(ms.ToArray());
    }

    private static Assembly GetAssembly(string assemblyName)
        => AppDomain.CurrentDomain.GetAssemblies().Single(a => a.GetName().Name.Equals(assemblyName, StringComparison.OrdinalIgnoreCase));

    private static Type VerifyInterface(IEnumerable<Type> generatedTypes, string name, Type expectedBaseIface)
    {
        var iface = generatedTypes.Single(t => t.IsInterface && t.IsPublic && typeof(IDocument).IsAssignableFrom(t) && t.Name == name);
        iface.GetInterfaces().Should().BeEquivalentTo(EnumerableExtensions.Append(expectedBaseIface.GetInterfaces(), expectedBaseIface));

        return iface;
    }

    private static Type VerifyImplementation(IEnumerable<Type> generatedTypes, string name, Type expectToImplement)
    {
        var impl = generatedTypes.Single(t => t.IsClass && !t.IsPublic && t.BaseType == typeof(Document) && t.Name == name);
        impl.GetInterfaces().Should()
            .BeEquivalentTo(EnumerableExtensions.Append(typeof(Document).GetInterfaces().Append(expectToImplement.GetInterfaces()), expectToImplement).Distinct());

        return impl;
    }

    private static IEnumerable<ReflectedTemplate> GetExistingVanillaTemplates(out TemplateAssemblySource assemblySource)
    {
        var services = new ServiceCollection().AddVanillaSitecoreContent().BuildServiceProvider();
        var resolver = services.GetRequiredService<IReflectionTemplatesResolver>();
        assemblySource = services.GetRequiredService<TemplateAssemblySource>();

        return resolver.Resolve(assemblySource, Array.Empty<ReflectedTemplate>());
    }
}

public class TestCodeGenerationProfile : TemplateMappingProfile
{
    public IFieldConverter<string> StringConverter { get; } = Mock.Of<IFieldConverter<string>>();
    public IFieldConverter<int> IntConverter { get; } = Mock.Of<IFieldConverter<int>>();

    protected override void OnMap()
    {
        MapFieldsOfType("Test Type", StringConverter);

        MapTemplate("Base Test Tmpl", t => { t.MapField("Count", IntConverter); });
    }
}

public class InheritedTestCodeGenerationProfile : DefaultTemplateMappingProfile
{
    public IFieldConverter<string> StringConverter { get; } = Mock.Of<IFieldConverter<string>>();

    protected override void OnMap()
    {
        base.OnMap();

        MapFieldsOfType("Test Type", StringConverter);
    }
}
