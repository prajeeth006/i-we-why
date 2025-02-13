using System;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;

namespace Frontend.Vanilla.Core.Reflection.Proxy;

/// <summary>
/// Compiles given code of a type to dynamic assembly in memory and loads it.
/// </summary>
internal interface IRoslynProxyCompiler
{
    Type[] CompileTypes(string cSharpCode);
}

internal sealed class RoslynProxyCompiler : IRoslynProxyCompiler
{
    public const string AssemblyName = "Frontend.Vanilla.RoslynProxy"; // Must match [InternalsVisibleTo] in GlobalAssemblyInfo.cs

    public static readonly IRoslynProxyCompiler Singleton = new RoslynProxyCompiler();
    private RoslynProxyCompiler() { }

    public Type[] CompileTypes(string cSharpCode)
    {
        var references = AppDomain.CurrentDomain.GetAssemblies() // Determining actually used assemblies is complicated -> grab them all
            .Where(a => !a.IsDynamic && !string.IsNullOrWhiteSpace(a.Location))
            .Select(r => MetadataReference.CreateFromFile(r.Location));
        var options = new CSharpCompilationOptions(OutputKind.DynamicallyLinkedLibrary);
        var memoryStream = new MemoryStream();

        // Actual compilation
        var syntaxTree = CSharpSyntaxTree.ParseText(cSharpCode);
        var compilation = CSharpCompilation.Create(AssemblyName, new[] { syntaxTree }, references, options);
        var result = compilation.Emit(memoryStream);

        if (!result.Success)
        {
            var message = new StringBuilder()
                .AppendLine("Failed to compile proxy class. See errors. Generated code is below.");

            foreach (var error in result.Diagnostics.Where(d => d.IsWarningAsError || d.Severity == DiagnosticSeverity.Error))
                message.AppendLine($"{error.Id}{error.Location.GetLineSpan()} - {error.GetMessage()}");

            message.AppendLine().AppendLine()
                .AppendLine("Actual generated code:")
                .AppendLine(cSharpCode);

            throw new Exception(message.ToString());
        }

        var generatedAssembly = Assembly.Load(memoryStream.ToArray());

        return generatedAssembly.GetTypes();
    }
}
