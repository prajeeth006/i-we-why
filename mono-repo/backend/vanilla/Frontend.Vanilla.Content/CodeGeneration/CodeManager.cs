using System;
using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Content.Templates.DataSources;
using Frontend.Vanilla.Content.Templates.Mapping;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;
using JetBrains.Annotations;

namespace Frontend.Vanilla.Content.CodeGeneration;

internal sealed class CodeManager(ISitecoreServiceTemplatesSource sitecoreTemplatesSource, IReflectionTemplatesResolver reflectionTemplatesResolver)
{
    public void WriteCode(
        [NotNull] CSharpCodeWriter codeWriter,
        [NotNull] TemplateMappingProfile mappingProfile,
        [NotNull] TrimmedRequiredString targetNamespace,
        [CanBeNull] TemplateAssemblySource baseAssemblySource)
    {
        Guard.NotNull(codeWriter, nameof(codeWriter));
        Guard.NotNull(mappingProfile, nameof(mappingProfile));
        Guard.NotNull(targetNamespace, nameof(targetNamespace));

        var templatesTask = sitecoreTemplatesSource.GetTemplatesAsync(ExecutionMode.Sync, Console.WriteLine, verbose: true);
        var templates = ExecutionMode.ExecuteSync(templatesTask);
        var baseTemplateNamesAndTypes = ResolveBaseTemplateNamesAndTypes(baseAssemblySource);

        var baseTemplates = templates.Where(t => baseTemplateNamesAndTypes.ContainsKey(t.Name)).ToList();
        var templatesToGenerate = templates.Except(baseTemplates).ToList();

        var mappings = mappingProfile.MapTemplates(templates);

        Console.WriteLine($"Loaded {templatesToGenerate.Count} templates (+{baseTemplates.Count} base Vanilla templates), mapped and generating them.");
        CodeEmitter.Emit(codeWriter, templatesToGenerate, mappings, mappingProfile.GetType(), targetNamespace, baseTemplateNamesAndTypes);
    }

    private IReadOnlyDictionary<TrimmedRequiredString, Type> ResolveBaseTemplateNamesAndTypes([CanBeNull] TemplateAssemblySource baseAssemblySource)
    {
        if (baseAssemblySource == null)
            return EmptyDictionary<TrimmedRequiredString, Type>.Singleton;

        var templates = reflectionTemplatesResolver.Resolve(baseAssemblySource, Array.Empty<ReflectedTemplate>());

        // ReSharper disable once RedundantCast
        return templates.ToDictionary(t => (TrimmedRequiredString)t.Template.Name, t => t.Interface, RequiredStringComparer.OrdinalIgnoreCase.AsTrimmed());
    }
}
