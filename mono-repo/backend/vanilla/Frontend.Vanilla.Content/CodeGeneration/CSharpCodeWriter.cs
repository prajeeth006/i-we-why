using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Frontend.Vanilla.Content.FieldConversion;
using Frontend.Vanilla.Content.Templates;
using Frontend.Vanilla.Content.Templates.Mapping;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.Core.Reflection;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Content.CodeGeneration;

/// <summary>
/// Generates strongly typed documents in C#.
/// </summary>
/// <remarks>
/// After having some problems with both NVelocity, and StringTemplate, I decided to go for the manual
/// approach, don't hit me.
/// </remarks>
internal sealed class CSharpCodeWriter(Stream targetStream, bool ownsStream = false, string indentation = "    ") : IDisposable
{
    private IndentedTextWriter TextWriter { get; } = new (targetStream, ownsStream, indentation);

    public IDisposable BeginNamespace(string namespaceName, IEnumerable<string> imports)
    {
        TextWriter.WriteLine("#pragma warning disable 1591");
        TextWriter.WriteLine("#nullable enable");

        foreach (var import in imports)
        {
            TextWriter.WriteLine("using " + import + ";");
        }

        TextWriter.WriteLine("using " + namespaceName + ".Implementation;");
        TextWriter.WriteLine();

        return new DisposableAction(() => TextWriter.WriteLine("#pragma warning restore 1591"));
    }

    public IDisposable BeginInterfaceSection(string namespaceName)
    {
        TextWriter.WriteLine("namespace " + namespaceName);
        TextWriter.Write("{");

        return new DisposableAction(() =>
        {
            TextWriter.WriteLine("}");
            TextWriter.WriteLine();
        });
    }

    public IDisposable BeginInterface(string templateName, string interfaceName, IEnumerable<string> bases, IEnumerable<string> externalBases, Type mappingProfile)
    {
        bases = bases.ToList();
        externalBases = externalBases.ToList();

        TextWriter.Indent();
        TextWriter.WriteLine();
        TextWriter.WriteLine("/// <summary>");
        TextWriter.WriteLine("/// Interface that maps to the <c>" + templateName + "</c> content template.");
        TextWriter.WriteLine("/// </summary>");
        TextWriter.WriteLine($"[{GetName<SitecoreTemplateAttribute>()}(\"{templateName}\", typeof({mappingProfile.FullName}))]");
        TextWriter.WriteLine($"[GeneratedCodeAttribute(\"Frontend.Vanilla.Content.CodeGenerator\", \"{ThisAssemblyVersion}\")]");
        TextWriter.WriteLine("[Bwin.SCM.NCover.NCoverExcludeAttribute]");
        TextWriter.Write("public interface I" + interfaceName + " : ");

        bases = !bases.Any() && !externalBases.Any()
            ? new[] { "Frontend.Vanilla.Content.IDocument" }
            : bases.Select(b => "I" + b).ToArray();
        bases = bases.Concat(externalBases);

        TextWriter.Write(bases.Join());

        TextWriter.WriteLine();
        TextWriter.Write("{");

        return new DisposableAction(() =>
        {
            TextWriter.WriteLine("}");
            TextWriter.Unindent();
        });
    }

    public void InterfaceField(FieldMapping fieldMapping, string fieldName, string originalFieldName)
    {
        TextWriter.Indent();

        TextWriter.WriteLine();
        TextWriter.WriteLine("/// <summary> ");
        TextWriter.WriteLine("/// Property that maps to the <c>" + originalFieldName + "</c> content field.");
        TextWriter.WriteLine("/// </summary>");

        if (fieldMapping.ObsoleteMessage != null)
            TextWriter.WriteLine($@"[System.Obsolete(""{fieldMapping.ObsoleteMessage.Value.Replace("\"", "\\\"")}"")]");

        TextWriter.WriteLine($"{CodeUtilities.GetTypeName(fieldMapping.ClrType)}{(fieldMapping.IsNullableReference ? "?" : "")} {fieldName} {{ get; }}");

        TextWriter.Unindent();
    }

    public IDisposable BeginClassSection(string namespaceName)
    {
        TextWriter.WriteLine("namespace " + namespaceName + ".Implementation");
        TextWriter.Write("{");

        return new DisposableAction(() => TextWriter.WriteLine("}"));
    }

    public IDisposable BeginClass(string templateName, string className, Type mappingProfile)
    {
        TextWriter.Indent();
        TextWriter.WriteLine();
        TextWriter.WriteLine($"[{GetName<SitecoreTemplateAttribute>()}(\"{templateName}\", typeof({mappingProfile.FullName}))]");
        TextWriter.WriteLine($"[GeneratedCodeAttribute(\"Frontend.Vanilla.Content.CodeGenerator\", \"{ThisAssemblyVersion}\")]");
        TextWriter.WriteLine("[Bwin.SCM.NCover.NCoverExcludeAttribute]");
        TextWriter.WriteLine("[System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverageAttribute]");
        TextWriter.Write("internal sealed partial class " + className + "Document : Frontend.Vanilla.Content.Document,I" + className);

        TextWriter.WriteLine();
        TextWriter.WriteLine("{");

        return new DisposableAction(() =>
        {
            TextWriter.WriteLine("}");
            TextWriter.Unindent();
        });
    }

    public void ClassField(FieldMapping fieldMapping, string outputFieldName, string originalFieldName, SitecoreTemplateField templateField)
    {
        TextWriter.Indent();
        TextWriter.WriteLine(
            $"[{GetName<SitecoreFieldAttribute>()}(\"{originalFieldName}\", \"{templateField.Type}\", shared: {templateField.Shared.ToString().ToLower()})]");
        TextWriter.WriteLine($"public {CodeUtilities.GetTypeName(fieldMapping.ClrType)} {outputFieldName} {{ get; }}");
        TextWriter.WriteLine();
        TextWriter.Unindent();
    }

    public IDisposable BeginConstructor(string className)
    {
        TextWriter.Indent();
        TextWriter.WriteLine($"public {className}Document(Frontend.Vanilla.Content.DocumentData data)");
        TextWriter.Indent();
        TextWriter.WriteLine(": base(data)");
        TextWriter.Unindent();
        TextWriter.WriteLine("{");

        return new DisposableAction(() =>
        {
            TextWriter.WriteLine("}");
            TextWriter.Unindent();
        });
    }

    public void ClassFieldInitialization(FieldMapping fieldMapping, string outputFieldName, string originalFieldName)
    {
        TextWriter.Indent();
        TextWriter.WriteLine($"{outputFieldName} = GetValue<{CodeUtilities.GetTypeName(fieldMapping.ClrType)}>(\"{originalFieldName}\");");
        TextWriter.Unindent();
    }

    public void Dispose()
    {
        TextWriter?.Dispose();
    }

    private static string GetName<TAttribute>()
        where TAttribute : Attribute
        => typeof(TAttribute).ToString().RemoveSuffix(nameof(Attribute));

    private static readonly string ThisAssemblyVersion = typeof(CSharpCodeWriter).Assembly.GetFileVersion().ToString();
}
