using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.Reflection.Proxy;

/// <summary>
/// Generates C# code of proxy class based on given proxy builder.
/// </summary>
internal interface IRoslynProxyCodeGenerator
{
    string GenerateClassCode(IRoslynProxyBuilder builder);
}

internal sealed class RoslynProxyCodeGenerator : IRoslynProxyCodeGenerator
{
    public static readonly IRoslynProxyCodeGenerator Singleton = new RoslynProxyCodeGenerator();
    private RoslynProxyCodeGenerator() { }

    private static volatile int uniqueNameCounter;

    public string GenerateClassCode(IRoslynProxyBuilder builder)
    {
        Guard.Interface(builder.InterfaceToProxy, nameof(builder.InterfaceToProxy));

        var className = $"{builder.InterfaceToProxy.Name.Substring(1)}{builder.ClassNameInfix}{uniqueNameCounter++}";
        var code = new IndentedStringBuilder();

        code.AppendLine($"namespace {RoslynProxyCompiler.AssemblyName}")
            .AppendLine("{").Indent()
            .AppendLine($"internal sealed class {className} : {builder.InterfaceToProxy.ToCSharp()}")
            .AppendLine("{").Indent();

        if (builder.Fields.Count > 0) // Fields with constructor
        {
            var fields = builder.Fields.ConvertAll((p, _) => (Name: p.Value.Value, Type: p.Key));
            fields.Each(f => code.AppendLine($"private readonly {f.Type.ToCSharp()} {f.Name};"));
            code.AppendLine();

            AppendWithParameters($"public {className}", fields.ConvertAll(f => (f.Name, f.Type, string.Empty)));

            code.AppendLine("{").Indent();
            fields.Each(f => code.AppendLine($"this.{f.Name} = {f.Name};"));
            code.Unindent().AppendLine("}").AppendLine();
        }

        foreach (var member in builder.InterfaceToProxy.GetFlattenedInterfaceMembers())
            try
            {
                switch (member)
                {
                    case PropertyInfo property when property.GetIndexParameters().Length == 0: // Indexers are unsupported -> handled in default case
                        code.AppendLine($"public {property.PropertyType.ToCSharp()} {property.Name}")
                            .AppendLine("{").Indent();

                        if (property.GetMethod != null)
                            AppendAccessor("get", builder.GetPropertyGetterCode(property));
                        if (property.SetMethod != null)
                            AppendAccessor("set", builder.GetPropertySetterCode(property));

                        void AppendAccessor(string accessorType, string accessorCode)
                            => code.AppendLine(accessorType)
                                .AppendLine("{").Indent()
                                .AppendLines(accessorCode)
                                .Unindent().AppendLine("}");

                        code.Unindent().AppendLine("}");

                        break;

                    case MethodInfo method:
                        var genericArguments = method.GetGenericArguments();
                        var genericArgumentsCode = genericArguments.Length > 0 ? $"<{genericArguments.Join()}>" : "";

                        // Explicit interface implementation to avoid generic constraints
                        var declaringType = method.DeclaringType ?? throw new VanillaBugException();
                        var callSignature = $"{method.ReturnType.ToCSharp()} {declaringType.ToCSharp()}.{method.Name}{genericArgumentsCode}";
                        AppendWithParameters(callSignature,
                            method.GetParameters().ConvertAll(p => (p.Name!, p.ParameterType, MethodCSharpGenerator.GetParameterModifier(p))));

                        var methodCode = builder.GetMethodCode(method);
                        code.AppendLine("{").Indent()
                            .AppendLines(methodCode)
                            .Unindent().AppendLine("}");

                        break;

                    default:
                        throw new Exception("Only methods and properties are supported.");
                }

                code.AppendLine();
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed generating code for member {member} ({member.MemberType}) of {member.DeclaringType}.", ex);
            }

        return code
            .Unindent().AppendLine("}")
            .Unindent().AppendLine("}")
            .ToString();

        void AppendWithParameters(string leadingCode, IReadOnlyList<(string Name, Type Type, string Modifier)> parameters)
        {
            if (parameters.Count == 0)
            {
                code.AppendLine(leadingCode + "()");

                return;
            }

            code.AppendLine(leadingCode + "(")
                .Indent();

            foreach (var parameter in parameters)
            {
                var type = parameter.Type.ToCSharp().TrimEnd('&'); // Trim by-ref suffix
                var separator = parameter == parameters.Last() ? ")" : ",";
                code.AppendLine($"{parameter.Modifier}{type} {parameter.Name}{separator}");
            }

            code.Unindent();
        }
    }
}
