using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using Frontend.Vanilla.Content.CodeGeneration;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Content.Templates.Mapping;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Utils;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Content.SitecoreTemplateGenerator;

public sealed class SitecoreCodeGenerator(
    string mappingProfileAssembly,
    string mappingProfileType,
    bool includeBaseTemplates,
    string targetFile,
    List<string> templatePaths,
    string sitecoreHost,
    string targetNamespace)
{
    private string MappingProfileAssembly { get; } = mappingProfileAssembly;
    private string MappingProfileType { get; } = mappingProfileType;
    private string TargetFile { get; } = targetFile;
    private string TargetNamespace { get; } = targetNamespace;
    private List<string> TemplatePaths { get; } = templatePaths;
    private string SitecoreHost { get; } = sitecoreHost;
    private bool IncludeBaseTemplates { get; } = includeBaseTemplates;

    public bool Execute()
    {
        try
        {
            Console.WriteLine($"Info: Loading mapping profile type {MappingProfileType} from assembly {MappingProfileAssembly}.");
            var mappingAssembly = Assembly.LoadFrom(MappingProfileAssembly);
            var mappingType = mappingAssembly.GetType(MappingProfileType, true);
            var mappingProfile = (TemplateMappingProfile)Activator.CreateInstance(mappingType);

            var config = new ContentConfigurationBuilder
            {
                Host = new Uri(SitecoreHost),
                TemplatePaths = IncludeBaseTemplates ? EnumerableExtensions.Append(TemplatePaths, "/Vanilla/Framework").ToList() : TemplatePaths,
            };

            var services = new ServiceCollection()
                .AddVanillaSitecoreContent()
                .AddSingleton(config)
                .AddSingleton<CodeManager>()
                .BuildServiceProvider();

            Console.WriteLine($"Reading Sitecore template structure from host '{SitecoreHost}' under paths {TemplatePaths.Dump()}.");
            var baseAssemblySource = IncludeBaseTemplates ? services.GetServices<TemplateAssemblySource>().Single() : null;
            var codeManager = services.GetRequiredService<CodeManager>();

            // write to memory stream first so that generation errors do not destroy the existing file
            Console.WriteLine($"Generating C# code for content access in namespace '{TargetNamespace}' to file '{TargetFile}'");
            var stream = new MemoryStream();
            using (var codeWriter = new CSharpCodeWriter(stream))
                codeManager.WriteCode(codeWriter, mappingProfile, TargetNamespace, baseAssemblySource);

            File.WriteAllBytes(TargetFile, stream.ToArray());

            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Fatal error: {ex}");

            if (ex is ReflectionTypeLoadException rex)
                rex.LoaderExceptions.Each((e, i) => Console.WriteLine($"LoaderExceptions[{i}]: {e}"));

            return false;
        }
    }
}
