using System;
using System.Collections.Concurrent;
using System.Linq.Expressions;
using System.Reflection;

namespace Frontend.Vanilla.Content.Loading.Deserialization;

internal static class DocumentFactory
{
    private static readonly ConcurrentDictionary<Type, Func<DocumentData, IDocument>> Constructors = new ConcurrentDictionary<Type, Func<DocumentData, IDocument>>();

    public static IDocument Create(Type type, DocumentData data)
    {
        var func = Constructors.GetOrAdd(type, CompileConstructor);

        return func.Invoke(data);
    }

    private static Func<DocumentData, IDocument> CompileConstructor(Type type)
    {
        // Compiled expressions are about 10x faster than reflection, see http://www.palmmedia.de/Blog/2012/2/4/reflection-vs-compiled-expressions-vs-delegates-performance-comparision
        const BindingFlags flags = BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.CreateInstance;
        var ctor = type.GetConstructor(flags, null, new[] { typeof(DocumentData) }, null)
                   ?? throw new Exception($"Unable to create {type} because missing constructor({typeof(DocumentData)}).");
        var argExpr = Expression.Parameter(typeof(DocumentData), "data");
        var ctorExpr = Expression.New(ctor, argExpr);

        return Expression.Lambda<Func<DocumentData, IDocument>>(ctorExpr, argExpr).Compile();
    }
}
