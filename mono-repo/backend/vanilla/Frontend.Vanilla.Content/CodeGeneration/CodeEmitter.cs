using System;
using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Content.FieldConversion;
using Frontend.Vanilla.Content.Templates;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;
using JetBrains.Annotations;

namespace Frontend.Vanilla.Content.CodeGeneration;

internal static class CodeEmitter
{
    internal static void Emit(
        [NotNull] CSharpCodeWriter codeWriter,
        [NotNull, ItemNotNull] IEnumerable<SitecoreTemplate> templatesToGenerate,
        [NotNull] IReadOnlyDictionary<TrimmedRequiredString, IReadOnlyDictionary<TrimmedRequiredString, FieldMapping>> mappingsToGenerate,
        [NotNull] Type mappingProfileType,
        [NotNull] TrimmedRequiredString targetNamespace,
        [NotNull] IReadOnlyDictionary<TrimmedRequiredString, Type> externalBaseTemplates)
    {
        Guard.NotNull(codeWriter, nameof(codeWriter));
        templatesToGenerate = Guard.NotNullItems(templatesToGenerate?.Enumerate(), nameof(templatesToGenerate));
        Guard.NotNull(mappingsToGenerate, nameof(mappingsToGenerate));
        Guard.NotNull(mappingProfileType, nameof(mappingProfileType));
        Guard.NotEmpty(targetNamespace, nameof(targetNamespace));
        Guard.NotNull(externalBaseTemplates, nameof(externalBaseTemplates));

        var toGenerate = templatesToGenerate
            .OrderBy(t => t.Name, StringComparer.OrdinalIgnoreCase)
            .Select(t => (Template: t, Mapping: mappingsToGenerate.GetValue(t.Name)))
            .Where(x => x.Mapping != null) // Skip ignored
            .ToList();

        using (codeWriter.BeginNamespace(targetNamespace, GatherImports()))
        {
            using (codeWriter.BeginInterfaceSection(targetNamespace))
                EmitInterfaces();

            using (codeWriter.BeginClassSection(targetNamespace))
                EmitClasses();
        }

        IEnumerable<string> GatherImports()
        {
            var namespaces = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
            {
                "System.Collections.Generic",
                "System.CodeDom.Compiler",
                externalBaseTemplates.Values.Select(t => t.Namespace),
            };

            foreach (var (template, templateMapping) in toGenerate)
            foreach (var (_, fieldMapping) in GetMappedFields(template.OwnFields, templateMapping))
            {
                if (CodeUtilities.GetTypeName(fieldMapping.ClrType).Equals(fieldMapping.ClrType.Name))
                    namespaces.Add(fieldMapping.ClrType.Namespace);

                var genericArgumentTypeNames = CodeUtilities.GetGenericArgumentTypeNames(fieldMapping.ClrType)?.ToList();

                if (genericArgumentTypeNames != null)
                    for (var i = 0; i < genericArgumentTypeNames.Count; ++i)
                    {
                        var genericArgumentTypeName = genericArgumentTypeNames[i];
                        var typeArgument = fieldMapping.ClrType.GetGenericArguments()[i];

                        if (genericArgumentTypeName.Equals(typeArgument.Name))
                            namespaces.Add(typeArgument.Namespace);
                    }
            }

            return namespaces
                .Where(n => !string.IsNullOrWhiteSpace(n))
                .OrderBy(n => n);
        }

        void EmitInterfaces()
        {
            foreach (var (template, templateMapping) in toGenerate)
            {
                var baseNames = template.BaseTemplates
                    .Where(t => !externalBaseTemplates.ContainsKey(t.Name) && toGenerate.Any(g => g.Template.Name.EqualsIgnoreCase(t.Name))) // Skip ignored
                    .Select(e => NormalizeName(e.Name)).OrderBy(e => e);
                var externalBase = externalBaseTemplates.Where(t => template.BaseTemplates.Any(b => b.Name == t.Key)).Select(t => t.Value.FullName);

                using (codeWriter.BeginInterface(template.Name, NormalizeName(template.Name), baseNames, externalBase, mappingProfileType))
                    foreach (var (field, fieldMapping) in GetMappedFields(template.OwnFields, templateMapping))
                    {
                        var outputFieldName = NormalizeName(field.Name);
                        codeWriter.InterfaceField(fieldMapping, outputFieldName, field.Name);
                    }
            }
        }

        void EmitClasses()
        {
            foreach (var (template, templateMapping) in toGenerate)
            {
                var className = NormalizeName(template.Name);

                using (codeWriter.BeginClass(template.Name, className, mappingProfileType))
                {
                    var mappedFields = GetMappedFields(template.AllFields, templateMapping).ToList();

                    foreach (var (field, fieldMapping) in mappedFields)
                    {
                        var outputFieldName = NormalizeName(field.Name);
                        codeWriter.ClassField(fieldMapping, outputFieldName, field.Name, field);
                    }

                    using (codeWriter.BeginConstructor(className))
                        foreach (var (field, fieldMapping) in mappedFields)
                        {
                            var outputFieldName = NormalizeName(field.Name);
                            codeWriter.ClassFieldInitialization(fieldMapping, outputFieldName, field.Name);
                        }
                }
            }
        }
    }

    private static IEnumerable<(SitecoreTemplateField, FieldMapping)> GetMappedFields(IEnumerable<SitecoreTemplateField> fields,
        IReadOnlyDictionary<TrimmedRequiredString, FieldMapping> mappings)
        => fields
            .OrderBy(f => f.Name)
            .Select(f => (f, Mapping: mappings.GetValue(f.Name)))
            .Where(f => f.Mapping != null); // Skip ignored fields

    private static string NormalizeName([NotNull] string name)
    {
        Guard.NotWhiteSpace(name, nameof(name));
        var result = name.RemoveAll(" ");

        if (string.IsNullOrWhiteSpace(result))
            throw new ArgumentException("Value cannot be null or whitespace.", nameof(name));

        return char.ToUpperInvariant(result[0]) +
               (result.Length > 1 ? result.Substring(1) : string.Empty);
    }
}
